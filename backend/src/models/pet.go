package models

// Pet represents a pet in our shop
type Pet struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Species     string  `json:"species"`
	Breed       string  `json:"breed"`
	Age         int     `json:"age"`
	Price       float64 `json:"price"`
	Description string  `json:"description"`
	Available   bool    `json:"available"`
}

// Pets is a slice of Pet used for storing our pet data in memory
var Pets = []Pet{
	{
		ID:          "1",
		Name:        "Buddy",
		Species:     "Dog",
		Breed:       "Golden Retriever",
		Age:         3,
		Price:       500.00,
		Description: "Friendly and playful golden retriever",
		Available:   true,
	},
	{
		ID:          "2",
		Name:        "Whiskers",
		Species:     "Cat",
		Breed:       "Siamese",
		Age:         2,
		Price:       350.00,
		Description: "Elegant siamese cat with blue eyes",
		Available:   true,
	},
	{
		ID:          "3",
		Name:        "Bubbles",
		Species:     "Fish",
		Breed:       "Goldfish",
		Age:         1,
		Price:       25.00,
		Description: "Beautiful orange goldfish",
		Available:   true,
	},
}