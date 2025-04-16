"use client"

import { useState, useEffect } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import WeatherCard from "./weather-card"
import WeatherForecast from "./weather-forecast"
import SearchBar from "./search-bar"
import FavoriteLocations from "./favorite-locations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { fetchWeatherData, fetchForecastData } from "@/lib/weather-api"
import type { WeatherData, ForecastData, Location } from "@/lib/types"

export default function WeatherDashboard() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [favorites, setFavorites] = useLocalStorage<Location[]>("favorite-locations", [])
  const isMobile = useMobile()
  const { toast } = useToast()

  // Function to get weather for a specific location
  const getWeatherForLocation = async (location: Location) => {
    setLoading(true)
    setCurrentLocation(location)

    try {
      const weatherData = await fetchWeatherData(location)
      setCurrentWeather(weatherData)

      const forecastData = await fetchForecastData(location)
      setForecast(forecastData)
    } catch (error) {
      console.error("Error fetching weather data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Function to get user's current location
  const getCurrentLocation = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name: "Current Location",
          }
          getWeatherForLocation(location)
        },
        (error) => {
          console.error("Error getting location:", error)
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please search for a city instead.",
            variant: "destructive",
          })
          setLoading(false)
        },
      )
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation. Please search for a city instead.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  // Function to add/remove from favorites
  const toggleFavorite = (location: Location) => {
    const exists = favorites.some(
      (fav) => fav.name === location.name && fav.lat === location.lat && fav.lon === location.lon,
    )

    if (exists) {
      setFavorites(
        favorites.filter(
          (fav) => !(fav.name === location.name && fav.lat === location.lat && fav.lon === location.lon),
        ),
      )
      toast({
        title: "Removed from favorites",
        description: `${location.name} has been removed from your favorites.`,
      })
    } else {
      setFavorites([...favorites, location])
      toast({
        title: "Added to favorites",
        description: `${location.name} has been added to your favorites.`,
      })
    }
  }

  // Check if current location is in favorites
  const isCurrentLocationFavorite = () => {
    if (!currentLocation) return false

    return favorites.some(
      (fav) => fav.name === currentLocation.name && fav.lat === currentLocation.lat && fav.lon === currentLocation.lon,
    )
  }

  // Get weather for current location on initial load
  useEffect(() => {
    getCurrentLocation()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-slate-800 dark:text-white">Weather Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <SearchBar onSearch={getWeatherForLocation} />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
            </div>
          ) : (
            <>
              {currentWeather && currentLocation && (
                <WeatherCard
                  weather={currentWeather}
                  location={currentLocation}
                  isFavorite={isCurrentLocationFavorite()}
                  onToggleFavorite={() => toggleFavorite(currentLocation)}
                  onRefresh={() => getWeatherForLocation(currentLocation)}
                />
              )}

              {forecast && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">5-Day Forecast</h2>
                  <WeatherForecast forecast={forecast} />
                </div>
              )}
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          {isMobile ? (
            <Tabs defaultValue="favorites" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="favorites">
                <FavoriteLocations favorites={favorites} onSelect={getWeatherForLocation} onRemove={toggleFavorite} />
              </TabsContent>
              <TabsContent value="details">
                {currentWeather && (
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-200">Weather Details</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600 dark:text-slate-300">Humidity: {currentWeather.humidity}%</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Wind: {currentWeather.windSpeed} m/s</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Pressure: {currentWeather.pressure} hPa
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Visibility: {(currentWeather.visibility / 1000).toFixed(1)} km
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Sunrise:{" "}
                        {new Date(currentWeather.sunrise * 1000).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Sunset:{" "}
                        {new Date(currentWeather.sunset * 1000).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <>
              <div className="mb-6">
                <FavoriteLocations favorites={favorites} onSelect={getWeatherForLocation} onRemove={toggleFavorite} />
              </div>

              {currentWeather && (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-200">Weather Details</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600 dark:text-slate-300">Humidity: {currentWeather.humidity}%</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Wind: {currentWeather.windSpeed} m/s</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Pressure: {currentWeather.pressure} hPa
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Visibility: {(currentWeather.visibility / 1000).toFixed(1)} km
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Sunrise:{" "}
                      {new Date(currentWeather.sunrise * 1000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Sunset:{" "}
                      {new Date(currentWeather.sunset * 1000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
