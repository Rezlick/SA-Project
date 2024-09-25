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
	results := db.Raw(`SELECT COALESCE(SUM(total_price), 0) FROM receipts WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`).Scan(&income)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
		
	c.JSON(http.StatusOK, gin.H{"netIncome": income})
}

func GetCashIncomeForCurrentMonth(c *gin.Context) {
	var cashIncome int64
	
	db := config.DB()
	results := db.Raw(`SELECT COALESCE(SUM(total_price), 0) FROM receipts WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now') AND type_payment_id == 1`).Scan(&cashIncome)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
		
	c.JSON(http.StatusOK, gin.H{"cashIncome": cashIncome})
}

func GetTranferIncomeForCurrentMonth(c *gin.Context) {
	var tranferIncome int64
	
	db := config.DB()
	results := db.Raw(`SELECT COALESCE(SUM(total_price), 0) FROM receipts WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now') AND type_payment_id == 2`).Scan(&tranferIncome)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
		
	c.JSON(http.StatusOK, gin.H{"tranferIncome": tranferIncome})
}
	
func GetDashboardDataForMonth(c *gin.Context) {
	var count int 
	var income int 
    var cashIncome int
    var tranferIncome int

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
    query3 := "SELECT COALESCE(SUM(total_price), 0) FROM receipts WHERE strftime('%Y-%m', created_at) = ? AND type_payment_id == 1"
    query4 := "SELECT COALESCE(SUM(total_price), 0) FROM receipts WHERE strftime('%Y-%m', created_at) = ? AND type_payment_id == 2"

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

    result3 := db.Raw(query3, year+"-"+month).Scan(&cashIncome)
	if result3.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result3.Error.Error()})
        return
    }
    result4 := db.Raw(query4, year+"-"+month).Scan(&tranferIncome)
	if result4.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result4.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
		"memberCount": count,
		"netIncome":income,
        "cashIncome": cashIncome,
        "tranferIncome": tranferIncome,
	})
}

func GetDashboardDataForDay(c *gin.Context) {
    var count int 
	var income int
    var cashIncome int
    var tranferIncome int

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
    query3 := "SELECT COALESCE(SUM(total_price), 0) FROM receipts WHERE strftime('%Y-%m-%d', created_at) = ? AND type_payment_id == 1"
    query4 := "SELECT COALESCE(SUM(total_price), 0) FROM receipts WHERE strftime('%Y-%m-%d', created_at) = ? AND type_payment_id == 2"

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

    result3 := db.Raw(query3, day).Scan(&cashIncome)
    if result3.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result3.Error.Error()})
        return
    }

	result4 := db.Raw(query4, day).Scan(&tranferIncome)
    if result4.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result4.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
		"memberCount": count,
		"netIncome":income,
        "cashIncome": cashIncome,
        "tranferIncome": tranferIncome,
	})
}


