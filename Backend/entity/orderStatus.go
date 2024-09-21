package entity

import "gorm.io/gorm"

type OrderStatus struct {
	gorm.Model

	Status_Order_name string `json:"status_order_name"`

	Order []Order `gorm:"foreignKey:Status_OrderID"`
}