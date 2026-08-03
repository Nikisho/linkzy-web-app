import supabase from "@/supabase";

const checkBucketCapacity = async (
    ticketTypeId: number,
    quantityToBuy: number
) => {

    // Get selected ticket type + bucket
    console.log('Starting check')
    const { data: ticketType } = await supabase
        .from("ticket_types")
        .select(`
            ticket_bucket_id,
            ticket_buckets (
                quantity
            )
        `)
        .eq("ticket_type_id", ticketTypeId)
        .single();


    // No bucket, normal ticket logic
    if (!ticketType?.ticket_bucket_id) {
        return true;
    }


    // Get all tickets in same bucket
    const { data: bucketTickets } = await supabase
        .from("ticket_types")
        .select("tickets_sold")
        .eq("ticket_bucket_id", ticketType.ticket_bucket_id);


    const totalSold =
        bucketTickets?.reduce(
            (sum, ticket) => sum + ticket.tickets_sold,
            0
        ) ?? 0;


    const bucketCapacity = (ticketType.ticket_buckets as any).quantity;


    return totalSold + quantityToBuy <= bucketCapacity;
};

export default checkBucketCapacity;