import { Card, CardContent } from "@/components/ui/card"
import type { ForecastData, DailyForecast } from "@/lib/types"
import { getWeatherIcon } from "@/lib/weather-utils"

interface WeatherForecastProps {
  forecast: ForecastData
}

export default function WeatherForecast({ forecast }: WeatherForecastProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {forecast.daily.map((day, index) => (
        <ForecastDay key={index} day={day} />
      ))}
    </div>
  )
}

function ForecastDay({ day }: { day: DailyForecast }) {
  const date = new Date(day.date * 1000)
  const dayName = date.toLocaleDateString(undefined, { weekday: "short" })
  const monthDay = date.toLocaleDateString(undefined, { day: "numeric", month: "short" })
  const weatherIcon = getWeatherIcon(day.icon, "h-10 w-10")

  return (
    <Card>
      <CardContent className="p-4 flex flex-col items-center">
        <p className="font-medium">{dayName}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{monthDay}</p>
        <div className="my-2">{weatherIcon}</div>
        <p className="text-sm capitalize">{day.description}</p>
        <div className="flex justify-between w-full mt-2">
          <p className="text-sm font-medium">{Math.round(day.tempMax)}°</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{Math.round(day.tempMin)}°</p>
        </div>
      </CardContent>
    </Card>
  )
}
