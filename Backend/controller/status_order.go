package controller

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/SA_Project/config"
    "github.com/SA_Project/entity"
)

func GetStatusOrders(c *gin.Context) {
   var statusorders []entity.Status_Order

   db := config.DB()
   db.Model(&entity.Status_Order{}).Select("status_order_name").Find(&statusorders)
   c.JSON(http.StatusOK, statusorders)
}