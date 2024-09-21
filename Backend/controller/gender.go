package controller

import (
   "net/http"
   "github.com/SA_Project/config"
   "github.com/SA_Project/entity"
   "github.com/gin-gonic/gin"
)

func GetGenders(c *gin.Context) {
   var genders []entity.Gender

   db := config.DB()
   db.Find(&genders)
   c.JSON(http.StatusOK, &genders)
}