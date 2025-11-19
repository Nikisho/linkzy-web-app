// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { supabaseAdmin } from "../_utils/supabase.ts";
import { generateTicket } from "../_utils/generateTicket.ts";
import { bookFeaturedEvent } from "../_utils/bookFeaturedEvent.ts";
import { checkExistingBooking } from "../_utils/checkExistingBooking.ts"
console.log("Hello from Functions!");
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
    const { user, selected_ticket, event } = await req.json();
    let user_id;

    //Check ticket still exists
    const { data: ticket, error: ticketErr } = await supabaseAdmin
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
    const { data: existingUser, error: fetchErr } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", user.email)
      .single();

    if (fetchErr) {
      console.log("Error fetching user :", fetchErr);
    }

    if (existingUser) {
      user_id = existingUser.id;
    } else {
      // Insert user
      const { data: newUser, error: insertErr } = await supabaseAdmin
        .from("users")
        .insert({
          email: user.email,
          name: user.name,
          guest: true,
        })
        .select("id")
        .single();

      // Race condition: someone inserted the user first
      if (insertErr && insertErr.code === "23505") {
        const { data: raceUser } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single();
        user_id = raceUser.id;
      } else if (insertErr) {
        throw insertErr;
      } else {
        user_id = newUser.id;
      }
    }

    //check user has booked
    const existing = await checkExistingBooking(user_id, ticket.featured_event_id, corsHeaders);
    if (existing) return existing;

    await bookFeaturedEvent(
      user_id,
      ticket.featured_event_id,
      ticket.tickets_sold,
      null,
      event.chat_room_id,
      ticket.ticket_type_id,
    );

    //create a ticket, return success
    await generateTicket(
      user_id,
      ticket.featured_event_id,
      event.date,
      ticket.ticket_type_id,
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
