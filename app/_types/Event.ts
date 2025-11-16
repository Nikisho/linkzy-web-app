export interface Event {
    title: string;
    description: string;
    date: string;
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
    ticket_types : {
      price: number;
      name: string;
      description: string;
      quantity:number;
      ticket_type_id:number;
      featured_event_id:number;
      is_free:boolean
      sales_start:Date;
      sales_end:Date
    }[]
}