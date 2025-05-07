package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// CookiePreferences represents user cookie preferences
type CookiePreferences struct {
	Essential     bool `json:"essential"`
	Analytics     bool `json:"analytics"`
	Functionality bool `json:"functionality"`
	Targeting     bool `json:"targeting"`
}

// GetCookiePreferences returns the user's current cookie preferences
func GetCookiePreferences(c *gin.Context) {
	// Try to get existing cookie preferences from cookie
	cookie, err := c.Cookie("cookiePreferences")

	// Default preferences - essential cookies are always enabled
	preferences := CookiePreferences{
		Essential:     true,
		Analytics:     false,
		Functionality: false,
		Targeting:     false,
	}

	// If cookie exists and no error, return stored preferences
	if err == nil && cookie != "" {
		// In a real app, you'd deserialize the cookie value into the preferences struct
		// This is simplified for demonstration
		if cookie == "all" {
			preferences.Analytics = true
			preferences.Functionality = true
			preferences.Targeting = true
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"preferences": preferences,
	})
}

// SetCookiePreferences updates the user's cookie preferences
func SetCookiePreferences(c *gin.Context) {
	var preferences CookiePreferences

	if err := c.ShouldBindJSON(&preferences); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid preferences format"})
		return
	}

	// Essential cookies are always required
	preferences.Essential = true

	// Determine cookie value based on preferences
	cookieValue := "essential"
	if preferences.Analytics && preferences.Functionality && preferences.Targeting {
		cookieValue = "all"
	} else if preferences.Analytics || preferences.Functionality || preferences.Targeting {
		cookieValue = "custom"
	}

	// Set the cookie with a 1-year expiration
	c.SetCookie(
		"cookiePreferences",
		cookieValue,
		int(365*24*time.Hour.Seconds()), // 1 year in seconds
		"/",                             // Path
		"",                              // Domain - empty for current domain
		c.Request.TLS != nil,            // Secure - true if TLS is used
		true,                            // HttpOnly - cannot be accessed by JavaScript
	)

	c.JSON(http.StatusOK, gin.H{
		"message":     "Cookie preferences updated successfully",
		"preferences": preferences,
	})
}
