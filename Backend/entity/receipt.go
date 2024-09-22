package entity

import (
	"gorm.io/gorm"
)

type Receipt struct {
	// Pk ของ Receipt เป็น uint ใช้คำสั่ง gorm.Model สร้าง Pk ให้ได้เลย
	gorm.Model

	TotalPrice 		float64		`json:"totalprice"`

	TotalDiscount 	float64		`json:"totaldiscount"`


	// การเชื่่อม foreignkey จากตารางอื่น 
	CouponID 		uint							// สร้างตัวแปรมารับ กำหนด type ให้ตรง
	Coupon 			Coupon `gorm:"foreignKey:CouponID"`		// ประกาศ file type และ foreignKey : Pk(ที่นำมาใช้)

	EmployeeID 		uint
	Employee 		Employee `gorm:"foreignKey: employee_id"`

	MemberID 		uint
	Member 			Member `gorm:"foreignKey: member_id"`
	
	BookingID      uint   
    Booking        Booking     `gorm:"foreignKey: booking_id"`

}