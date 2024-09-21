package main

import (
	"net/http"
	"github.com/SA_Project/config"
	"github.com/SA_Project/controller"
	"github.com/SA_Project/middlewares"
	"github.com/gin-gonic/gin"
)

const PORT = "8000"

func main() {
   // open connection database
   config.ConnectionDB()

   // Generate databases
   config.SetupDatabase()

   r := gin.Default()
   r.Use(CORSMiddleware())

   // Auth Route
   r.POST("/signIn", controller.SignIn)

   router := r.Group("/")
   {
       router.Use(middlewares.Authorizes())

       // Employee Route
       router.POST("/employee", controller.CreateEmployee)
       router.GET("/employees", controller.GetEmployees)
       router.GET("/employee/:id", controller.GetEmployeeByID)
       router.PATCH("/employee/:id", controller.UpdateEmployee)
       router.DELETE("/employee/:id", controller.DeleteEmployee)

       // Member Routes
       router.POST("/member", controller.CreateMember)
       router.GET("/members", controller.GetMembers)
       router.GET("/member/:id", controller.GetMemberByID)
       router.PATCH("/member/:id", controller.UpdateMember)
       router.DELETE("/member/:id", controller.DeleteMember)

       // Gender Routes
       router.GET("/genders", controller.GetGenders)

       // Position Routes
       router.GET("/positions", controller.GetPositions)

       // Rank Routes
       r.GET("/ranks", controller.GetRanks)

       // MemberCount Routes
       r.GET("/memberCountForCurrentMonth", controller.GetMemberCountForCurrentMonth)
       r.GET("/memberCountForDay", controller.GetMemberCountForDay)
       r.GET("/memberCountForMonth", controller.GetMemberCountForMonth)

       // Receipt Routes
       r.GET("/receipt", controller.GetReceipts)

       // Add point route
       r.PATCH("/member/:id/addPoints", controller.AddPointsToMember)

       r.PATCH("/employee/:id/changePassword", controller.ChangePassword)

       // Booking
		r.GET("/booking", controller.GetBookings)
		r.GET("/booking/:id", controller.GetBookingByID)
		r.POST("/booking", controller.CreateBooking)
		r.PATCH("/booking/:id", controller.UpdateBooking)
		r.DELETE("/booking/:id", controller.DeleteBooking)

		// Booking Soups
		r.POST("/booking_soups", controller.CreateBookingSoup)
		r.PUT("/booking_soups/:id", controller.UpdateBookingSoups)

		// Other routes
		r.GET("/tables", controller.GetTables)
		r.PATCH("/tables/:id", controller.UpdateStatus)
		r.GET("/table_capacity", controller.GetTableCapacities)
		r.GET("/table_status", controller.GetTableStatuses)
		r.GET("/soups", controller.GetSoups)
		r.GET("/packages", controller.GetPackages)

       
   }

   r.GET("/", func(c *gin.Context) {
       c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
   })

   // Run the server
   r.Run("localhost:" + PORT)
}

func CORSMiddleware() gin.HandlerFunc {
   return func(c *gin.Context) {
       c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
       c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
       c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
       c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

       if c.Request.Method == "OPTIONS" {
           c.AbortWithStatus(204)
           return
       }
       c.Next()
   }
}