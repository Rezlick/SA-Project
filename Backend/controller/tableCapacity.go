package controller

import (

	"net/http"
	"github.com/SA_Project/config"
	"github.com/SA_Project/entity"
	"github.com/gin-gonic/gin"

)

//GetAll Table Capacity
func GetTableCapacities(c *gin.Context) {

	db := config.DB()
	var tableCapacity []entity.TableCapacity
	db.Find(&tableCapacity)
	c.JSON(http.StatusOK, &tableCapacity)

}