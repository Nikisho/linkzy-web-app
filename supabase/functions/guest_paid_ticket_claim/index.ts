// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { stripe } from "../_utils/stripe.ts";
import { supabaseAdmin } from "../_utils/supabase.ts";
import { checkExistingUser } from "../_utils/checkExistingUser.ts";
import { insertUser } from "../_utils/insertUser.ts";
import { checkExistingBooking } from "../_utils/checkExistingBooking.ts";

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

    console.log("user received :", user);

    let user_id;

    const { data: ticket, error: ticketErr } = await supabaseAdmin
      .from("ticket_types")
      .select("*")
      .eq("ticket_type_id", selected_ticket.ticket_type_id)
      .single();

    const existingUser = await checkExistingUser(user.email);
    if (existingUser) {
      user_id = existingUser.id;
    } else {
      user_id = await insertUser(user.name, user.email);
    }

    const existing = await checkExistingBooking(
      user_id,
      ticket.featured_event_id,
      corsHeaders,
    );

    if (existing) return existing;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(selected_ticket.price * 100), // in cents
      currency: "gbp",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        user_id,
        featured_event_id: selected_ticket.featured_event_id,
        ticket_type_id: selected_ticket.ticket_type_id,
        tickets_sold: selected_ticket.tickets_sold,
        date: event.date,
        chat_room_id: event.chat_room_id,
        organizer_id: event.organizer_id,
      },
    });

    console.log("Payment Created :", paymentIntent);

    return new Response(
      JSON.stringify({
        user_id,
        booking_id: null, // you can create a provisional booking after payment succeeds
        client_secret: paymentIntent.client_secret,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/guest_paid_ticket_claim' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
