package controllers

import (
	"fmt"
	"gin/src/models"
	"gin/src/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// Session store for demo (in-memory)
var sessionStore = make(map[string]time.Time)

// Session validation middleware
func SessionAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := c.Cookie("session_token")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing session token"})
			return
		}
		expiry, ok := sessionStore[token]
		if !ok || time.Now().After(expiry) {
			// Remove expired session if present
			delete(sessionStore, token)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Session expired or invalid"})
			return
		}
		// Session is valid, continue
		c.Next()
	}
}

// GetAllUsers returns all users
// GET /api/users
func GetAllUsers(c *gin.Context) {
	// Check if there are any users
	if len(models.Users) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"message": "No users found",
			"data":    []models.User{},
		})
		return
	}

	// Create a slice of users without exposing passwords
	enrichedUsers := make([]gin.H, len(models.Users))
	for i, user := range models.Users {
		enrichedUsers[i] = utils.EnrichUserWithPets(user)
	}

	c.JSON(http.StatusOK, gin.H{
		"count": len(enrichedUsers),
		"data":  enrichedUsers,
	})
}

// GetUserByID returns a user by ID
// GET /api/users/:id
func GetUserByID(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	for _, user := range models.Users {
		if user.ID == id {
			enrichedUser := utils.EnrichUserWithPets(user)
			c.JSON(http.StatusOK, gin.H{
				"data": enrichedUser,
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
}

// CreateUser creates a new user
// POST /api/users
func CreateUser(c *gin.Context) {
	var newUser models.User

	// Bind JSON to user struct
	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user data: " + err.Error()})
		return
	}

	// Validate required fields
	if newUser.UserName == "" || newUser.Password == "" || newUser.Email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username, password, and email are required"})
		return
	}

	// Check for duplicate email
	for _, user := range models.Users {
		if user.Email == newUser.Email {
			c.JSON(http.StatusConflict, gin.H{"error": "User with this email already exists"})
			return
		}
	}

	// Check for duplicate username
	for _, user := range models.Users {
		if user.UserName == newUser.UserName {
			c.JSON(http.StatusConflict, gin.H{"error": "Username already taken"})
			return
		}
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to secure password"})
		return
	}
	newUser.Password = string(hashedPassword)

	// Set ID based on current length + 1
	newUser.ID = fmt.Sprintf("%d", len(models.Users)+1)

	// Set creation timestamp
	newUser.CreatedAt = time.Now().Format(time.RFC3339)

	// Add to users list
	models.Users = append(models.Users, newUser)

	c.JSON(http.StatusCreated, gin.H{
		"message": "User created successfully",
		"data":    utils.CreateSafeUser(newUser),
	})
}

// UpdateUser updates a user by ID
// PUT /api/users/:id
func UpdateUser(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	var updatedUser models.User
	if err := c.ShouldBindJSON(&updatedUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user data: " + err.Error()})
		return
	}

	// Make sure ID matches
	updatedUser.ID = id

	for i, user := range models.Users {
		if user.ID == id {
			// Check for duplicate email (if email changed)
			if updatedUser.Email != user.Email {
				for _, existingUser := range models.Users {
					if existingUser.Email == updatedUser.Email && existingUser.ID != id {
						c.JSON(http.StatusConflict, gin.H{"error": "Another user with this email already exists"})
						return
					}
				}
			}

			// Check for duplicate username (if username changed)
			if updatedUser.UserName != user.UserName {
				for _, existingUser := range models.Users {
					if existingUser.UserName == updatedUser.UserName && existingUser.ID != id {
						c.JSON(http.StatusConflict, gin.H{"error": "Username already taken"})
						return
					}
				}
			}

			// Preserve creation time
			updatedUser.CreatedAt = user.CreatedAt

			// Only update password if a new one is provided
			if updatedUser.Password != "" {
				// Hash the new password
				hashedPassword, err := bcrypt.GenerateFromPassword([]byte(updatedUser.Password), bcrypt.DefaultCost)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to secure password"})
					return
				}
				updatedUser.Password = string(hashedPassword)
			} else {
				// Keep the old password
				updatedUser.Password = user.Password
			}

			// Update the user
			models.Users[i] = updatedUser

			c.JSON(http.StatusOK, gin.H{
				"message": "User updated successfully",
				"data":    utils.CreateSafeUser(updatedUser),
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
}

// Login authenticates a user
// POST /api/login
func Login(c *gin.Context) {
	var loginData struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid login data"})
		return
	}

	// Validate required fields
	if loginData.Username == "" || loginData.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username and password are required"})
		return
	}

	// Find the user
	var foundUser *models.User
	for i, user := range models.Users {
		if user.UserName == loginData.Username {
			foundUser = &models.Users[i]
			break
		}
	}

	if foundUser == nil {
		// Don't reveal whether username exists or not (security best practice)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Compare passwords
	err := bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(loginData.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Generate a simple session token (for demo, use a random string)
	sessionToken := fmt.Sprintf("session_%d_%s", time.Now().UnixNano(), foundUser.ID)
	// Set the session cookie (1 hour expiry)
	hour := 3600
	c.SetCookie("session_token", sessionToken, hour, "/", "", false, true)

	// Store the session token with expiry
	sessionStore[sessionToken] = time.Now().Add(time.Hour)

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"data":    utils.CreateSafeUser(*foundUser),
	})
}

// Logout handler
func Logout(c *gin.Context) {
	token, err := c.Cookie("session_token")
	if err == nil {
		delete(sessionStore, token)
		// Clear cookie
		c.SetCookie("session_token", "", -1, "/", "", false, true)
	}
	c.JSON(http.StatusOK, gin.H{"message": "Logged out"})
}

// DeleteUser deletes a user by ID
// DELETE /api/users/:id
func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	for i, user := range models.Users {
		if user.ID == id {
			// Remove user from slice
			models.Users = append(models.Users[:i], models.Users[i+1:]...)

			c.JSON(http.StatusOK, gin.H{
				"message": "User deleted successfully",
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
}

// GetUserPets returns all pets owned by a user
// GET /api/users/:id/pets
func GetUserPets(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	// First check if user exists
	userExists := false
	for _, user := range models.Users {
		if user.ID == id {
			userExists = true
			break
		}
	}

	if !userExists {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Find all pets owned by this user
	var userPets []models.Pet
	for _, pet := range models.Pets {
		if pet.OwnerID == id {
			userPets = append(userPets, pet)
		}
	}

	if len(userPets) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"message": "User has no pets",
			"data":    []models.Pet{},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"count": len(userPets),
		"data":  userPets,
	})
}
