package controller

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/SA_Project/config"
    "github.com/SA_Project/entity"
)

func GetProducts(c *gin.Context) {
   var products []entity.Product
   
   db := config.DB()
   db.Find(&products)
   c.JSON(http.StatusOK, &products)
}

func GetProductsByID(c *gin.Context) {
    ID := c.Param("id")
	var product entity.Product

	db := config.DB()
	results := db.First(&product, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if product.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, product)
}