package models

import (
	"fmt"
	"math/rand"
	"strings"
	"time"
)

// User represents a User in our shop
type User struct {
	ID             string   `json:"id"`
	UserName       string   `json:"userName"`
	FirstName      string   `json:"firstName"`
	LastName       string   `json:"lastName"`
	Email          string   `json:"email"`
	Password       string   `json:"password,omitempty"` // omitempty for OAuth users without passwords
	Age            int      `json:"age"`
	IsPremium      bool     `json:"isPremium"`
	Price          float64  `json:"price"`
	Description    string   `json:"description"`
	PetIDs         []string `json:"petIds"` // IDs of pets owned by this user
	Address        string   `json:"address"`
	PhoneNumber    string   `json:"phoneNumber"`
	CreatedAt      string   `json:"createdAt"`
	Picture        string   `json:"picture"`                  // URL to user's profile picture
	AuthProvider   string   `json:"authProvider,omitempty"`   // e.g., "local", "google", "github"
	ProviderUserID string   `json:"providerUserId,omitempty"` // ID from the OAuth provider
}

// GenerateUsers creates and returns a slice of sample users
func GenerateUsers(count int) []User {
	// Initialize random seed
	rand.Seed(time.Now().UnixNano())

	firstNames := []string{"John", "Jane", "Michael", "Emily", "William", "Olivia", "James", "Sophia", "Robert", "Emma", "David", "Ava", "Joseph", "Isabella", "Thomas", "Mia", "Charles", "Charlotte", "Daniel", "Amelia", "Matthew", "Harper", "Andrew", "Evelyn", "Richard", "Abigail", "Joshua", "Elizabeth", "Ryan", "Sofia"}
	lastNames := []string{"Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "King", "Wright"}
	streets := []string{"Main St", "Oak Ave", "Maple Dr", "Washington Blvd", "Park Rd", "Cedar Ln", "Lake Dr", "Pine St", "Elm Rd", "River Ave"}
	cities := []string{"Anytown", "Springfield", "Riverside", "Franklin", "Greenville", "Fairview", "Bristol", "Madison", "Georgetown", "Salem"}
	states := []string{"CA", "TX", "NY", "FL", "IL", "PA", "OH", "GA", "MI", "NC"}

	users := make([]User, count)

	for i := 0; i < count; i++ {
		id := fmt.Sprintf("%d", i+1)
		firstName := firstNames[rand.Intn(len(firstNames))]
		lastName := lastNames[rand.Intn(len(lastNames))]
		userName := fmt.Sprintf("%s%s%s", strings.ToLower(firstName[:1]), strings.ToLower(lastName), id)
		email := fmt.Sprintf("%s.%s@example.com", strings.ToLower(firstName), strings.ToLower(lastName))

		// Generate age between 18-70
		age := 18 + rand.Intn(53)

		// Premium status for every 3rd user
		isPremium := i%3 == 0

		// Price varies based on premium status
		var price float64
		if isPremium {
			price = 49.99 + float64(rand.Intn(50))
		} else {
			price = 19.99 + float64(rand.Intn(20))
		}

		// Address
		address := fmt.Sprintf("%d %s, %s, %s", 100+rand.Intn(9900), streets[rand.Intn(len(streets))], cities[rand.Intn(len(cities))], states[rand.Intn(len(states))])

		// Phone
		phoneNumber := fmt.Sprintf("555-%d-%d", 100+rand.Intn(900), 1000+rand.Intn(9000))

		// Created at: Between 1-5 years ago
		yearsAgo := 1 + rand.Intn(5)
		daysAgo := rand.Intn(365)
		createdAt := time.Now().AddDate(-yearsAgo, 0, -daysAgo).Format(time.RFC3339)

		// Description
		descriptions := []string{
			"Regular customer since %d",
			"Valued member of our community since %d",
			"%s loves animals and has been a loyal customer for years",
			"VIP customer with premium subscription",
			"New customer exploring pet adoption",
			"Recently joined our platform",
			"Passionate about %s and pet care",
			"Pet enthusiast and regular visitor",
			"Looking for new pet companions",
			"Has multiple pets and loves them all",
		}
		descriptionTemplate := descriptions[rand.Intn(len(descriptions))]
		var description string

		switch {
		case strings.Contains(descriptionTemplate, "%d"):
			year := time.Now().Year() - yearsAgo
			description = fmt.Sprintf(descriptionTemplate, year)
		case strings.Contains(descriptionTemplate, "%s"):
			if rand.Intn(2) == 0 {
				description = fmt.Sprintf(descriptionTemplate, firstName)
			} else {
				petTypes := []string{"dogs", "cats", "birds", "fish", "reptiles", "small animals"}
				description = fmt.Sprintf(descriptionTemplate, petTypes[rand.Intn(len(petTypes))])
			}
		default:
			description = descriptionTemplate
		}

		// Profile picture URL - cycle through 1-10 for variety
		picture := fmt.Sprintf("/images/users/profile_%d.jpg", (i%10)+1)

		// Initially empty pet IDs (these will be populated when pets are generated)
		petIDs := []string{}

		// Create user
		users[i] = User{
			ID:        id,
			UserName:  userName,
			FirstName: firstName,
			LastName:  lastName,
			Email:     email,
			// Simple hashed password for all users in this demo
			Password:       "$2a$10$h.dl5J86rGH7I8bD9bZeZe",
			Age:            age,
			IsPremium:      isPremium,
			Price:          price,
			Description:    description,
			PetIDs:         petIDs,
			Address:        address,
			PhoneNumber:    phoneNumber,
			CreatedAt:      createdAt,
			Picture:        picture,
			AuthProvider:   "local", // Default to local for this demo
			ProviderUserID: "",
		}
	}

	return users
}

// Users is a slice of User used for storing our User data in memory
var Users = GenerateUsers(20) // Generate 20 users
