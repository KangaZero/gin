"use client";

import { baseURL } from "@/config";

/**
 * Client-side function to fetch pet name suggestions
 */
export async function getPetNameSuggestions(name: string): Promise<string[]> {
  try {
    if (!name || name.trim().length === 0) {
      return [];
    }

    const response = await fetch(`${baseURL}/api/pets/suggestions/${name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch pet name suggestions", response.status);
      return [];
    }

    const data = await response.json();
    return data.suggestions || [];
  } catch (error) {
    console.error("Error fetching pet name suggestions:", error);
    return [];
  }
}
