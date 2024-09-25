package controller

import (
	"github.com/SA_Project/config"
	"github.com/SA_Project/entity"
	"github.com/gin-gonic/gin"
	"strconv"
	"net/http"
)

func CreateOrder(c *gin.Context) {
	var order entity.Order

	// Get the BookingID from the URL parameters (use "id" because route has ":id")
	bookingIDParam := c.Param("id")

	// Convert the BookingID from string to uint
	bookingID, err := strconv.ParseUint(bookingIDParam, 10, 32)
	if err != nil || bookingID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Booking ID"})
		return
	}

	// Bind the JSON body to the Order struct
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	// Set the BookingID from the URL
	order.BookingID = uint(bookingID)
	order.Status_OrderID = 2 // Set Status_OrderID to 2 (order placed)

	// Save the order in the database (OrderID will auto-increment)
	db := config.DB()
	if err := db.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order: " + err.Error()})
		return
	}

	// Respond with the newly created order's ID and booking reference
	c.JSON(http.StatusCreated, gin.H{
		"message":    "Order created successfully",
		"order_id":   order.ID,
		"booking_id": order.BookingID,
	})
}

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

func GetOrderByBookingID(c *gin.Context) {
    bookingID := c.Param("id")
    var orders []entity.Order 

    db := config.DB()
    results := db.Preload("Booking").Preload("Booking.Table").Preload("Status_Order").Where("booking_id = ?", bookingID).Find(&orders)  

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    if len(orders) == 0 {  // ตรวจสอบว่าไม่มี order ถูกค้นพบ
        c.JSON(http.StatusNoContent, gin.H{})
        return
    }

    c.JSON(http.StatusOK, orders)  // ส่งกลับ orders ทั้งหมด
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
