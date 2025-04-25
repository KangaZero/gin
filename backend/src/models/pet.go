package models

import (
	"fmt"
	"math"
	"strings"
)

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
	OwnerID     string  `json:"ownerId"`    // ID of the user who owns this pet
	BirthDate   string  `json:"birthDate"`  // Added field
	Weight      float64 `json:"weight"`     // Added field in kg
	Vaccinated  bool    `json:"vaccinated"` // Added field
	Gender      string  `json:"gender"`     // Added field
	Picture     string  `json:"picture"`    // URL to pet's image
}

// GeneratePets creates and returns a slice of sample pets
func GeneratePets(count int) []Pet {
	species := []string{"Dog", "Cat", "Bird", "Fish", "Rabbit", "Hamster", "Guinea Pig", "Turtle", "Snake", "Lizard"}
	dogBreeds := []string{"Golden Retriever", "Labrador", "Bulldog", "German Shepherd", "Poodle", "Beagle", "Chihuahua", "Husky", "Boxer", "Dachshund"}
	catBreeds := []string{"Siamese", "Persian", "Maine Coon", "Ragdoll", "Bengal", "Sphynx", "British Shorthair", "Scottish Fold", "Abyssinian", "Russian Blue"}
	birdTypes := []string{"Parrot", "Canary", "Finch", "Cockatiel", "Lovebird", "Budgie", "Macaw", "Cockatoo", "Parakeet", "African Grey"}
	fishTypes := []string{"Goldfish", "Betta", "Guppy", "Angelfish", "Tetra", "Molly", "Discus", "Swordtail", "Platy", "Clownfish"}
	rabbitBreeds := []string{"Holland Lop", "Mini Rex", "Netherland Dwarf", "Flemish Giant", "Lionhead", "English Angora", "Dutch", "Californian", "Harlequin", "Polish"}
	names := []string{"Max", "Buddy", "Charlie", "Jack", "Cooper", "Rocky", "Bear", "Duke", "Teddy", "Tucker", "Oliver", "Leo", "Milo", "Jasper", "Oscar", "Luna", "Bella", "Lucy", "Daisy", "Lily", "Zoe", "Lola", "Sadie", "Molly", "Bailey", "Stella", "Maggie", "Roxy", "Sophie", "Chloe", "Penny", "Coco", "Ruby", "Gracie", "Rosie", "Peanut", "Shadow", "Simba", "Smokey", "Tiger", "Kitty", "Pepper", "Midnight", "Salem", "Felix", "Oreo", "Boots", "Pumpkin", "Mittens", "Thor", "Loki", "Zeus", "Apollo", "Odin", "Atlas", "Titan", "Neptune", "Athena", "Artemis", "Aphrodite", "Iris", "Elsa", "Nova", "Astro", "Bubbles", "Finley", "Goldie", "Nemo", "Dory", "Splash", "Flipper", "Thumper", "Hopper", "Snowball", "Cottontail", "Whiskers", "Fluffy", "Fuzzy", "Spike", "Rex", "Draco", "Slither", "Ziggy", "Toby", "Winston", "Marley", "Lucky", "Scout", "Jake", "Riley", "Rusty", "Sammy", "Gizmo", "Dexter", "Archie", "Baxter", "Chester", "George", "Henry", "Buster", "Linus", "Phoebe", "Ruby", "Willow", "Xena", "Yuki", "Zelda", "Ace", "Bolt", "Cosmo", "Dash", "Echo", "Flash", "Ghost"}

	pets := make([]Pet, count)
	for i := 0; i < count; i++ {
		id := i + 1
		speciesIndex := i % len(species)
		speciesName := species[speciesIndex]

		// Select breed based on species
		var breed string
		switch speciesName {
		case "Dog":
			breed = dogBreeds[i%len(dogBreeds)]
		case "Cat":
			breed = catBreeds[i%len(catBreeds)]
		case "Bird":
			breed = birdTypes[i%len(birdTypes)]
		case "Fish":
			breed = fishTypes[i%len(fishTypes)]
		case "Rabbit":
			breed = rabbitBreeds[i%len(rabbitBreeds)]
		default:
			breed = speciesName
		}

		// Calculate a reasonable price based on species and randomness
		var price float64
		switch speciesName {
		case "Dog":
			price = 300 + float64(i%700)
		case "Cat":
			price = 200 + float64(i%400)
		case "Bird":
			price = 50 + float64(i%200)
		case "Fish":
			price = 10 + float64(i%90)
		case "Rabbit":
			price = 60 + float64(i%140)
		default:
			price = 40 + float64(i%160)
		}

		// Generate random age between 1-10 years
		age := 1 + (i % 10)

		// Generate random weight based on species
		var weight float64
		switch speciesName {
		case "Dog":
			weight = 5.0 + float64(i%25)
		case "Cat":
			weight = 2.5 + float64(i%10)*0.5
		case "Bird":
			weight = 0.1 + float64(i%5)*0.1
		case "Fish":
			weight = 0.05 + float64(i%10)*0.05
		case "Rabbit":
			weight = 1.0 + float64(i%5)
		default:
			weight = 0.2 + float64(i%8)*0.3
		}

		// Gender alternates
		gender := "Male"
		if i%2 == 0 {
			gender = "Female"
		}

		// Every 3rd pet is not available
		available := true
		if i%3 == 0 {
			available = false
		}

		// Every 4th pet is not vaccinated
		vaccinated := true
		if i%4 == 0 {
			vaccinated = false
		}

		// Birth date is between 1-10 years ago based on age
		birthYear := 2025 - age
		birthMonth := 1 + (i % 12)
		birthDay := 1 + (i % 28)
		birthDate := fmt.Sprintf("%d-%02d-%02d", birthYear, birthMonth, birthDay)

		// Owner ID cycles through 1-20 (for 20 users)
		ownerID := fmt.Sprintf("%d", (i%20)+1)

		// Name from the list, cycling through
		name := names[i%len(names)]

		// Generate specific picture URL based on species and pet ID
		// This ensures consistent image assignments rather than random ones
		var picture string
		imageNumber := (id % 5) + 1 // Use pet ID to determine image number (1-5)

		// For the first few pets of each species, use specific images to ensure coverage
		if id <= len(species)*5 {
			speciesForImage := species[(id-1)/5]
			imageNumberForFirstPets := ((id - 1) % 5) + 1
			picture = fmt.Sprintf("/images/pets/%s_%d.jpg", strings.ToLower(speciesForImage), imageNumberForFirstPets)
		} else {
			picture = fmt.Sprintf("/images/pets/%s_%d.jpg", strings.ToLower(speciesName), imageNumber)
		}

		// If no image exists for this species/number combination, use default image
		if strings.Contains(speciesName, " ") {
			// For multi-word species like "Guinea Pig", use simpler filename
			simpleSpecies := strings.ReplaceAll(strings.ToLower(speciesName), " ", "")
			picture = fmt.Sprintf("/images/pets/%s_%d.jpg", simpleSpecies, imageNumber)
		}

		// Description based on species and breed
		description := fmt.Sprintf("A lovely %d-year-old %s %s that is %s and %s. %s is %s.",
			age,
			breed,
			speciesName,
			map[bool]string{true: "vaccinated", false: "not vaccinated"}[vaccinated],
			map[bool]string{true: "available for adoption", false: "currently not available for adoption"}[available],
			name,
			map[string]string{
				"Male":   "friendly and energetic",
				"Female": "gentle and affectionate",
			}[gender],
		)

		pets[i] = Pet{
			ID:          fmt.Sprintf("%d", id),
			Name:        name,
			Species:     speciesName,
			Breed:       breed,
			Age:         age,
			Price:       math.Round(price*100) / 100, // Round to 2 decimal places
			Description: description,
			Available:   available,
			OwnerID:     ownerID,
			BirthDate:   birthDate,
			Weight:      math.Round(weight*100) / 100, // Round to 2 decimal places
			Vaccinated:  vaccinated,
			Gender:      gender,
			Picture:     picture,
		}
	}

	return pets
}

// Pets is a slice of Pet used for storing our pet data in memory
var Pets = GeneratePets(100) // Generate 100 pets
