// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { supabaseAdmin } from "../_utils/supabase.ts";
import { generateTicket } from "../_utils/generateTicket.ts";
import { bookFeaturedEvent } from "../_utils/bookFeaturedEvent.ts";
import { checkExistingBooking } from "../_utils/checkExistingBooking.ts";
import { insertUser } from "../_utils/insertUser.ts";
import { checkExistingUser } from "../_utils/checkExistingUser.ts";
import { emailUserUponPurchase } from "../_utils/emailUserUponPurchase.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { user, selected_ticket, event, quantity } = await req.json();
    let user_id;

    //Check ticket still exists
    const { data: ticket_type, error: ticketErr } = await supabaseAdmin
      .from("ticket_types")
      .select("*")
      .eq("ticket_type_id", selected_ticket.ticket_type_id)
      .single();
    // if (ticketErr) throw new Error("COULD_NOT_FETCH_TICKET");
    // if (!ticket) throw new Error("INVALID_TICKET_TYPE");
    // if (ticket.quantity <= 0) throw new Error("SOLD_OUT");

    // const now = new Date();
    // if (now < new Date(ticket.sales_start)) throw new Error("SALES_NOT_STARTED");
    // if (now > new Date(ticket.sales_end)) throw new Error("SALES_ENDED");

    //Check if user email exists, if not create new user as 'guest'
    const existingUser = await checkExistingUser(user.email);

    if (existingUser) {
      user_id = existingUser.id;
    } else {
      user_id = await insertUser(user.name, user.email);
    }

    //check user has booked
    const existing = await checkExistingBooking(
      user_id,
      ticket_type.featured_event_id,
      corsHeaders,
    );
    if (existing) return existing;

    const tickets: { ticket_id: number; qr_code_link: string }[] = [];

    for (let i = 0; i < quantity; i++) {
      const ticketElement = await generateTicket(
        user_id,
        ticket_type.featured_event_id,
        event.date,
        ticket_type.ticket_type_id,
      );

      tickets.push(ticketElement!)
      console.log('tickets are :', ticketElement)
      await bookFeaturedEvent(
        user_id,
        ticket_type.featured_event_id,
        ticket_type.tickets_sold,
        null,
        event.chat_room_id,
        ticket_type.ticket_type_id,
        quantity
      );
    }

    await emailUserUponPurchase(
      user_id,
      ticket_type.featured_event_id,
      tickets
    );

    return new Response(
      JSON.stringify({ user_id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("Function error:", err);
    const status = err.status || 500;
    return new Response(
      JSON.stringify({ error: err.message ?? "UNKNOWN_ERROR" }),
      {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/guest_free_ticket_claim' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
