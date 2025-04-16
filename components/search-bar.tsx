"use client"

import type React from "react"

import { useState } from "react"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { searchLocation } from "@/lib/weather-api"
import type { Location } from "@/lib/types"

interface SearchBarProps {
  onSearch: (location: Location) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const { toast } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a city name",
        variant: "destructive",
      })
      return
    }

    setSearching(true)

    try {
      const location = await searchLocation(query)
      if (location) {
        onSearch(location)
        setQuery("")
      } else {
        toast({
          title: "Location Not Found",
          description: "Could not find the location you searched for. Please try another search.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search Error",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSearching(false)
    }
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name: "Current Location",
          }
          onSearch(location)
        },
        (error) => {
          console.error("Error getting location:", error)
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please search for a city instead.",
            variant: "destructive",
          })
        },
      )
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation. Please search for a city instead.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button type="submit" disabled={searching}>
        {searching ? "Searching..." : "Search"}
      </Button>
      <Button type="button" variant="outline" onClick={handleUseCurrentLocation} title="Use current location">
        <MapPin className="h-4 w-4" />
        <span className="sr-only">Use current location</span>
      </Button>
    </form>
  )
}
