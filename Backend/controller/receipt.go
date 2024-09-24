package controller

import (
	"net/http"
	"github.com/SA_Project/config"
	"github.com/SA_Project/entity"
	"github.com/gin-gonic/gin"
	"fmt"
    "time"
)

// func GetReceipts(c *gin.Context){
// 	var receipts []entity.Receipt
// 	db := config.DB()
	
// 	results := db.Preload("Member").
// 	Preload("Employee").
// 	Preload("Coupon").
// 	Preload("Booking").
// 	Preload("Booking.Table").
// 	Find(&receipts)
// 	if results.Error != nil {
//         c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
//         return
//     }
// 	c.JSON(http.StatusOK, &receipts)
// }

func GetReceipts(c *gin.Context) {
	var receipts []entity.Receipt
	db := config.DB()

	// โหลด TimeZone ของประเทศไทย
	location, err := time.LoadLocation("Asia/Bangkok")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error loading location"})
		return
	}

	// ดึงวันที่ปัจจุบันตามเขตเวลาไทย
	today := time.Now().In(location)

	results := db.Preload("Member").
		Preload("Employee").
		Preload("Coupon").
		Preload("Booking").
		Preload("Booking.Table").
        Preload("TypePayment").
		Where("DATE(created_at) = ?", today.Format("2006-01-02")). // เปรียบเทียบเฉพาะวันที่
		Find(&receipts)

	if results.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, &receipts)
}

func CreateReceipt(c *gin.Context) {
    var receipt entity.Receipt

    // Bind JSON to the Booking struct
    if err := c.ShouldBindJSON(&receipt); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
        return
    }

    db := config.DB()
    if db == nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
        return
    }

    tx := db.Begin()
    if tx.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
        return
    }

    defer func() {
        if r := recover(); r != nil {
            tx.Rollback()
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction failed: " + fmt.Sprintf("%v", r)})
        }
    }()

    // Create the booking
    if err := tx.Create(&receipt).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create receipt: " + err.Error()})
        return
    }

    if err := tx.Commit().Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction commit failed: " + err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "message":    "receipt created successfully",
        "receipt_id": receipt.ID,
    })
}

// DeleteBooking - ฟังก์ชันสำหรับลบข้อมูล booking แบบ soft delete
func DeleteBookingAfterPay(c *gin.Context) {
    ID := c.Param("id")
    db := config.DB()

    var booking entity.Booking
    if err := db.First(&booking, ID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
        return
    }

    tx := db.Begin()
    if tx.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
        return
    }

    defer func() {
        if r := recover(); r != nil {
            tx.Rollback()
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction failed: " + fmt.Sprintf("%v", r)})
        }
    }()

    // Soft delete booking
    if err := tx.Model(&booking).Update("deleted_at", time.Now()).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to soft delete booking: " + err.Error()})
        return
    }

    // ลบข้อมูลใน booking_soups ที่เชื่อมโยงกับ booking
    if err := tx.Where("booking_id = ?", booking.ID).Delete(&entity.BookingSoup{}).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete associated booking_soups: " + err.Error()})
        return
    }

    // Update the table status to 3 (ระหว่างทำความสะอาด)
    var table entity.Table
    if err := tx.First(&table, booking.TableID).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find table associated with booking"})
        return
    }

    table.TableStatusID = 3
    if err := tx.Save(&table).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update table status to 3"} )
        return
    }

    // Commit Transaction
    if err := tx.Commit().Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction commit failed"})
        return
    }

    // ส่ง Response กลับก่อนเพื่อแจ้งว่าลบสำเร็จ
    c.JSON(http.StatusOK, gin.H{"message": "Booking deleted and table status updated to 3 successfully"})

    // ใช้ Goroutine เพื่อเปลี่ยนสถานะของโต๊ะกลับไปเป็น 1 หลังจากผ่านไป 5 วินาที
    go func() {
        time.Sleep(5 * time.Second)

        // เปิดการเชื่อมต่อฐานข้อมูลใหม่
        db := config.DB()
        if db == nil {
            fmt.Println("Failed to connect to database")
            return
        }

        // หาโต๊ะจาก ID เดิม
        if err := db.First(&table, booking.TableID).Error; err != nil {
            fmt.Println("Failed to find table after deletion:", err)
            return
        }

        // เปลี่ยนสถานะของโต๊ะกลับไปเป็น 1 (Available)
        table.TableStatusID = 1
        if err := db.Save(&table).Error; err != nil {
            fmt.Println("Failed to update table status to 1:", err)
            return
        }
    }()
}
