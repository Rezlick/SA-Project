package controller

import (

	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/SA_Project/config"
	"github.com/SA_Project/entity"

)
// GET All Packages
func GetPackages(c *gin.Context) {

	var packages []entity.Package
	db := config.DB()
	db.Find(&packages)
	c.JSON(http.StatusOK, &packages)

}