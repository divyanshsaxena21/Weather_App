import type { WeatherData, ForecastData, Location } from "./types"

// Function to search for a location by name
export async function searchLocation(query: string): Promise<Location | null> {
  try {
    const response = await fetch(`/api/location?query=${encodeURIComponent(query)}`)

    if (!response.ok) {
      throw new Error("Failed to fetch location data")
    }

    const data = await response.json()

    if (!data) {
      return null
    }

    return data
  } catch (error) {
    console.error("Error searching location:", error)
    throw error
  }
}

// Function to fetch current weather data
export async function fetchWeatherData(location: Location): Promise<WeatherData> {
  try {
    const response = await fetch(`/api/weather?lat=${location.lat}&lon=${location.lon}`)

    if (!response.ok) {
      throw new Error("Failed to fetch weather data")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw error
  }
}

// Function to fetch forecast data
export async function fetchForecastData(location: Location): Promise<ForecastData> {
  try {
    const response = await fetch(`/api/forecast?lat=${location.lat}&lon=${location.lon}`)

    if (!response.ok) {
      throw new Error("Failed to fetch forecast data")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching forecast data:", error)
    throw error
  }
}
