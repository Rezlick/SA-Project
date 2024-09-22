package controller

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/SA_Project/config"
    "github.com/SA_Project/entity"
)

// GetOrders retrieves all orders with related data
func GetOrders(c *gin.Context) {
	var orders []entity.Order

	db := config.DB()
	results := db.Preload("Employee").
		Preload("Booking").
		Preload("Status_Order").
		Preload("Booking.Table").
		Find(&orders)

	if results.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, orders)
}

func GetOrderByID(c *gin.Context) {
    ID := c.Param("id")
	var order entity.Order

	db := config.DB()
	results := db.Preload("Booking").Preload("Booking.Table").Preload("Status_Order").Preload("Booking.Package").First(&order, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if order.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, order)
}

// UpdateOrder updates the EmployeeID and Status_OrderID for an order
func UpdateOrder(c *gin.Context) {
    var order entity.Order
    orderID := c.Param("id")

    db := config.DB()

    // Fetch the order from the database
    result := db.First(&order, orderID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Order ID not found"})
        return
    }

    var input struct {
        EmployeeID uint `json:"EmployeeID"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error":   "Bad request, unable to map payload",
            "details": err.Error(),
        })
        return
    }

    // Check if the employee exists
    var employee entity.Employee
    db.First(&employee, input.EmployeeID)
    if employee.ID == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
        return
    }

    // Update the EmployeeID and Status_OrderID fields
    db.Model(&order).Updates(map[string]interface{}{"EmployeeID": input.EmployeeID, "Status_OrderID": 1})

    c.JSON(http.StatusOK, gin.H{"message": "Order updated successfully"})
}
