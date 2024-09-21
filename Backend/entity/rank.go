package entity

import(
	"gorm.io/gorm"
) 

type Rank struct{
	gorm.Model
	Name 				string		
	Discount			float64	
	PointToUpgrade 		int

	Members 		[]Member 		`gorm:"foreignKey:rank_id"`
}