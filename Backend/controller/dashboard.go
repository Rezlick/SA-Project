package controller

import (
	"net/http"
    "github.com/gin-gonic/gin"
    "github.com/SA_Project/config"
)

func GetMemberCountForCurrentMonth(c *gin.Context) {
	var count int64
	
    db := config.DB()
    // Select members created in the current month
    result := db.Raw(
		`SELECT COUNT(id) 
        FROM members 
        WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
        AND deleted_at IS NULL`).Scan(&count)
		
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
		
	c.JSON(http.StatusOK, gin.H{"memberCount": count})
}

func GetNetIncomeForCurrentMonth(c *gin.Context) {
	var income int64
	
	db := config.DB()
	results := db.Raw(`SELECT SUM(total_price) FROM receipts WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`).Scan(&income)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
		
	c.JSON(http.StatusOK, gin.H{"netIncome": income})
}
	
func GetDashboardDataForMonth(c *gin.Context) {
	var count int 
	var income int 

    // Get the month and year from query parameters
    month := c.Query("month") // Expects "MM" format
    year := c.Query("year")   // Expects "YYYY" format

    if month == "" || year == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Month and year are required"})
        return
    }

    db := config.DB()
    
    // Select members created in the specified month and year
    query1 := "SELECT COUNT(id) FROM members WHERE strftime('%Y-%m', created_at) = ? AND deleted_at IS NULL"
	query2 := "SELECT COALESCE(SUM(total_price), 0) FROM receipts WHERE strftime('%Y-%m', created_at) = ?"

    result1 := db.Raw(query1, year+"-"+month).Scan(&count)
    if result1.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result1.Error.Error()})
        return
    }

	result2 := db.Raw(query2, year+"-"+month).Scan(&income)
	if result2.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result2.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
		"memberCount": count,
		"netIncome":income,
	})
}

func GetDashboardDataForDay(c *gin.Context) {
    var count int 
	var income int

    // Get the date from query parameters (expects "YYYY-MM-DD" format)
    day := c.Query("day")

    if day == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Day is required in format YYYY-MM-DD"})
        return
    }

    db := config.DB()

    // Select members created on the specified day
    query1 := "SELECT COUNT(id) FROM members WHERE strftime('%Y-%m-%d', created_at) = ? AND deleted_at IS NULL"
	query2 := "SELECT COALESCE(SUM(total_price), 0) FROM receipts WHERE strftime('%Y-%m-%d', created_at) = ?"

    result1 := db.Raw(query1, day).Scan(&count)
    if result1.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result1.Error.Error()})
        return
    }

	result2 := db.Raw(query2, day).Scan(&income)
    if result2.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result2.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
		"memberCount": count,
		"netIncome": income,
	})
}


