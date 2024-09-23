package entity

import "gorm.io/gorm"

type Product struct {
	gorm.Model

	Product_Code_ID   string `json:"product_code_id"`

    ProductName string `json:"product_name"`

    CategoryID      uint

	Category        Category `gorm:"foreignKey:CategoryID"`

	EmployeeID      uint

	Employee        Employee `gorm:"foreignKey:EmployeeID"`


	Stock           []Stock  `gorm:"foreignKey:ProductID"`


	Order_Product 		[]Order_Product `gorm:"foreignKey:product_id"`

}