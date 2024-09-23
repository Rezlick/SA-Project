package entity

import (
	"time"

	"gorm.io/gorm"
)

type Stock struct {

	gorm.Model
	Quantity       uint      `json:"quantity"`

	Price          float64   `json:"price"`

	DateIn         time.Time `json:"date_in"`

	ExpirationDate time.Time `json:"expiration_date"`

	ProductID      uint

	Product        Product `gorm:"foreignKey:ProductID"`

	SupplierID     uint

	Supplier       Supplier `gorm:"foreignKey:SupplierID"`

	EmployeeID     uint
	
	Employee       Employee `gorm:"foreignKey:EmployeeID"`

}
