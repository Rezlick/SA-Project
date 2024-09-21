package entity

import "gorm.io/gorm"

type OrderProduct struct {
	
	gorm.Model
	Quantity    uint

	OrderID      uint
	Orders       Order   `gorm:"foreignKey:OrderID"`

	ProductID    uint
	Products     Product `gorm:"foreignKey:ProductID"`

}