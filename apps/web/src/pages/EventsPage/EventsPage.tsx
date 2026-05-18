import { EventCard } from "../../UI/components/EventCard/EventCard";
export const EventsPage = () => {
  const events = [
    {
      id: 1,
      title: "Event 1",
      imageUrl: "https://via.placeholder.com/150",
      price: { amount: null, isFree: true },
      startsAt: "2026-05-18",
      venue: {
        address: "123 Main St",
        district: "District 1",
      },
    },
    {
      id: 2,
      title: "Event 2",
      imageUrl: "https://via.placeholder.com/150",
      price: { amount: 10, isFree: false },
      startsAt: "2026-05-18",
      venue: {
        address: "123 Main St",
        district: "District 1",
      },
    },
    {
      id: 3,
      title: "Event 3",
      imageUrl: "https://via.placeholder.com/150",
      price: { amount: null, isFree: true },
      startsAt: "2026-05-18",
      venue: {
        address: "123 Main St",
        district: "District 1",
      },
    },
    {
      id: 4,
      title: "Event 4",
      imageUrl: "https://via.placeholder.com/150",
      price: { amount: 10, isFree: false },
      startsAt: "2026-05-18",
      venue: {
        address: "123 Main St",
        district: "District 1",
      },
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Events Page</h1>
      <div className="grid grid-cols-4 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
};
