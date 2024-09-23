package controller

import (
    "time"
	"net/http"
    "golang.org/x/crypto/bcrypt"
	"github.com/SA_Project/config"
	"github.com/SA_Project/entity"
	"github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

func CreateEmployee(c *gin.Context) {
    var employee entity.Employee
    
    // bind เข้าตัวแปร employee
    if err := c.ShouldBindJSON(&employee); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()

    // ค้นหา gender ด้วย id
	var gender entity.Gender
	db.First(&gender, employee.GenderID)
	if gender.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "gender not found"})
		return
	}

    // ค้นหา position ด้วย id
    var position entity.Position
	db.First(&position, employee.PositionID)
	if position.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "position not found"})
		return
	}

    hashedPassword, _ := config.HashPassword(employee.Password)

	// สร้าง Employee
	e := entity.Employee{
		FirstName:  employee.FirstName, 
		LastName:   employee.LastName,  
		Email:      employee.Email,     
		Password:   hashedPassword,
        Profile:    employee.Profile,
		GenderID:   employee.GenderID,
		Gender:     gender,
        PositionID: employee.PositionID,
        Position:   position,
	}

    if err := db.Create(&e).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, gin.H{"message": "ลงทะเบียนพนักงานสำเร็จ"})
}

func GetEmployees(c *gin.Context) {
   var employees []entity.Employee

   db := config.DB()
   results := db.Preload("Gender").Preload("Position").Find(&employees)
   if results.Error != nil {
       c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
       return
   }
   c.JSON(http.StatusOK, employees)
}

func GetEmployeeByID(c *gin.Context) {
   ID := c.Param("id")
   var employee entity.Employee

   db := config.DB()
   results := db.Preload("Gender").Preload("Position").First(&employee, ID)
   if results.Error != nil {
       c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
       return
   }

   if employee.ID == 0 {
       c.JSON(http.StatusNoContent, gin.H{})
       return
   }
   c.JSON(http.StatusOK, employee)
}

func UpdateEmployee(c *gin.Context) {
   var employee entity.Employee
   employeeID := c.Param("id")

   db := config.DB()
   result := db.First(&employee, employeeID)
   if result.Error != nil {
       c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
       return
   }

   if err := c.ShouldBindJSON(&employee); err != nil {
       c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
       return
   }

   result = db.Save(&employee)
   if result.Error != nil {
       c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
       return
   }

   c.JSON(http.StatusOK, gin.H{"message": "แก้ไขข้อมูลสำเร็จ"})
}

func DeleteEmployee(c *gin.Context) {
    id := c.Param("id")

	db := config.DB()

    var employee entity.Employee
    if err := db.First(&employee, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Member not found"})
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
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction failed: "})
        }
    }()

    // Soft delete member
    if err := tx.Model(&employee).Update("deleted_at", time.Now()).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    if err := tx.Commit().Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
        return
    }

	c.JSON(http.StatusOK, gin.H{"message": "ลบข้อมูลสำเร็จ"})
}

func ChangePassword(c *gin.Context) {
    var employee entity.Employee
    employeeID := c.Param("id")

    // Struct for receiving JSON payload
    var payload struct {
        OldPassword     string `json:"old_password"`
        NewPassword     string `json:"new_password"`
        ConfirmPassword string `json:"confirm_password"`
    }

    db := config.DB()
    result := db.First(&employee, employeeID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Employee ID not found"})
        return
    }

    // Bind the incoming JSON to the payload struct
    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
        return
    }

    // Verify that old password is correct
    err := bcrypt.CompareHashAndPassword([]byte(employee.Password), []byte(payload.OldPassword))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสผ่านไม่ถูกต้อง"})
        return
    }

    // Check if new password and confirm password match
    if payload.NewPassword != payload.ConfirmPassword {
        c.JSON(http.StatusBadRequest, gin.H{"error": "รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน"})
        return
    }

    // Hash the new password
    hashedPassword, err := config.HashPassword(payload.NewPassword)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash the new password"})
        return
    }

    // Update the employee's password in the database
    result = db.Model(&employee).Update("password", hashedPassword)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update the password"})
        return
    }

    // Respond with success message
    c.JSON(http.StatusOK, gin.H{"message": "เปลี่ยนรหัสผ่านสำเร็จ"})
}

func CheckEmail(c *gin.Context) {
	var employee entity.Employee
	Email := c.Param("email")

	db := config.DB()

	// Perform the database query
	result := db.Where("email = ?", Email).First(&employee)

	// Check if an error occurred
	if result.Error != nil && result.Error != gorm.ErrRecordNotFound {
		// Return error response if the query failed (excluding "record not found")
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Check if the phone number exists
	if result.RowsAffected > 0 {
		// Phone number exists in the database
		c.JSON(http.StatusOK, gin.H{
			"isValid": false, // Indicating that the phone number is already in use
		})
	} else {
		// Phone number does not exist, it is valid for new registration
		c.JSON(http.StatusOK, gin.H{
			"isValid": true, // Indicating that the phone number can be used
		})
	}
}