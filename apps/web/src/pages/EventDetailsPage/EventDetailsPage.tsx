import { useParams } from "react-router-dom";
export const EventDetailsPage = () => {
  const { eventId } = useParams();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Event Details</h1>
      <p className="text-lg">Event ID: {eventId}</p>
    </div>
  );
};
