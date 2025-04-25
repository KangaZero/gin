package controllers

import (
	"bytes"
	"encoding/json"
	"gin/src/models"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	return router
}

func TestLogin(t *testing.T) {
	router := setupTestRouter()
	router.POST("/api/login", Login)

	// Test successful login
	t.Run("Successful Login", func(t *testing.T) {
		// Create a test user first
		testUser := models.User{
			ID:       "1",
			Email:    "test@example.com",
			UserName: "testuser",
			Password: "$2a$10$h.dl5J86rGH7I8bD9bZeZe",  // pre-hashed "password123"
		}
		models.Users = []models.User{testUser}

		loginBody := map[string]string{
			"username": "testuser",
			"password": "password123",
		}
		jsonBody, _ := json.Marshal(loginBody)

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/api/login", bytes.NewBuffer(jsonBody))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		
		var response map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &response)
		assert.Equal(t, "Login successful", response["message"])
	})

	// Test invalid credentials
	t.Run("Invalid Credentials", func(t *testing.T) {
		loginBody := map[string]string{
			"username": "testuser",
			"password": "wrongpassword",
		}
		jsonBody, _ := json.Marshal(loginBody)

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/api/login", bytes.NewBuffer(jsonBody))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}

func TestCreateUser(t *testing.T) {
	router := setupTestRouter()
	router.POST("/api/users", CreateUser)

	t.Run("Successful User Creation", func(t *testing.T) {
		// Clear existing users
		models.Users = []models.User{}

		newUser := map[string]string{
			"email":    "new@example.com",
			"userName": "newuser",
			"password": "password123",
		}
		jsonBody, _ := json.Marshal(newUser)

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/api/users", bytes.NewBuffer(jsonBody))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)

		var response map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &response)
		assert.Equal(t, "User created successfully", response["message"])
	})

	t.Run("Duplicate Email", func(t *testing.T) {
		newUser := map[string]string{
			"email":    "new@example.com",
			"userName": "differentuser",
			"password": "password123",
		}
		jsonBody, _ := json.Marshal(newUser)

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/api/users", bytes.NewBuffer(jsonBody))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusConflict, w.Code)
	})
}

func TestGetCurrentUser(t *testing.T) {
	router := setupTestRouter()
	router.GET("/api/users/me", SessionAuthMiddleware(), GetCurrentUser)

	t.Run("Get Current User Success", func(t *testing.T) {
		// Setup test user and session
		testUser := models.User{
			ID:       "1",
			Email:    "test@example.com",
			UserName: "testuser",
		}
		models.Users = []models.User{testUser}

		sessionToken := "session_123_1"
		sessionStore[sessionToken] = getFutureTime() // Set future expiry

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/api/users/me", nil)
		req.AddCookie(&http.Cookie{
			Name:  "session_token",
			Value: sessionToken,
		})
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &response)
		userData := response["data"].(map[string]interface{})
		assert.Equal(t, "test@example.com", userData["email"])
	})

	t.Run("Unauthorized Access", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/api/users/me", nil)
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}

func TestLogout(t *testing.T) {
	router := setupTestRouter()
	router.POST("/api/logout", Logout)

	t.Run("Successful Logout", func(t *testing.T) {
		sessionToken := "session_123_1"
		sessionStore[sessionToken] = getFutureTime()

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/api/logout", nil)
		req.AddCookie(&http.Cookie{
			Name:  "session_token",
			Value: sessionToken,
		})
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		
		// Verify session was removed
		_, exists := sessionStore[sessionToken]
		assert.False(t, exists)
	})
}