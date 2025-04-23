package models

// User represents a User in our shop
type User struct {
    ID          string   `json:"id"`
    UserName    string   `json:"userName"` 
    FirstName   string   `json:"firstName"`
    LastName    string   `json:"lastName"`
    Email       string   `json:"email"`
    Password    string   `json:"password"`
    Age         int      `json:"age"`
    IsPremium   bool     `json:"isPremium"`
    Price       float64  `json:"price"`
    Description string   `json:"description"`
    PetIDs      []string `json:"petIds"` // IDs of pets owned by this user
    Address     string   `json:"address"` 
    PhoneNumber string   `json:"phoneNumber"` 
    CreatedAt   string   `json:"createdAt"` 
}

// Users is a slice of User used for storing our User data in memory
var Users = []User{
    {
        ID:          "1",
        UserName:    "johndoe123", 
        FirstName:   "John",
        LastName:    "Doe",
        Email:       "john.doe@example.com",
        Password:    "hashedpassword123",
        Age:         28,
        IsPremium:   true,
        Price:       49.99,
        Description: "Regular customer since 2022",
        PetIDs:      []string{"1"}, // John owns Buddy (the Golden Retriever)
        Address:     "123 Main St, Anytown, USA",
        PhoneNumber: "555-123-4567",
        CreatedAt:   "2022-03-15T10:00:00Z",
    },
    {
        ID:          "2",
        UserName:    "Jane123", 
        FirstName:   "Jane",
        LastName:    "Smith",
        Email:       "jane.smith@example.com",
        Password:    "hashedpassword456",
        Age:         34,
        IsPremium:   false,
        Price:       29.99,
        Description: "New customer",
        PetIDs:      []string{"2"}, // Jane owns Whiskers (the Siamese cat)
        Address:     "456 Oak Ave, Somewhere, USA",
        PhoneNumber: "555-987-6543",
        CreatedAt:   "2023-07-22T15:30:00Z",
    },
    {
        ID:          "3",
        UserName:    "Mike23", 
        FirstName:   "Mike",
        LastName:    "Johnson",
        Email:       "mike.j@example.com",
        Password:    "hashedpassword789",
        Age:         45,
        IsPremium:   true,
        Price:       99.99,
        Description: "VIP customer with premium subscription",
        PetIDs:      []string{"3"}, // Mike owns Bubbles (the Goldfish)
        Address:     "789 Pine Rd, Elsewhere, USA",
        PhoneNumber: "555-456-7890",
        CreatedAt:   "2021-11-05T09:15:00Z",
    },
}