package main

import (
	"gin/src/controllers"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode) // Set release mode

	router := gin.Default()

	// Directly specifying the paths relative to the working directory
	// Load HTML templates from frontend templates folder
	router.LoadHTMLGlob("../../frontend/templates/*.html")

	// Serve static files from frontend folder
	router.Static("/assets", "../../frontend/assets")
	router.StaticFile("/script.js", "../../frontend/script.js")
	router.StaticFile("/style.css", "../../frontend/style.css")

	// Home page route
	router.GET("/", controllers.RenderHomePage)

	// API routes for pets
	api := router.Group("/api")
	{
		pets := api.Group("/pets")
		{
			pets.GET("", controllers.GetAllPets)
			pets.GET("/:id", controllers.GetPetByID)
			pets.POST("", controllers.CreatePet)
			pets.PUT("/:id", controllers.UpdatePet)
			pets.DELETE("/:id", controllers.DeletePet)
		}
	}

	// Health check endpoint
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	port := os.Getenv("PORT") // Get port from environment variable
	if port == "" {
		port = "2308" // Default port if PORT is not set
	}

	println("Server running on http://localhost:" + port)
	router.Run(":" + port) // listen
}
