"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, RefreshCw, StarOff } from "lucide-react"
import type { WeatherData, Location } from "@/lib/types"
import { getWeatherIcon } from "@/lib/weather-utils"

interface WeatherCardProps {
  weather: WeatherData
  location: Location
  isFavorite: boolean
  onToggleFavorite: () => void
  onRefresh: () => void
}

export default function WeatherCard({ weather, location, isFavorite, onToggleFavorite, onRefresh }: WeatherCardProps) {
  const weatherIcon = getWeatherIcon(weather.icon)

  return (
    <Card className="overflow-hidden">
      <div className={`p-6 ${getBackgroundClass(weather.icon)}`}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white">{location.name}</h2>
            <p className="text-white/80 text-sm">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onToggleFavorite} className="text-white hover:bg-white/20">
              {isFavorite ? <StarOff className="h-5 w-5" /> : <Star className="h-5 w-5" />}
              <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onRefresh} className="text-white hover:bg-white/20">
              <RefreshCw className="h-5 w-5" />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center">
            {weatherIcon}
            <div className="ml-4">
              <p className="text-5xl font-bold text-white">{Math.round(weather.temp)}°</p>
              <p className="text-white/80 capitalize">{weather.description}</p>
            </div>
          </div>
          <div className="text-right text-white">
            <p>Feels like: {Math.round(weather.feelsLike)}°</p>
            <p>
              Min: {Math.round(weather.tempMin)}° | Max: {Math.round(weather.tempMax)}°
            </p>
          </div>
        </div>
      </div>

      <CardContent className="p-4 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Humidity</p>
          <p className="font-semibold">{weather.humidity}%</p>
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Wind</p>
          <p className="font-semibold">{weather.windSpeed} m/s</p>
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Pressure</p>
          <p className="font-semibold">{weather.pressure} hPa</p>
        </div>
      </CardContent>
    </Card>
  )
}

function getBackgroundClass(iconCode: string): string {
  if (iconCode.includes("01") || iconCode.includes("02")) {
    return "bg-gradient-to-br from-sky-400 to-blue-500"
  } else if (iconCode.includes("03") || iconCode.includes("04")) {
    return "bg-gradient-to-br from-slate-400 to-slate-500"
  } else if (iconCode.includes("09") || iconCode.includes("10")) {
    return "bg-gradient-to-br from-blue-400 to-blue-600"
  } else if (iconCode.includes("11")) {
    return "bg-gradient-to-br from-slate-600 to-slate-800"
  } else if (iconCode.includes("13")) {
    return "bg-gradient-to-br from-blue-200 to-blue-300"
  } else if (iconCode.includes("50")) {
    return "bg-gradient-to-br from-slate-300 to-slate-400"
  } else {
    return "bg-gradient-to-br from-sky-400 to-blue-500"
  }
}
