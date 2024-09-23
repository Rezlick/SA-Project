package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/SA_Project/config"
    "github.com/SA_Project/entity"
	
)

type SupplierResponse struct {
	SupplierName string `json:"supplier_name"`
	Phone        string `json:"phone"`
	Email        string `json:"email"`
	Address      string `json:"address"`
}


func GetdataAllSupplier(c *gin.Context) {
    var suppliers []entity.Supplier
    result := config.DB().Find(&suppliers)

    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }
	// แปลงข้อมูล Supplier เป็น SupplierResponse
	var response []SupplierResponse
	for _, supplier := range suppliers {
		response = append(response, SupplierResponse{
			SupplierName: supplier.SupplierName,
			Phone:        supplier.Phone,
			Email:        supplier.Email,
			Address:      supplier.Address,
		})
	}


    c.JSON(http.StatusOK, gin.H{"data": response}) // ส่ง suppliers กลับไป
}

type SupplierResponseName struct {
	SupplierID	uint `json:"SupplierID"`
	SupplierName string `json:"supplier_name"`
}


func GetNameSupplier(c *gin.Context) {
    var suppliers []entity.Supplier
    result := config.DB().Find(&suppliers)

    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }
	// แปลงข้อมูล Supplier เป็น SupplierResponse
	var response []SupplierResponseName
	for _, supplier := range suppliers {
		response = append(response, SupplierResponseName{
			SupplierID: supplier.ID,
			SupplierName: supplier.SupplierName,
		})
	}


    c.JSON(http.StatusOK, gin.H{"data": response}) // ส่ง suppliers กลับไป
}