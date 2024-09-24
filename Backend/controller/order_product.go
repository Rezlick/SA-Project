package controller

import (
	"fmt"
	"net/http"

	"github.com/SA_Project/config"
	"github.com/SA_Project/entity"
	"github.com/gin-gonic/gin"
)

func CreateOrderProducts(c *gin.Context) {
	var orderproduct entity.Order_Product

	// Bind JSON to the Order_Product struct (including quantity)
	if err := c.ShouldBindJSON(&orderproduct); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	db := config.DB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
		return
	}
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
		return
	}

	// Start a transaction
	tx := db.Begin()

	// Check if the Order exists
	var order entity.Order
	if err := tx.First(&order, orderproduct.OrderID).Error; err != nil {
		tx.Rollback() // Rollback in case of error
		c.JSON(http.StatusNotFound, gin.H{"error": "OrderID not found"})
		return
	}

	fmt.Println("Received ProductCodeID:", orderproduct.Product_Code_ID)

	// Query to check the product
	var product entity.Product
	if err := tx.Where("product_code_id = ?", orderproduct.Product_Code_ID).First(&product).Error; err != nil {
		fmt.Println("Product lookup failed:", err)
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Create the Order-Product association with the quantity
	if err := tx.Create(&orderproduct).Error; err != nil {
		tx.Rollback() // Rollback in case of error
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order-product association: " + err.Error()})
		return
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction commit failed"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":         "Order-Product association created successfully",
		"id":              orderproduct.ID,
		"quantity":        orderproduct.Quantity, // Include the quantity in the response
		"product_code_id": orderproduct.Product_Code_ID,
	})
}

func GetOrderProductsByOrderID(c *gin.Context) {
	// Get the order ID from the URL parameter
	ID := c.Param("id")

	// Define a slice to store the result
	var orderproduct []entity.Order_Product

	// Get a DB instance
	db := config.DB()

	// Use the order ID in the query to filter the records
	results := db.
		Preload("Orders").
		Preload("Products").
		Preload("Products.Category").
		Joins("JOIN orders ON orders.id = order_products.order_id").
		Joins("JOIN products ON products.product_code_id = order_products.product_code_id").
		Where("order_products.order_id = ?", ID).
		Find(&orderproduct)

	// Check for errors in the query
	if results.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		return
	}
	// Respond with the result if successful
	c.JSON(http.StatusOK, orderproduct)
}
