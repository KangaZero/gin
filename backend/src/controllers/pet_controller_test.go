package controllers

import (
	"bytes"
	"encoding/json"
	"gin/src/models"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetAllPets(t *testing.T) {
	router := setupTestRouter()
	router.GET("/api/pets", GetAllPets)

	t.Run("Get All Pets Success", func(t *testing.T) {
		// Setup test pets
		models.Pets = []models.Pet{
			{
				ID:      "1",
				Name:    "Max",
				Species: "Dog",
				OwnerID: "1",
			},
			{
				ID:      "2",
				Name:    "Whiskers",
				Species: "Cat",
				OwnerID: "1",
			},
		}

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/api/pets", nil)
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &response)
		pets := response["data"].([]interface{})
		assert.Equal(t, 2, len(pets))
	})

	t.Run("Empty Pets List", func(t *testing.T) {
		models.Pets = []models.Pet{}

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/api/pets", nil)
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &response)
		assert.Equal(t, "No pets found", response["message"])
	})
}

func TestCreatePet(t *testing.T) {
	router := setupTestRouter()
	router.POST("/api/pets", SessionAuthMiddleware(), CreatePet)

	t.Run("Create Pet Success", func(t *testing.T) {
		// Setup test session
		sessionToken := "session_123_1"
		sessionStore[sessionToken] = getFutureTime()

		newPet := map[string]string{
			"name":    "Buddy",
			"species": "Dog",
			"ownerId": "1",
		}
		jsonBody, _ := json.Marshal(newPet)

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/api/pets", bytes.NewBuffer(jsonBody))
		req.Header.Set("Content-Type", "application/json")
		req.AddCookie(&http.Cookie{
			Name:  "session_token",
			Value: sessionToken,
		})
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)

		var response map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &response)
		assert.Equal(t, "Pet created successfully", response["message"])
	})

	t.Run("Unauthorized Pet Creation", func(t *testing.T) {
		newPet := map[string]string{
			"name":    "Buddy",
			"species": "Dog",
			"ownerId": "1",
		}
		jsonBody, _ := json.Marshal(newPet)

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/api/pets", bytes.NewBuffer(jsonBody))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}

func TestGetPetByID(t *testing.T) {
	router := setupTestRouter()
	router.GET("/api/pets/:id", GetPetByID)

	t.Run("Get Pet Success", func(t *testing.T) {
		// Setup test pet
		testPet := models.Pet{
			ID:      "1",
			Name:    "Max",
			Species: "Dog",
			OwnerID: "1",
		}
		models.Pets = []models.Pet{testPet}

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/api/pets/1", nil)
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &response)
		petData := response["data"].(map[string]interface{})
		assert.Equal(t, "Max", petData["name"])
	})

	t.Run("Pet Not Found", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/api/pets/999", nil)
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

func TestUpdatePet(t *testing.T) {
	router := setupTestRouter()
	router.PUT("/api/pets/:id", SessionAuthMiddleware(), UpdatePet)

	t.Run("Update Pet Success", func(t *testing.T) {
		// Setup test session and pet
		sessionToken := "session_123_1"
		sessionStore[sessionToken] = getFutureTime()

		testPet := models.Pet{
			ID:      "1",
			Name:    "Max",
			Species: "Dog",
			OwnerID: "1",
		}
		models.Pets = []models.Pet{testPet}

		updatePet := map[string]string{
			"name":    "Maximus",
			"species": "Dog",
			"ownerId": "1",
		}
		jsonBody, _ := json.Marshal(updatePet)

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("PUT", "/api/pets/1", bytes.NewBuffer(jsonBody))
		req.Header.Set("Content-Type", "application/json")
		req.AddCookie(&http.Cookie{
			Name:  "session_token",
			Value: sessionToken,
		})
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &response)
		assert.Equal(t, "Pet updated successfully", response["message"])
	})
}

func TestDeletePet(t *testing.T) {
	router := setupTestRouter()
	router.DELETE("/api/pets/:id", SessionAuthMiddleware(), DeletePet)

	t.Run("Delete Pet Success", func(t *testing.T) {
		// Setup test session and pet
		sessionToken := "session_123_1"
		sessionStore[sessionToken] = getFutureTime()

		testPet := models.Pet{
			ID:      "1",
			Name:    "Max",
			Species: "Dog",
			OwnerID: "1",
		}
		models.Pets = []models.Pet{testPet}

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("DELETE", "/api/pets/1", nil)
		req.AddCookie(&http.Cookie{
			Name:  "session_token",
			Value: sessionToken,
		})
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		// Verify pet was deleted
		assert.Equal(t, 0, len(models.Pets))
	})
}
