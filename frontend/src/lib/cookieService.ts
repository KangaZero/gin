// Cookie API interface for TypeScript
interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functionality: boolean;
  targeting: boolean;
}

// Function to get current cookie preferences from the backend
export async function getCookiePreferences(): Promise<CookiePreferences> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cookie-preferences`, {
      method: 'GET',
      credentials: 'include', // Important for cookies
    });

    if (!response.ok) {
      throw new Error(`Failed to get cookie preferences: ${response.status}`);
    }

    const data = await response.json();
    return data.preferences;
  } catch (error) {
    console.error('Error fetching cookie preferences:', error);
    
    // Return default preferences if there's an error
    return {
      essential: true,
      analytics: false,
      functionality: false,
      targeting: false
    };
  }
}

// Function to set cookie preferences
export async function setCookiePreferences(preferences: CookiePreferences): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cookie-preferences`, {
      method: 'POST',
      credentials: 'include', // Important for cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error(`Failed to set cookie preferences: ${response.status}`);
    }
    
    // You could handle the response here if needed
  } catch (error) {
    console.error('Error setting cookie preferences:', error);
    throw error;
  }
}