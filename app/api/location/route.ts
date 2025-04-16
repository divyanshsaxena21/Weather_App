import { type NextRequest, NextResponse } from "next/server"

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
const GEO_URL = "https://api.openweathermap.org/geo/1.0"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=1&appid=${API_KEY}`)

    if (!response.ok) {
      throw new Error("Failed to fetch location data")
    }

    const data = await response.json()

    if (data.length === 0) {
      return NextResponse.json(null)
    }

    return NextResponse.json({
      name: data[0].name,
      lat: data[0].lat,
      lon: data[0].lon,
    })
  } catch (error) {
    console.error("Error searching location:", error)
    return NextResponse.json({ error: "Failed to search location" }, { status: 500 })
  }
}
