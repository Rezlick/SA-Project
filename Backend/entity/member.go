package entity

import(
	"gorm.io/gorm"
) 

type Member struct{
	gorm.Model
	FirstName		string			
	LastName		string			
	PhoneNumber		string		
	Point 			int	

	// FK from Rank
	RankID			uint
	Rank			Rank		`gorm:"foreignKey: rank_id"`
	// FK from Employee
	EmployeeID		uint		
	Employee		Employee	`gorm:"foreignKey: employee_id"`
}

func (m *Member) BeforeUpdate(tx *gorm.DB) (err error) {
    // Fetch the current rank
    var currentRank Rank
    if err := tx.First(&currentRank, m.RankID).Error; err != nil {
        return err
    }

    // If the member is currently Gold, do not downgrade
    if currentRank.Name == "Gold" {
        return nil
    }

    // Check if points exceed the current rank's PointToUpgrade
    if m.Point >= currentRank.PointToUpgrade {
        var nextRank Rank

        // Special case for upgrading from Silver to Gold
        if currentRank.Name == "Silver" {
            if err := tx.Where("name = ?", "Gold").First(&nextRank).Error; err != nil {
                return err
            }
        } else {
            // Normal rank upgrade logic for other ranks
            if err := tx.Where("point_to_upgrade > ?", currentRank.PointToUpgrade).
                Order("point_to_upgrade ASC").
                First(&nextRank).Error; err != nil {
                if err == gorm.ErrRecordNotFound {
                    return nil // No higher rank found
                }
                return err
            }
        }

        // Update the member's rank and adjust points
        m.RankID = nextRank.ID
        m.Point -= currentRank.PointToUpgrade

        // If the new rank is Gold, prevent further downgrades
        if nextRank.Name == "Gold" {
            return nil
        }

        // Check if the points exceed the new rank's PointToUpgrade
        if m.Point >= nextRank.PointToUpgrade {
            return m.BeforeUpdate(tx) // Recursive call to handle further upgrades
        }
    }

    return nil
}
