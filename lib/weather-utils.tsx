import { Sun, Cloud, CloudDrizzle, CloudRain, CloudSnow, CloudFog, CloudLightning, CloudSun } from "lucide-react"

export function getWeatherIcon(iconCode: string, className = "h-16 w-16 text-white") {
  // Map OpenWeatherMap icon codes to Lucide icons
  switch (iconCode) {
    case "01d":
      return <Sun className={className} />
    case "01n":
      return <Sun className={className} />
    case "02d":
    case "02n":
      return <CloudSun className={className} />
    case "03d":
    case "03n":
    case "04d":
    case "04n":
      return <Cloud className={className} />
    case "09d":
    case "09n":
      return <CloudDrizzle className={className} />
    case "10d":
    case "10n":
      return <CloudRain className={className} />
    case "11d":
    case "11n":
      return <CloudLightning className={className} />
    case "13d":
    case "13n":
      return <CloudSnow className={className} />
    case "50d":
    case "50n":
      return <CloudFog className={className} />
    default:
      return <Sun className={className} />
  }
}
