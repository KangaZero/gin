package utils

import (
	"gin/src/models"

	"github.com/gin-gonic/gin"
)

func EnrichPetWithOwner(pet models.Pet) gin.H {
	var owner *models.User

	// Find pet's owner if it has one
	if pet.OwnerID != "" {
		for _, user := range models.Users {
			if user.ID == pet.OwnerID {
				safeUser := CreateSafeUser(user)
				owner = &safeUser
				break
			}
		}
	}

	return gin.H{
		"pet":   pet,
		"owner": owner,
	}
}
