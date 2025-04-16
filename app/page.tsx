import WeatherDashboard from "@/components/weather-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-50 dark:from-slate-900 dark:to-slate-800">
      <WeatherDashboard />
    </main>
  )
}
