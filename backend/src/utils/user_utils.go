package utils

import (
	"gin/src/models"

	"github.com/gin-gonic/gin"
)

func CreateSafeUser(user models.User) models.User {
	safeUser := user
	safeUser.Password = ""
	return safeUser
}

func EnrichUserWithPets(user models.User) gin.H {
	safeUser := CreateSafeUser(user)

	var userPets []models.Pet
	for _, pet := range models.Pets {
		for _, petID := range user.PetIDs {
			if pet.ID == petID {
				userPets = append(userPets, pet)
			}
		}
	}

	return gin.H{
		"user": safeUser,
		"pets": userPets,
	}
}
