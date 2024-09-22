package controller

import (
	"net/http"
	"github.com/SA_Project/config"
	"github.com/SA_Project/entity"
	"github.com/gin-gonic/gin"
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

	c.JSON(http.StatusOK, gin.H{
		"isValid": true,
		"message": "Coupon is valid",
		"discount": coupon.Discount,
		"couponID": coupon.ID,
	})
}