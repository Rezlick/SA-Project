package controller

import (
   "net/http"
   "github.com/SA_Project/config"
   "github.com/SA_Project/entity"
   "github.com/gin-gonic/gin"
)

func GetPositions(c *gin.Context) {
   var positions []entity.Position
   
   db := config.DB()
   db.Find(&positions)
   c.JSON(http.StatusOK, &positions)
}