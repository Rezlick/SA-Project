package entity

import (
	"gorm.io/gorm"
	"time"
)

type Coupon struct {
	gorm.Model

	Code string `json:"code"`

	Discount int `json:"discount"`

	ExpiredDate time.Time `json:"expired_date"`

	EmployeeID 		uint
	Employee 		Employee 		`gorm:"foreignKey: employee_id"`

	// Coupon เป็น 1 ต่อหลายกับ Receipt

	Receipt []Receipt `gorm:"foreignKey:CouponID"`
}
