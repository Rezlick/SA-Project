package entity

import "gorm.io/gorm"

type Order_Product struct {
	
	gorm.Model
	Quantity    uint

	OrderID      uint
	Orders       Order   `gorm:"foreignKey:OrderID"`

	Product_Code_ID    string
	Products     Product `gorm:"foreignKey:Product_Code_ID;references:Product_Code_ID"`

}