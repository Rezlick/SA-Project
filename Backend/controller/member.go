package controller

import (
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
	db.First(&rank, member.RankID)
	if rank.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "rank not found"})
		return
	}

    // ค้นหา employee ด้วย id
    var employee entity.Employee
    db.First(&employee, member.EmployeeID)
    if employee.ID == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "employee not found"})
        return
    }

    // สร้าง Member
    m := entity.Member {
        FirstName:  member.FirstName,					
	    LastName:   member.LastName,				
	    PhoneNumber:member.PhoneNumber,					
	    RankID:     member.RankID,		
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
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&member); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&member)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "แก้ไขข้อมูลสำเร็จ"})
}

func DeleteMember(c *gin.Context) {
    id := c.Param("id")

	db := config.DB()
	if tx := db.Exec("DELETE FROM members WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "ลบข้อมูลสำเร็จ"})
}

func GetMemberCountForCurrentMonth(c *gin.Context) {
    var count int64

    db := config.DB()
    // Select members created in the current month
    result := db.Raw(
        `SELECT COUNT(id) 
        FROM members 
        WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
        AND first_name != 'Guest'`).Scan(&count)
    
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"memberCount": count})
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

func GetMemberCountForMonth(c *gin.Context) {
    var count int64

    // Get the month and year from query parameters
    month := c.Query("month") // Expects "MM" format
    year := c.Query("year")   // Expects "YYYY" format

    if month == "" || year == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Month and year are required"})
        return
    }

    db := config.DB()
    
    // Select members created in the specified month and year
    query := "SELECT COUNT(id) FROM members WHERE strftime('%Y-%m', created_at) = ? AND first_name != 'Guest'"
    result := db.Raw(query, year+"-"+month).Scan(&count)

    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"memberCount": count})
}

func GetMemberCountForDay(c *gin.Context) {
    var count int64

    // Get the date from query parameters (expects "YYYY-MM-DD" format)
    day := c.Query("day")

    if day == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Day is required in format YYYY-MM-DD"})
        return
    }

    db := config.DB()

    // Select members created on the specified day
    query := "SELECT COUNT(id) FROM members WHERE strftime('%Y-%m-%d', created_at) = ? AND first_name != 'Guest'"
    result := db.Raw(query, day).Scan(&count)

    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"memberCount": count})
}

func CheckMember(c *gin.Context){
	var member entity.Member
	var rank entity.Rank
	MPhone := c.Param("phonenumber")

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