package entity

import (
	"time"
	"gorm.io/gorm"
)

type Receipt struct {
	// Pk ของ Receipt เป็น uint ใช้คำสั่ง gorm.Model สร้าง Pk ให้ได้เลย
	gorm.Model
	Date 		time.Time	
	Totalprice 	float64		

	// การเชื่่อม foreignkey จากตารางอื่น 

	EmployeeID int

	Employee Employee `gorm:"foreingKey:employee_id"`

	MemberID int

	Member Member `gorm:"foreingKey:member_id"`
}