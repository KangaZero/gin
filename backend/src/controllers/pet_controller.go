package controllers

import (
	"gin/src/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetAllPets handles GET request to fetch all pets
func GetAllPets(c *gin.Context) {
	c.JSON(http.StatusOK, models.Pets)
}

// GetPetByID handles GET request to fetch a single pet by ID
func GetPetByID(c *gin.Context) {
	id := c.Param("id")

	for _, pet := range models.Pets {
		if pet.ID == id {
			c.JSON(http.StatusOK, pet)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"message": "Pet not found"})
}

// CreatePet handles POST request to add a new pet
func CreatePet(c *gin.Context) {
	var newPet models.Pet

	if err := c.ShouldBindJSON(&newPet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Generate a new ID (simple approach for in-memory storage)
	newPet.ID = strconv.Itoa(len(models.Pets) + 1)

	models.Pets = append(models.Pets, newPet)
	c.JSON(http.StatusCreated, newPet)
}

// UpdatePet handles PUT request to update an existing pet
func UpdatePet(c *gin.Context) {
	id := c.Param("id")
	var updatedPet models.Pet

	if err := c.ShouldBindJSON(&updatedPet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for i, pet := range models.Pets {
		if pet.ID == id {
			// Keep the same ID
			updatedPet.ID = id

			// Update the pet in the slice
			models.Pets[i] = updatedPet
			c.JSON(http.StatusOK, updatedPet)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"message": "Pet not found"})
}

// DeletePet handles DELETE request to remove a pet
func DeletePet(c *gin.Context) {
	id := c.Param("id")

	for i, pet := range models.Pets {
		if pet.ID == id {
			// Remove the pet from the slice
			models.Pets = append(models.Pets[:i], models.Pets[i+1:]...)
			c.JSON(http.StatusOK, gin.H{"message": "Pet deleted successfully"})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"message": "Pet not found"})
}

// RenderHomePage renders the index page with pet data
func RenderHomePage(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{
		"title": "Pet Shop",
		"pets":  models.Pets,
	})
}
