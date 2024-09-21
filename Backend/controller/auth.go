package controller

import (
	"net/http"
	"time"


	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"github.com/SA_Project/config"
	"github.com/SA_Project/entity"
	"github.com/SA_Project/services"
)

type (
	Authen struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
)

func SignIn(c *gin.Context) {
	var payload Authen
	var employee entity.Employee

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ค้นหา user ด้วย Email ที่ผู้ใช้กรอกเข้ามา
	if err := config.DB().Raw("SELECT * FROM employees WHERE email = ?", payload.Email).Scan(&employee).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบรหัสผ่าน
	err := bcrypt.CompareHashAndPassword([]byte(employee.Password), []byte(payload.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสผ่านไม่ถูกต้อง"})
		return
	}

	jwtWrapper := services.JwtWrapper{
		SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	signedToken, err := jwtWrapper.GenerateToken(employee.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
		return
	}

	// Calculate expiration time based on current time + expiration duration
	expirationTime := time.Now().Add(time.Hour * time.Duration(jwtWrapper.ExpirationHours)).Unix()

	c.JSON(http.StatusOK, gin.H{
		"token_type":       "Bearer",
		"token":            signedToken,
		"employeeID":       employee.ID,
		"positionID":       employee.PositionID,
		"token_expiration": expirationTime,
	})
}
