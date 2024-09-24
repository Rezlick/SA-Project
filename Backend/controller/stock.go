package controller

import (
	"net/http"
	"strconv"
	"time"
	"fmt"
	"sort"
	

	"github.com/gin-gonic/gin"
	"github.com/SA_Project/config"
    "github.com/SA_Project/entity"
)

// Struct สำหรับรับข้อมูล Input
type InputUpdateStock struct {
	StockID         uint      `json:"stock_id"`
	CategoryID      uint      `json:"category_id"`
	Product_Code_ID string    `json:"product_code_id"`
	ProductName     string    `json:"product_name"`
	Quantity        uint      `json:"quantity"`
	Price           float64   `json:"price"`
	//DateIn          time.Time `json:"date_in"`
	//ExpirationDate  time.Time `json:"expiration_date"`
	SupplierID      uint      `json:"supplier_id"`
	EmployeeID      uint      `json:"employee_id"`
}

func UpdateStock(c *gin.Context) {
	var data InputUpdateStock
	var stock entity.Stock
	var product entity.Product

	// ผูกข้อมูล JSON เข้ากับโครงสร้าง Input
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่า stock_id มีอยู่หรือไม่
	if err := config.DB().Where("id = ?", data.StockID).First(&stock).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Stock not found"})
		return
	}

	// ตรวจสอบว่า Product_Code_ID มีอยู่หรือไม่
	if err := config.DB().Where("product_code_id = ?", data.Product_Code_ID).First(&product).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// ตรวจสอบว่า ProductName ที่รับเข้ามาตรงกับฐานข้อมูลหรือไม่
	if product.ProductName != data.ProductName {
		// ถ้า ProductName ไม่ตรงกันให้ทำการอัปเดตชื่อในฐานข้อมูล
		product.ProductName = data.ProductName
		if err := config.DB().Save(&product).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product name"})
			return
		}
	}

	// อัปเดตข้อมูล stock ที่มีอยู่
	stock.Quantity = data.Quantity
	stock.Price = data.Price
	//stock.DateIn = data.DateIn
	//stock.ExpirationDate = data.ExpirationDate
	stock.SupplierID = data.SupplierID
	stock.EmployeeID = data.EmployeeID

	// บันทึกการเปลี่ยนแปลงลงฐานข้อมูล
	if err := config.DB().Save(&stock).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update stock"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Stock updated successfully", "stock_id": stock.ID})
}



// Result struct สำหรับจัดรูปแบบผลลัพธ์
type Result struct {
	StockID        uint      `json:"stock_id"`
	ProductCodeID  string    `json:"product_code_id"`
	ProductName    string    `json:"product_name"`
	Quantity       uint      `json:"quantity"`
	Price          float64   `json:"price"`
	DateIn         time.Time `json:"date_in"`
	ExpirationDate time.Time `json:"expiration_date"`
	SupplierName   string    `json:"supplier_name"`
	EmployeeName   string    `json:"employee_name"`
}

func GetStock(c *gin.Context) {
	categoryID := c.Param("category_id")

	var products []entity.Product
	var stocks []entity.Stock
	var suppliers []entity.Supplier
	var employees []entity.Employee

	// ดึงข้อมูลสินค้าใน category ที่ระบุ
	if err := config.DB().Where("category_id = ?", categoryID).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving products"})
		return
	}

	// ดึงข้อมูล stock ที่เกี่ยวข้องกับ products ที่ดึงมา
	productIDs := []uint{}
	for _, product := range products {
		if product.ID != 0 {
			productIDs = append(productIDs, product.ID)
		}
	}

	if err := config.DB().Where("product_id IN ?", productIDs).Find(&stocks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving stock"})
		return
	}

	// ดึงข้อมูล suppliers ที่เกี่ยวข้องกับ stock
	supplierIDs := []uint{}
	for _, stock := range stocks {
		if stock.SupplierID != 0 {
			supplierIDs = append(supplierIDs, stock.SupplierID)
		}
	}

	if err := config.DB().Where("id IN ?", supplierIDs).Find(&suppliers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving suppliers"})
		return
	}

	// ดึงข้อมูลพนักงานที่เกี่ยวข้อง
	employeeIDs := []uint{}
	for _, stock := range stocks {
		if stock.EmployeeID != 0 {
			employeeIDs = append(employeeIDs, stock.EmployeeID)
		}
	}

	if err := config.DB().Where("id IN ?", employeeIDs).Find(&employees).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving employees"})
		return
	}

	// สร้าง map สำหรับเก็บข้อมูล supplier
	supplierByID := make(map[uint]entity.Supplier)
	for _, supplier := range suppliers {
		supplierByID[supplier.ID] = supplier
	}

	// สร้าง map สำหรับเก็บข้อมูล employee
	employeeByID := make(map[uint]entity.Employee)
	for _, employee := range employees {
		employeeByID[employee.ID] = employee
	}

	// สร้างข้อมูลผลลัพธ์
	var result []Result
	for _, product := range products {
		for _, stock := range stocks {
			if stock.ProductID != 0 && stock.ProductID == product.ID {
				supplierName := ""
				if stock.SupplierID != 0 {
					if supplier, ok := supplierByID[stock.SupplierID]; ok {
						supplierName = supplier.SupplierName
					}
				}
				employeeName := ""
				if stock.EmployeeID != 0 {
					if employee, ok := employeeByID[stock.EmployeeID]; ok {
						employeeName = employee.FirstName 
					}
				}
				result = append(result, Result{
					StockID:        stock.ID,
					ProductCodeID:  product.Product_Code_ID,
					ProductName:    product.ProductName,
					Quantity:       stock.Quantity,
					Price:          stock.Price,
					DateIn:         stock.DateIn,
					ExpirationDate: stock.ExpirationDate,
					SupplierName:   supplierName,
					EmployeeName:   employeeName,
				})
			}
		}
	}
	// จัดเรียงข้อมูลตาม stock_id
	sort.Slice(result, func(i, j int) bool {
		return result[i].StockID < result[j].StockID
	})

	c.JSON(http.StatusOK, gin.H{"data": result})
}


// Struct สำหรับรับข้อมูล Input
type Input struct {
	CategoryID     uint      `json:"category_id"`
	Product_Code_ID string   `json:"product_code_id"`
	ProductName     string   `json:"product_name"`
	Quantity        uint     `json:"quantity"`
	Price           float64  `json:"price"`
	DateIn          time.Time `json:"date_in"`
	ExpirationDate  time.Time `json:"expiration_date"`
	SupplierID      uint     `json:"supplier_id"`
	EmployeeID      uint     `json:"employee_id"`
}

func AddStockHandler(c *gin.Context) {
	var data Input
	var product entity.Product
	var category entity.Category

	// ผูกข้อมูล JSON เข้ากับโครงสร้าง Input
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่า Product_Code_ID มีอยู่แล้วหรือไม่
	if err := config.DB().Where("product_code_id = ?", data.Product_Code_ID).First(&product).Error; err != nil {
		// ถ้าไม่มี product_code_id ให้สร้างใหม่

		// ดึงข้อมูล Category เพื่อหา Category_Code_ID
		if err := config.DB().Where("id = ?", data.CategoryID).First(&category).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Category not found"})
			return
		}

		// หาเลขสูงสุดของ Product_Code_ID ที่มีอยู่ใน category นี้
		var lastProduct entity.Product

		// ดึง product_code_id ที่เป็นเลขสูงสุดจากหมวดหมู่นี้
		if err := config.DB().Where("product_code_id LIKE ?", category.Category_Code_id+"%").
			Order("product_code_id DESC").First(&lastProduct).Error; err != nil {
			// ถ้าไม่มีรายการใน category นี้ ให้เริ่มจาก 001
			data.Product_Code_ID = category.Category_Code_id + "001"
		} else {
			// ถ้ามีรายการอยู่แล้ว ให้เพิ่มลำดับตัวเลขของ product_code_id
			lastCodeNum := lastProduct.Product_Code_ID[len(category.Category_Code_id):] // ตัด Category_Code_ID ออก เช่น M001 -> 001
			codeNum, _ := strconv.Atoi(lastCodeNum)      // แปลงเป็น integer
			newCodeNum := fmt.Sprintf("%03d", codeNum+1) // เพิ่มลำดับและแปลงกลับเป็น string เช่น 001 -> 002
			data.Product_Code_ID = category.Category_Code_id + newCodeNum
		}

		// สร้าง Product ใหม่
		newProduct := entity.Product{
			Product_Code_ID: data.Product_Code_ID,
			ProductName:     data.ProductName,
			CategoryID:      data.CategoryID,
			EmployeeID:      data.EmployeeID,
		}
		if err := config.DB().Create(&newProduct).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create new product"})
			return
		}

		// เพิ่ม Stock ใหม่สำหรับสินค้า
		newStock := entity.Stock{
			Quantity:        data.Quantity,
			Price:           data.Price,
			DateIn:          data.DateIn,
			ExpirationDate:  data.ExpirationDate,
			ProductID:       newProduct.ID,
			SupplierID:      data.SupplierID,
			EmployeeID:      data.EmployeeID,
		}
		if err := config.DB().Create(&newStock).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create new stock"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Product and Stock added successfully", "product_code_id": newProduct.Product_Code_ID})
	} else {
		// ถ้า Product_Code_ID มีอยู่แล้ว ให้เพิ่ม Stock ใหม่สำหรับสินค้านี้
		newStock := entity.Stock{
			Quantity:        data.Quantity,
			Price:           data.Price,
			DateIn:          data.DateIn,
			ExpirationDate:  data.ExpirationDate,
			ProductID:       product.ID,
			SupplierID:      data.SupplierID,
			EmployeeID:      data.EmployeeID,
		}
		if err := config.DB().Create(&newStock).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create new stock"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Stock added successfully for existing product", "product_code_id": product.Product_Code_ID})
	}
}