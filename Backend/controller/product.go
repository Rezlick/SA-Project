package controller

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/SA_Project/config"
    "github.com/SA_Project/entity"
	"time"
)

type result struct {
	ProductCodeID string `json:"product_code_id"`
	ProductName   string `json:"product_name"`
	Quantity      uint   `json:"quantity"`
	CategoryName  string `json:"category_name"`
}

func GetProductsByID(c *gin.Context) {
    ID := c.Param("product_code_id")
    var products []entity.Product
    var stocks []entity.Stock
    var totalQuantity uint = 0  // ตัวแปรเก็บผลรวมของ Quantity

    // ดึงข้อมูล product ที่มี product_code_id ที่ตรงกัน
    if err := config.DB().Where("product_code_id = ?", ID).Preload("Category").Find(&products).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving products"})
        return
    }

    // ถ้ามีข้อมูลสินค้า ให้ใช้ product_id ในการค้นหา stock
    if len(products) > 0 {
        // ดึง stock ที่ยังไม่หมดอายุ
        if err := config.DB().
            Where("product_id = ? AND expiration_date > ?", products[0].ID, time.Now()).
            Find(&stocks).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving stocks"})
            return
        }

        // คำนวณผลรวมของ Quantity
        for _, stock := range stocks {
            totalQuantity += stock.Quantity
        }

        // สร้างโครงสร้าง result เพื่อนำข้อมูลส่งออกไป
        resultData := result{
            ProductCodeID: products[0].Product_Code_ID,
            ProductName:   products[0].ProductName,
            Quantity:      totalQuantity,  
            CategoryName:  products[0].Category.CategoryName,
        }

        // ส่งข้อมูลกลับไป
        c.JSON(http.StatusOK, resultData)
    } else {
        c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
    }
}
