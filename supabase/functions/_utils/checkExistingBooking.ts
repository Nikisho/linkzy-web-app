import { supabaseAdmin } from "./supabase.ts";

export const checkExistingBooking = async (
    user_id: number,
    featured_event_id: number,
    corsHeaders: any,
): Promise<Response | null> => {
    console.log("Booking parameters received :", user_id, featured_event_id);
    const { data: existingBooking, error } = await supabaseAdmin
        .from("featured_event_bookings")
        .select("*")
        .eq("user_id", user_id)
        .eq("featured_event_id", featured_event_id)
        .maybeSingle();

    if (error) {
        // Check if it's a "multiple rows" error or other error
        if (
            error.code === "PGRST116" ||
            error.message?.includes("0 or more than 1 row")
        ) {
            // This is expected - no rows or multiple rows found, just log and continue
            console.log(
                "No unique booking found for user:",
                user_id,
                "event:",
                featured_event_id,
            );
            // Continue with your logic - existingBooking will be null
        } else {
            // This is an actual database error that should be handled
            console.log("Failed to check existing booking:", error.message);
            return new Response(
                JSON.stringify({
                    error: `Failed to check existing booking: ${error.message}`,
                }),
                {
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                    status: 500,
                },
            );
        }
    }

    if (existingBooking) {
        return new Response(
            JSON.stringify({
                error: "User already has a booking for this event",
                booking_id: existingBooking.id,
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 409,
            },
        );
    }

    return null; // no errors, no existing booking
};
