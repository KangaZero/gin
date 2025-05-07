package controllers

import (
	"fmt"
	"gin/src/models"
	"gin/src/utils"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"time"

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

func GetSomePets(c *gin.Context) {
    countStr := c.DefaultQuery("count", "20")
    count, err := strconv.Atoi(countStr)
    
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid count parameter"})
        return
    }
    
    if len(models.Pets) == 0 {
        c.JSON(http.StatusOK, gin.H{
            "message": "No pets found",
            "data":    []models.Pet{},
        })
        return
    }
    
    // Limit count to the number of available pets
    if count > len(models.Pets) {
        count = len(models.Pets)
    }
    
    // Get a subset of pets
    selectedPets := models.Pets[:count]
    
    enrichedPets := make([]gin.H, len(selectedPets))
    for i, pet := range selectedPets {
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

	// If OwnerID is provided, check if user exists and update the user's PetIDs
	if newPet.OwnerID != "" {
		var userExists bool

		for _, user := range models.Users {
			if user.ID == newPet.OwnerID {
				userExists = true
				break
			}
		}

		if !userExists {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Owner with provided ID does not exist"})
			return
		}
	}

	// Generate a new ID (simple approach for in-memory storage)
	newPet.ID = fmt.Sprintf("%d", len(models.Pets)+1)

	// Generate a default picture if none provided
	if newPet.Picture == "" {
		newPet.Picture = fmt.Sprintf("/images/pets/%s_default.jpg", newPet.Species)
	}

	// Add the pet to our slice
	models.Pets = append(models.Pets, newPet)

	// Update the user's PetIDs if an owner was specified
	if newPet.OwnerID != "" {
		for i, user := range models.Users {
			if user.ID == newPet.OwnerID {
				models.Users[i].PetIDs = append(models.Users[i].PetIDs, newPet.ID)
				break
			}
		}
	}

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
	var oldOwnerID string

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

	// Find the old pet to get its owner
	for _, pet := range models.Pets {
		if pet.ID == id {
			oldOwnerID = pet.OwnerID
			break
		}
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

	// Find and update the pet
	found := false
	for i, pet := range models.Pets {
		if pet.ID == id {
			found = true
			// Keep the same ID
			updatedPet.ID = id

			// Preserve the picture if none provided
			if updatedPet.Picture == "" {
				updatedPet.Picture = pet.Picture
			}

			// Update the pet in the slice
			models.Pets[i] = updatedPet

			// If owner changed, update both old and new owners' PetIDs
			if oldOwnerID != updatedPet.OwnerID {
				// Remove from old owner
				if oldOwnerID != "" {
					for j, user := range models.Users {
						if user.ID == oldOwnerID {
							newPetIDs := []string{}
							for _, petID := range user.PetIDs {
								if petID != id {
									newPetIDs = append(newPetIDs, petID)
								}
							}
							models.Users[j].PetIDs = newPetIDs
							break
						}
					}
				}

				// Add to new owner
				if updatedPet.OwnerID != "" {
					for j, user := range models.Users {
						if user.ID == updatedPet.OwnerID {
							// Check if not already in the list
							hasPet := false
							for _, petID := range user.PetIDs {
								if petID == id {
									hasPet = true
									break
								}
							}
							if !hasPet {
								models.Users[j].PetIDs = append(models.Users[j].PetIDs, id)
							}
							break
						}
					}
				}
			}

			enrichedPet := utils.EnrichPetWithOwner(updatedPet)
			c.JSON(http.StatusOK, gin.H{
				"message": "Pet updated successfully",
				"data":    enrichedPet,
			})
			break
		}
	}

	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "Pet not found"})
	}
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
			// Remove the pet from the owner's PetIDs list
			if pet.OwnerID != "" {
				for j, user := range models.Users {
					if user.ID == pet.OwnerID {
						newPetIDs := []string{}
						for _, petID := range user.PetIDs {
							if petID != id {
								newPetIDs = append(newPetIDs, petID)
							}
						}
						models.Users[j].PetIDs = newPetIDs
						break
					}
				}
			}

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

// GetPetNameSuggestions returns random pet names that match the provided prefix
func GetPetNameSuggestions(c *gin.Context) {
	name := c.Param("name")
	countStr := c.DefaultQuery("count", "10") // Default to 10 suggestions if not specified

	count := 10
	if parsedCount, err := strconv.Atoi(countStr); err == nil && parsedCount > 0 {
		count = parsedCount
	}

	// Find all matching pet names
	var matchingNames []string
	seen := make(map[string]bool)

	for _, pet := range models.Pets {
		if strings.HasPrefix(strings.ToLower(pet.Name), strings.ToLower(name)) {
			if !seen[pet.Name] {
				matchingNames = append(matchingNames, pet.Name)
				seen[pet.Name] = true
			}
		}
	}

	// Randomize the results
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(matchingNames), func(i, j int) {
		matchingNames[i], matchingNames[j] = matchingNames[j], matchingNames[i]
	})

	// Take only the requested number of suggestions
	if len(matchingNames) > count {
		matchingNames = matchingNames[:count]
	}

	c.JSON(http.StatusOK, gin.H{
		"suggestions": matchingNames,
	})
}
