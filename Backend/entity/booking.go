package entity

import "gorm.io/gorm"

type Booking struct {
    gorm.Model
    NumberOfCustomer  int         `json:"number_of_customer"`
    Soups             []Soup      `json:"soups" gorm:"many2many:booking_soups"`
    PackageID         uint        `json:"package_id"`
    Package           Package     `json:"package" gorm:"foreignKey:PackageID"`
    TableID           uint        `json:"table_id"`
    Table             Table       `json:"table" gorm:"foreignKey:TableID"`
    EmployeeID        uint        `json:"employee_id"`
    Employee          Employee    `json:"employee" gorm:"foreignKey:EmployeeID"`
    Receipt			[]Receipt	  `gorm:"foreignKey: booking_id"`
}