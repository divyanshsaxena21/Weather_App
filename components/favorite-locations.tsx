"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { Location } from "@/lib/types"

interface FavoriteLocationsProps {
  favorites: Location[]
  onSelect: (location: Location) => void
  onRemove: (location: Location) => void
}

export default function FavoriteLocations({ favorites, onSelect, onRemove }: FavoriteLocationsProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-200">Favorite Locations</h3>

        {favorites.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            You haven't added any favorite locations yet. Search for a city and click the star icon to add it to your
            favorites.
          </p>
        ) : (
          <ul className="space-y-2">
            {favorites.map((location, index) => (
              <li
                key={`${location.name}-${index}`}
                className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <button
                  onClick={() => onSelect(location)}
                  className="text-left flex-1 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white"
                >
                  {location.name}
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(location)}
                  className="h-8 w-8 text-slate-500 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove {location.name}</span>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
