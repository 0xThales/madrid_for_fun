export type Event = {
  id: number
  title: string
  description: string
  category: string // enum: cinema, theater, music, other
  tags: string[]
  startsAt: string
  endsAt: string | null
  venue: Venue
  price: Price
  imageUrl: string
  source: Source
}

type Source = {
  name: string
  url: string
}

type Price = {
  amount: number | null
  isFree: boolean
  details: string
}

type Venue = {
  name: string
  address: string | null
  district: string | null
  latitude: number | null
  longitude: number | null
}
