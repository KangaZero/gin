import { baseURL } from "@/config";

interface Owner {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  price: number;
  description: string;
  available: boolean;
  ownerId?: string;
  birthDate: string;
  weight: number;
  vaccinated: boolean;
  gender: string;
  picture: string;
}

interface PetResponse {
  count: number;
  data: Array<{
    pet: Pet;
    owner: Owner | null;
  }>;
}

interface PetNameSuggestion {
  suggestions: string[];
}


export async function getPets(): Promise<PetResponse> {
  const response = await fetch(`${baseURL}/api/pets`);
  if (!response.ok) {
    throw new Error("Failed to fetch pets");
  }
  console.log("Response from API:", response);
  return response.json();
}

export async function getPetById(
  id: string
): Promise<{ data: { pet: Pet; owner: Owner | null } }> {
  const response = await fetch(`${baseURL}/api/pets/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch pet");
  }
  return response.json();
}

export async function getPetNameSuggestions(name: string, count: number = 10): Promise<string[]> {
  try {
    const response = await fetch(`${baseURL}/api/pets/suggestions/${name}?count=${count}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch pet name suggestions");
    }

    const data: PetNameSuggestion = await response.json();
    return data.suggestions;
  } catch (error) {
    console.error("Error fetching pet name suggestions:", error);
    return [];
  }
}
