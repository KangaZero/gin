document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const addPetForm = document.getElementById("add-pet-form");
  const petDetailsSection = document.getElementById("pet-details");
  const petDetailsContent = document.getElementById("pet-details-content");
  const backToListBtn = document.getElementById("back-to-list");

  // Event listeners for pet actions
  document.addEventListener("click", function (e) {
    // View details button
    if (e.target.classList.contains("view-details-btn")) {
      const petId = e.target.getAttribute("data-id");
      fetchPetDetails(petId);
    }

    // Edit button
    if (e.target.classList.contains("edit-btn")) {
      const petId = e.target.getAttribute("data-id");
      showEditForm(petId);
    }

    // Delete button
    if (e.target.classList.contains("delete-btn")) {
      const petId = e.target.getAttribute("data-id");
      if (confirm("Are you sure you want to remove this pet?")) {
        deletePet(petId);
      }
    }
  });

  // Add pet form submission
  if (addPetForm) {
    addPetForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = {
        name: document.getElementById("name").value,
        species: document.getElementById("species").value,
        breed: document.getElementById("breed").value,
        age: parseInt(document.getElementById("age").value),
        price: parseFloat(document.getElementById("price").value),
        description: document.getElementById("description").value,
        available: document.getElementById("available").checked,
      };

      createPet(formData);
    });
  }

  // Back to list button
  if (backToListBtn) {
    backToListBtn.addEventListener("click", function () {
      petDetailsSection.style.display = "none";
      document.getElementById("pet-list").style.display = "block";
    });
  }

  // API Functions

  // Fetch pet details
  function fetchPetDetails(id) {
    fetch(`/api/pets/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Pet not found");
        }
        return response.json();
      })
      .then((pet) => {
        showPetDetails(pet);
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  }

  // Show pet details
  function showPetDetails(pet) {
    document.getElementById("pet-list").style.display = "none";
    document.getElementById("add-pet").style.display = "none";

    petDetailsContent.innerHTML = `
            <h3>${pet.name}</h3>
            <p><strong>ID:</strong> ${pet.id}</p>
            <p><strong>Species:</strong> ${pet.species}</p>
            <p><strong>Breed:</strong> ${pet.breed}</p>
            <p><strong>Age:</strong> ${pet.age} years</p>
            <p><strong>Price:</strong> $${pet.price}</p>
            <p><strong>Description:</strong> ${pet.description}</p>
            <p><strong>Available:</strong> ${pet.available ? "Yes" : "No"}</p>
        `;

    petDetailsSection.style.display = "block";
  }

  // Create a new pet
  function createPet(petData) {
    fetch("/api/pets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(petData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create pet");
        }
        return response.json();
      })
      .then((data) => {
        alert("Pet added successfully!");
        window.location.reload(); // Refresh the page to show the new pet
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  }

  // Show edit form for a pet
  function showEditForm(id) {
    fetch(`/api/pets/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Pet not found");
        }
        return response.json();
      })
      .then((pet) => {
        // Hide other sections
        document.getElementById("pet-list").style.display = "none";
        document.getElementById("add-pet").style.display = "none";

        // Create edit form HTML
        petDetailsContent.innerHTML = `
                    <form id="edit-pet-form">
                        <div class="form-group">
                            <label for="edit-name">Name:</label>
                            <input type="text" id="edit-name" name="name" value="${
                              pet.name
                            }" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-species">Species:</label>
                            <input type="text" id="edit-species" name="species" value="${
                              pet.species
                            }" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-breed">Breed:</label>
                            <input type="text" id="edit-breed" name="breed" value="${
                              pet.breed
                            }" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-age">Age:</label>
                            <input type="number" id="edit-age" name="age" value="${
                              pet.age
                            }" min="0" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-price">Price ($):</label>
                            <input type="number" id="edit-price" name="price" value="${
                              pet.price
                            }" min="0" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-description">Description:</label>
                            <textarea id="edit-description" name="description" required>${
                              pet.description
                            }</textarea>
                        </div>
                        <div class="form-group">
                            <label for="edit-available">Available:</label>
                            <input type="checkbox" id="edit-available" name="available" ${
                              pet.available ? "checked" : ""
                            }>
                        </div>
                        <button type="submit">Update Pet</button>
                        <button type="button" id="cancel-edit">Cancel</button>
                    </form>
                `;

        petDetailsSection.style.display = "block";

        // Add event listeners
        document
          .getElementById("edit-pet-form")
          .addEventListener("submit", function (e) {
            e.preventDefault();

            const updatedData = {
              name: document.getElementById("edit-name").value,
              species: document.getElementById("edit-species").value,
              breed: document.getElementById("edit-breed").value,
              age: parseInt(document.getElementById("edit-age").value),
              price: parseFloat(document.getElementById("edit-price").value),
              description: document.getElementById("edit-description").value,
              available: document.getElementById("edit-available").checked,
            };

            updatePet(id, updatedData);
          });

        document
          .getElementById("cancel-edit")
          .addEventListener("click", function () {
            petDetailsSection.style.display = "none";
            document.getElementById("pet-list").style.display = "block";
            document.getElementById("add-pet").style.display = "block";
          });
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  }

  // Update a pet
  function updatePet(id, petData) {
    fetch(`/api/pets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(petData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update pet");
        }
        return response.json();
      })
      .then((data) => {
        alert("Pet updated successfully!");
        window.location.reload(); // Refresh the page to show the updated pet
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  }

  // Delete a pet
  function deletePet(id) {
    fetch(`/api/pets/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete pet");
        }
        return response.json();
      })
      .then((data) => {
        alert("Pet removed successfully!");
        window.location.reload(); // Refresh the page to show the removal
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  }
});
