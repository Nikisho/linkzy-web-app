export interface Event {
    title: string;
    description: string;
    date: string;
    location: string;
    image_url?: string;
    organizer_id: string;
    featured_event_id: number;
    price: string;
    ticket_types : {
      price: number;
      name: string;
    }[]
}