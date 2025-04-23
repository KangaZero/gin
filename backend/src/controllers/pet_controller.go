package controllers

import (
	"fmt"
	"gin/src/models"
	"gin/src/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetAllPets handles GET request to fetch all pets
func GetAllPets(c *gin.Context) {
	if len(models.Pets) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"message": "No pets found",
			"data":    []models.Pet{},
		})
		return
	}

	enrichedPets := make([]gin.H, len(models.Pets))
	for i, pet := range models.Pets {
		enrichedPets[i] = utils.EnrichPetWithOwner(pet)
	}

	c.JSON(http.StatusOK, gin.H{
		"count": len(enrichedPets),
		"data":  enrichedPets,
	})
}

// GetPetByID handles GET request to fetch a single pet by ID
func GetPetByID(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Pet ID is required"})
		return
	}

	for _, pet := range models.Pets {
		if pet.ID == id {
			enrichedPet := utils.EnrichPetWithOwner(pet)
			c.JSON(http.StatusOK, gin.H{
				"data": enrichedPet,
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Pet not found"})
}

// CreatePet handles POST request to add a new pet
func CreatePet(c *gin.Context) {
	var newPet models.Pet

	if err := c.ShouldBindJSON(&newPet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate required fields
	if newPet.Name == "" || newPet.Species == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name and species are required"})
		return
	}

	// Validate numeric values
	if newPet.Age < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Age cannot be negative"})
		return
	}

	if newPet.Price < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Price cannot be negative"})
		return
	}

	if newPet.Weight < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Weight cannot be negative"})
		return
	}

	// Generate a new ID (simple approach for in-memory storage)
	newPet.ID = fmt.Sprintf("%d", len(models.Pets)+1)

	// Add the pet to our slice
	models.Pets = append(models.Pets, newPet)

	enrichedPet := utils.EnrichPetWithOwner(newPet)
	c.JSON(http.StatusCreated, gin.H{
		"message": "Pet created successfully",
		"data":    enrichedPet,
	})
}

// UpdatePet handles PUT request to update an existing pet
func UpdatePet(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Pet ID is required"})
		return
	}

	var updatedPet models.Pet

	if err := c.ShouldBindJSON(&updatedPet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate required fields
	if updatedPet.Name == "" || updatedPet.Species == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name and species are required"})
		return
	}

	// Validate numeric values
	if updatedPet.Age < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Age cannot be negative"})
		return
	}

	if updatedPet.Price < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Price cannot be negative"})
		return
	}

	if updatedPet.Weight < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Weight cannot be negative"})
		return
	}

	// If OwnerID is provided, check if user exists
	if updatedPet.OwnerID != "" {
		ownerExists := false
		for _, user := range models.Users {
			if user.ID == updatedPet.OwnerID {
				ownerExists = true
				break
			}
		}

		if !ownerExists {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Owner with provided ID does not exist"})
			return
		}
	}

	for i, pet := range models.Pets {
		if pet.ID == id {
			// Keep the same ID
			updatedPet.ID = id

			// Update the pet in the slice
			models.Pets[i] = updatedPet

			enrichedPet := utils.EnrichPetWithOwner(updatedPet)
			c.JSON(http.StatusOK, gin.H{
				"message": "Pet updated successfully",
				"data":    enrichedPet,
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Pet not found"})
}

// DeletePet handles DELETE request to remove a pet
func DeletePet(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Pet ID is required"})
		return
	}

	for i, pet := range models.Pets {
		if pet.ID == id {
			// Remove the pet from the slice
			models.Pets = append(models.Pets[:i], models.Pets[i+1:]...)

			c.JSON(http.StatusOK, gin.H{
				"message": "Pet deleted successfully",
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Pet not found"})
}

// GetPetsByOwner returns all pets owned by a specific user ID
// A separate endpoint outside of user routes
func GetPetsByOwner(c *gin.Context) {
	ownerID := c.Param("ownerId")
	if ownerID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Owner ID is required"})
		return
	}

	// Check if owner exists
	ownerExists := false
	for _, user := range models.Users {
		if user.ID == ownerID {
			ownerExists = true
			break
		}
	}

	if !ownerExists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Owner not found"})
		return
	}

	// Find pets with this owner
	var ownerPets []models.Pet
	for _, pet := range models.Pets {
		if pet.OwnerID == ownerID {
			ownerPets = append(ownerPets, pet)
		}
	}

	if len(ownerPets) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"message": "No pets found for this owner",
			"data":    []models.Pet{},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"count": len(ownerPets),
		"data":  ownerPets,
	})
}
