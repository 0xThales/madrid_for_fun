import { useEffect, useState } from "react"
import { EventCard } from "../../UI/components/EventCard/EventCard"
import { getEvents } from "../../services/events"
import type { Event } from "../../types/events"

export const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await getEvents()
        setEvents(events)
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }
    fetchEvents()
  }, [])

  console.log("events", events)

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Events Page</h1>
      <div className="grid grid-cols-4 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  )
}
