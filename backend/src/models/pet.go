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
    OwnerID     string  `json:"ownerId"` // ID of the user who owns this pet
    BirthDate   string  `json:"birthDate"` // Added field
    Weight      float64 `json:"weight"` // Added field in kg
    Vaccinated  bool    `json:"vaccinated"` // Added field
    Gender      string  `json:"gender"` // Added field
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
        OwnerID:     "1", // Owned by John Doe
        BirthDate:   "2022-03-10",
        Weight:      25.5,
        Vaccinated:  true,
        Gender:      "Male",
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
        OwnerID:     "2", // Owned by Jane Smith
        BirthDate:   "2023-01-15",
        Weight:      4.2,
        Vaccinated:  true,
        Gender:      "Female",
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
        OwnerID:     "3", // Owned by Mike Johnson
        BirthDate:   "2024-02-01",
        Weight:      0.1,
        Vaccinated:  false,
        Gender:      "Unknown",
    },
}