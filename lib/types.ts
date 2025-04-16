export interface Location {
  name: string
  lat: number
  lon: number
}

export interface WeatherData {
  temp: number
  feelsLike: number
  tempMin: number
  tempMax: number
  humidity: number
  pressure: number
  windSpeed: number
  description: string
  icon: string
  visibility: number
  sunrise: number
  sunset: number
}

export interface DailyForecast {
  date: number
  tempMin: number
  tempMax: number
  description: string
  icon: string
}

export interface ForecastData {
  daily: DailyForecast[]
}
