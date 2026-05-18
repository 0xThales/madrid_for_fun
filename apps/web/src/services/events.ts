import { apiInstance } from "../config"
import type { Event } from "../types/events"

const api = apiInstance()

export const getEvents = async (): Promise<Event[]> => {
  const { data: eventsData } = await api.get("/api/events")
  return eventsData.data
}
