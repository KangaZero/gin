package main

import (
	"gin/src/controllers"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode) // Set release mode

	router := gin.Default()

	// Configure CORS to allow requests from Next.js frontend
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:1234", "http://localhost:3000"}, // Allow both ports
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// API routes
	api := router.Group("/api")
	{
		// Authentication routes
		api.POST("/login", controllers.Login)
		api.POST("/logout", controllers.Logout)
		api.POST("/users/oauth", controllers.HandleOAuthLogin) // Add OAuth endpoint

		// Pet routes (protected except GET)
		pets := api.Group("/pets")
		{
			pets.GET("", controllers.GetAllPets)
			pets.GET("/:id", controllers.GetPetByID)
			pets.GET("/owner/:ownerId", controllers.GetPetsByOwner)

			pets.Use(controllers.SessionAuthMiddleware())
			pets.POST("", controllers.CreatePet)
			pets.PUT("/:id", controllers.UpdatePet)
			pets.DELETE("/:id", controllers.DeletePet)
		}

		// User routes (protected except register and GET)
		users := api.Group("/users")
		{
			users.GET("", controllers.GetAllUsers)
			users.GET("/:id", controllers.GetUserByID)
			users.POST("", controllers.CreateUser) // registration is public
			users.GET("/:id/pets", controllers.GetUserPets)

			users.Use(controllers.SessionAuthMiddleware())
			users.GET("/me", controllers.GetCurrentUser) // Moved under auth middleware
			users.PUT("/:id", controllers.UpdateUser)
			users.DELETE("/:id", controllers.DeleteUser)
		}
	}

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "up",
			"time":   time.Now().Format(time.RFC3339),
		})
	})

	// Keep legacy ping endpoint for backward compatibility
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	port := os.Getenv("PORT") // Get port from environment variable
	if port == "" {
		port = "2308" // Default port if PORT is not set
	}

	println("API server running on http://localhost:" + port)
	router.Run(":" + port) // listen
}
