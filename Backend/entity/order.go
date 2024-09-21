package entity

import "gorm.io/gorm"


type Order struct {

	gorm.Model	

	BookingID 			uint
	Booking 			Booking 		`gorm:"foreignKey:BookingID"`

	EmployeeID 			uint
	Employee 			Employee 		`gorm:"foreignKey:EmployeeID"`

	Status_OrderID 		uint
	Status_Order 		OrderStatus 	`gorm:"foreignKey:Status_OrderID"`

	Order_Product 		[]OrderProduct `gorm:"foreignKey:order_id"`

}