package controller

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/SA_Project/config"
    "github.com/SA_Project/entity"
)


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
    Joins("JOIN orders ON orders.id = order_products.order_id").
    Joins("JOIN products ON products.id = order_products.product_id").
    Where("order_products.order_id = ?", ID).
    Select("Order_products.*, Orders.*, Products.*").
    Find(&orderproduct)



    // Check for errors in the query
    if results.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
        return
    }
    // Respond with the result if successful
    c.JSON(http.StatusOK, orderproduct)
}


