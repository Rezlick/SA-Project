package controller

import (
   "net/http"
   "github.com/SA_Project/config"
   "github.com/SA_Project/entity"
   "github.com/gin-gonic/gin"
)

func GetRanks(c *gin.Context) {
   var ranks []entity.Rank

   db := config.DB()
   db.Find(&ranks)
   c.JSON(http.StatusOK, &ranks)
}