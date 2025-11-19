import  formatDateShortWeekday  from "../_utils/formatDateShortWeekday.ts";
import { Event } from "./db_types.ts";
import { supabaseAdmin } from "./supabase.ts";

export const emailUserUponPurchase = async (
    user_id: number,
    event: Event,
    user: { name: string; email: string }
) => {
    // try {
        const qrValue =
            `com.linkzy://event/${event.featured_event_id}/user/${user_id}`;

        const dateLabel =
            event.date && event.time
                ? formatDateShortWeekday(event.date) + ", " + event.time.slice(0, -3)
                : null;

        const payload = {
            name: user.name,
            email: user.email,
            title: event.title,
            location: event.location,           
            date: dateLabel,
            qrValue: qrValue,
        };

        const { data, error } = await supabaseAdmin.functions.invoke(
            "ticket-purchase-email",
            {
                body: payload
            }
        );

        if (error) throw error;

        console.log("Email function result:", data);
    // } catch (err: any) {
    //     console.error("Error emailing user:", err.message);
    //     throw err;
    // }
};
