export interface TicketTypes{
    ticket_type_id: number;
    featured_event_id: number;
    is_free: boolean;
    sales_start: Date;
    sales_end: Date;
    name:string;
    quantity:number;
    price:number;
    description:string;
}