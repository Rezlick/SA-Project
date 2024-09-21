package controller

import (

	"net/http"
	"github.com/SA_Project/config"
	"github.com/SA_Project/entity"
	"github.com/gin-gonic/gin"

)

// GET soups
func GetSoups(c *gin.Context) {

	var soups []entity.Soup
	db := config.DB()
	db.Find(&soups)
	c.JSON(http.StatusOK, &soups)
	
}