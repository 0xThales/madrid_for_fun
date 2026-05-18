export type QueryParamValue = string | string[] | number | undefined;

export type QueryParams = Record<string, QueryParamValue>;

export type Event = {
  id: number;
  title: string;
  description: string | null;
  category: string;
  tags: string[];
  startsAt: string;
  endsAt: string | null;
  venue: {
    name: string | null;
    address: string | null;
    district: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  price: {
    amount: number | string | null;
    isFree: boolean;
    details: string | null;
  };
  imageUrl: string | null;
  source: {
    name: string | null;
    url: string | null;
  };
};

export type DateRange = {
  from?: Date;
  to?: Date;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type PlanPreferences = {
  mood?: string;
  when?: string;
  district?: string;
  budget?: string;
  categories?: string[];
};

export type Plan = {
  id: string;
  title: string;
  mood: string;
  description: string;
  districts: string[];
  estimatedPrice: string;
  events: Event[];
};

export type EventService = {
  list(query: QueryParams): PaginatedResponse<Event>;
  findById(id: string | number): Event | null;
};

export type MetaService = {
  getMeta(): {
    name: string;
    referenceDate: string;
    totalEvents: number;
    categories: string[];
    districts: string[];
    moods: string[];
  };
};

export type PlanService = {
  generateFromQuery(query: QueryParams): {
    data: Plan[];
    meta: { preferences: PlanPreferences };
  };
  generateFromBody(body?: PlanPreferences): {
    data: Plan[];
    meta: { preferences: PlanPreferences };
  };
};
