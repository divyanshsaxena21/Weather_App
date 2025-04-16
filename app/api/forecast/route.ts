import { type NextRequest, NextResponse } from "next/server"

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
const BASE_URL = "https://api.openweathermap.org/data/2.5"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)

    if (!response.ok) {
      throw new Error("Failed to fetch forecast data")
    }

    const data = await response.json()

    // Process the forecast data to get daily forecasts
    const dailyForecasts = processForecastData(data.list)

    return NextResponse.json({ daily: dailyForecasts })
  } catch (error) {
    console.error("Error fetching forecast data:", error)
    return NextResponse.json({ error: "Failed to fetch forecast data" }, { status: 500 })
  }
}

// Helper function to process forecast data into daily forecasts
function processForecastData(forecastList: any[]): any[] {
  const dailyData: { [key: string]: any } = {}

  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000)
    const day = date.toISOString().split("T")[0]

    if (!dailyData[day]) {
      dailyData[day] = {
        date: item.dt,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      }
    } else {
      dailyData[day].tempMin = Math.min(dailyData[day].tempMin, item.main.temp_min)
      dailyData[day].tempMax = Math.max(dailyData[day].tempMax, item.main.temp_max)
    }
  })

  return Object.values(dailyData).slice(0, 5)
}
