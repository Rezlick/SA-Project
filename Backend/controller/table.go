package controller

import (
    "net/http"
    "github.com/SA_Project/config"
    "github.com/SA_Project/entity"
    "github.com/gin-gonic/gin"
    // "gorm.io/gorm"
)

// GetAll Tables
func GetTables(c *gin.Context) {
    var tables []entity.Table
    db := config.DB()
    if db == nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
        return
    }

    if err := db.Preload("TableStatus").Preload("TableCapacity").Find(&tables).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, tables)
}

// UpdateStatus function to update table status by ID
func UpdateStatus(c *gin.Context) {
    var table entity.Table
    id := c.Param("id")
    var input struct {
        TableStatusID uint `json:"table_status_id"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    db := config.DB()
    if db == nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
        return
    }

    if err := db.First(&table, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Table not found"})
        return
    }

    // Ensure the status ID is set to 2
    if input.TableStatusID != 2 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status ID"})
        return
    }

    table.TableStatusID = input.TableStatusID
    if err := db.Save(&table).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Table status updated successfully"})
}

// func getStatusIDByStatus(status string, db *gorm.DB) (uint, error) {
//     var tableStatus entity.TableStatus
//     if err := db.Where("status = ?", status).First(&tableStatus).Error; err != nil {
//         return 0, err
//     }
//     return tableStatus.ID, nil
// }