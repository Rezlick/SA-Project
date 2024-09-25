package controller

import (
	"net/http"
	"github.com/SA_Project/config"
	"github.com/SA_Project/entity"
	"github.com/gin-gonic/gin"
	"fmt"
	"time"
)

func CheckCoupon(c *gin.Context){
	var coupon entity.Coupon

	couponCode := c.Param("code")

	db := config.DB()

	result := db.Where("code = ?", couponCode).First(&coupon)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": db.Find(&coupon).Error.Error()})
		return
	}

	currentTime := time.Now()
	if currentTime.After(coupon.ExpiredDate.Add(24 * time.Hour)) {
		c.JSON(http.StatusBadRequest, gin.H{
			"isExpire": true,
			"message":  "Coupon has expired",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"isValid": true,
		"message": "Coupon is valid",
		"discount": coupon.Discount,
		"couponID": coupon.ID,
	})
}

func GetCoupon(c *gin.Context) {
	var coupon []entity.Coupon
	db := config.DB()

	results := db.
		Preload("Employee").
		Find(&coupon)

	if results.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, &coupon)
}

func CreateCoupon(c *gin.Context) {
    var coupon entity.Coupon

    // Bind JSON to the Booking struct
    if err := c.ShouldBindJSON(&coupon); err != nil {
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
    if err := tx.Create(&coupon).Error; err != nil {
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
        "coupon_id": coupon.ID,
    })
}
