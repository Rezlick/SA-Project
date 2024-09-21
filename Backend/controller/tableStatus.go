package controller

import (

	"net/http"
	"github.com/SA_Project/config"
	"github.com/SA_Project/entity"
	"github.com/gin-gonic/gin"

)
//GetAll Table status
func GetTableStatuses(c *gin.Context) {

	db := config.DB()
	var tableStatus []entity.TableStatus
	db.Find(&tableStatus)
	c.JSON(http.StatusOK, &tableStatus)

}