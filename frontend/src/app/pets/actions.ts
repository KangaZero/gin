"use server";

import { baseURL } from "@/config";

export async function getPetNameSuggestions(name: string): Promise<string[]> {
  try {
    const response = await fetch(`${baseURL}/api/pets/suggestions/${name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch pet name suggestions");
    }

    const data = await response.json();
    return data.suggestions || [];
  } catch (error) {
    console.error("Error fetching pet name suggestions:", error);
    return [];
  }
}