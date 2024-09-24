package controller

import (
   "net/http"
   "github.com/SA_Project/config"
   "github.com/SA_Project/entity"
   "github.com/gin-gonic/gin"
)

func GetTypePayment(c *gin.Context) {
   var Type []entity.TypePayment

   db := config.DB()
   db.Find(&Type)
   c.JSON(http.StatusOK, &Type)
}