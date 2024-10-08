package controller

import (
    "time"
    "gorm.io/gorm"
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/SA_Project/config"
    "github.com/SA_Project/entity"
)

func CreateMember(c *gin.Context) {
    var member entity.Member

    // bind เข้าตัวแปร member
    if err := c.ShouldBindJSON(&member); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()

    // ค้นหา rank ด้วย id
	var rank entity.Rank
	db.First(&rank, 1)
	if rank.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบระดับสมาชิก"})
		return
	}

    // ค้นหา employee ด้วย id
    var employee entity.Employee
    db.First(&employee, member.EmployeeID)
    if employee.ID == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบพนักงาน"})
        return
    }

    // สร้าง Member
    m := entity.Member {
        FirstName:  member.FirstName,					
	    LastName:   member.LastName,				
	    PhoneNumber:member.PhoneNumber,					
	    RankID:     1,		
	    Rank:       rank,					
	    EmployeeID: member.EmployeeID,				
        Employee:   employee,
    }

    if err := db.Create(&m).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, gin.H{"message": "สมัครสมาชิกสำเร็จ"})
}

func GetMembers(c *gin.Context) {
    var members []entity.Member

    db := config.DB()
    results := db.Preload("Rank").Preload("Employee").Find(&members)
    if results.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, members)
}

func GetMemberByID(c *gin.Context) {
    ID := c.Param("id")
	var user entity.Member

	db := config.DB()
	results := db.Preload("Rank").Preload("Employee").First(&user, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if user.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, user)
}



func UpdateMember(c *gin.Context) {
    var member entity.Member
	memberID := c.Param("id")

	db := config.DB()
	result := db.First(&member, memberID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบสมาชิก"})
		return
	}

	if err := c.ShouldBindJSON(&member); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&member)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "แก้ไขข้อมูลไม่สำเร็จ"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "แก้ไขข้อมูลสำเร็จ"})
}

func DeleteMember(c *gin.Context) {
    id := c.Param("id")

	db := config.DB()

    var member entity.Member
    if err := db.First(&member, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบสมาชิก"})
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
    if err := tx.Model(&member).Update("deleted_at", time.Now()).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    if err := tx.Commit().Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "ลบข้อมูลไม่สำเร็จ"})
        return
    }

	c.JSON(http.StatusOK, gin.H{"message": "ลบข้อมูลสำเร็จ"})
}

func AddPointsToMember(c *gin.Context) {
    var pointsToAdd struct {
        Points int 
    }
    memberID := c.Param("id")

    // Bind JSON payload (points)
    if err := c.ShouldBindJSON(&pointsToAdd); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
        return
    }

    // Check if points are valid (positive)
    if pointsToAdd.Points <= 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Points must be greater than 0"})
        return
    }

    db := config.DB()
    var member entity.Member

    // Find the member by ID
    if err := db.First(&member, memberID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Member not found"})
        return
    }

    // Add points to the member's existing points
    member.Point += pointsToAdd.Points

    // Save the updated member
    if err := db.Save(&member).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update member"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Points added successfully", "updatedPoints": member.Point})
}

func CheckMember(c *gin.Context){
	var member entity.Member
	var rank entity.Rank
	MPhone := c.Param("PhoneNumber")

	db := config.DB()

	result := db.Where("phone_number = ?", MPhone).First(&member)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

    rankResult := db.Where("id = ?", member.RankID).First(&rank)
        
    if rankResult.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Member found, but unable to find rank: " + rankResult.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{
        "isValid": true,
        "message": "Member is valid",
        "MemberID": member.ID,
        "FirstName": member.FirstName,
        "Rank": rank.Name,
        "Discount": rank.Discount,
    })

}

func CheckPhone(c *gin.Context) {
	var member entity.Member
	Phone := c.Param("phoneNumber")

	db := config.DB()

	// Perform the database query
	result := db.Where("phone_number = ?", Phone).First(&member)

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

func GetMemberCountForToday(c *gin.Context) {
    var count int

    db := config.DB()

    // Select members created on the specified day
    query := "SELECT COUNT(id) FROM members WHERE strftime('%Y-%m-%d', created_at) = strftime('%Y-%m-%d', datetime('now', '+7 hours')) AND deleted_at IS NULL"
    result := db.Raw(query).Scan(&count)

    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"memberCount": count})
}

func GetMemberCountByReceiptToday(c *gin.Context) {
	var count int64

	db := config.DB()
	results := db.Raw(`SELECT COUNT(id) FROM receipts WHERE strftime('%Y-%m-%d', created_at) = strftime('%Y-%m-%d', datetime('now', '+7 hours')) AND member_id != 0`).Scan(&count)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"memberCount": count})
}

func GetNetIncomeByMemberToday(c *gin.Context) {
	var income int

	db := config.DB()
	results := db.Raw(`SELECT COALESCE(SUM(total_price), 0) FROM receipts WHERE strftime('%Y-%m-%d', created_at) = strftime('%Y-%m-%d', datetime('now', '+7 hours')) AND member_id != 0`).Scan(&income)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"netIncome": income})
}
