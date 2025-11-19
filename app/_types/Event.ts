import { TicketTypes } from "../events/[id]/_types/TicketTypes";

export interface Event {
    title: string;
    chat_room_id:number;
    description: string;
    date: string;
    time: string;
    location: string;
    image_url?: string;
    organizer_id: string;
    featured_event_id: number;
    price: string;
    organizers: {
      users: {
        id:number,
        name:string
      }
    }
    ticket_types : TicketTypes[]
}