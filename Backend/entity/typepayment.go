package entity

import(
	"gorm.io/gorm"
) 

type TypePayment struct{
	gorm.Model
	Name			string
			
	Receipt 		[]Receipt 		`gorm:"foreignKey:TypePaymentID"`
}