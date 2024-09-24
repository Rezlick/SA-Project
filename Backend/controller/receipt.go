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

func GetMemberCountByReceiptToday(c *gin.Context) {
	var count int64

	db := config.DB()
	results := db.Raw(`SELECT COUNT(id) FROM receipts WHERE strftime('%Y-%m-%d', created_at) = strftime('%Y-%m-%d', 'now') AND member_id != 0`).Scan(&count)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"memberCount": count})
}
