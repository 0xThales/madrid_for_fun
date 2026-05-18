import { CalendarDays, MapPin, Ticket } from "lucide-react";

type EventCardProps = {
  title: string;
  imageUrl: string;
  price: {
    amount: number | null;
    isFree: boolean;
  };
  startsAt: string;
  venue: {
    address: string;
    district: string;
  };
};

export const EventCard = ({
  title,
  imageUrl,
  price,
  startsAt,
  venue,
}: EventCardProps) => {
  const formattedDate = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(startsAt));

  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-neutral-100">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <div className="rounded-full bg-white/90 backdrop-blur px-3 py-1 text-sm font-medium text-neutral-900 shadow">
            {price.isFree ? "Free" : <>€{price.amount}</>}
          </div>
        </div>

        {/* District */}
        <div className="absolute bottom-4 left-4">
          <div className="rounded-full bg-black/50 backdrop-blur px-3 py-1 text-xs font-medium text-white">
            {venue.district}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Date */}
        <div className="mb-3 flex items-center gap-2 text-sm text-neutral-500">
          <CalendarDays size={16} />
          <span>{formattedDate}</span>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h3>

        {/* Address */}
        <div className="mt-3 flex items-start gap-2 text-sm text-neutral-600">
          <MapPin size={16} className="mt-0.5 shrink-0" />
          <span className="line-clamp-2">{venue.address}</span>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            <Ticket size={16} />
            {price.isFree ? "Open event" : "Tickets available"}
          </div>

          <button className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98]">
            Attend
          </button>
        </div>
      </div>
    </div>
  );
};
