import { Event } from "../_types/Event";
import supabase from "@/supabase";
import formatDateShortWeekday from "./formatDateShortWeekday";
import { User } from "../events/[id]/_types/User";
import QRCode from "qrcode";

async function generateQRCodeBase64(value: string) {
    return await QRCode.toDataURL(value, { width: 500 });
}
export const emailUserUponPurchase = async (
    user_id: number,
    event: Event,
    user: User,
) => {
    try {
        const {
            error: confirmation_email_sent_error,
            data: confirmation_email_sent,
        } = await supabase
            .from("featured_event_bookings")
            .select("confirmation_email_sent")
            .eq("user_id", user_id)
            .eq("featured_event_id", event.featured_event_id)
            .single();
        if (confirmation_email_sent?.confirmation_email_sent === true) {
            console.log(
                "Confirmation email already sent.",
                confirmation_email_sent.confirmation_email_sent,
            );
            return;
        }
        if (confirmation_email_sent_error) {
            console.error(
                "Something went wrong checking the confirmation email was sent: ",
                confirmation_email_sent_error,
            );
        }

        const edge_function_base_url =
            "https://wffeinvprpdyobervinr.supabase.co/functions/v1/ticket-purchase-email";
        const qrValue =
            `com.linkzy://event/${event.featured_event_id}/user/${user_id}`;
        const base64Qr = await generateQRCodeBase64(qrValue);

        const {
            data: { session },
        } = await supabase.auth.getSession();

        const accessToken = session?.access_token;
        const response = await fetch(edge_function_base_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                name: user.name,
                email: user.email,
                title: event.title,
                location: event.location,
                date: event.date && event.time &&
                    (formatDateShortWeekday(event.date) + ", " +
                        event.time.slice(0, -3)),
                qrValue: base64Qr.split(",")[1],
            }),
        });

        // if (!response.ok) {
        //     console.error("❌ Email function failed:", await response.text());
        //     return;
        // }

        const data = await response.json();
        console.log("✅ Function response:", data);

        const { error: update_confirmation_email_sent_error } = await supabase
            .from("featured_event_bookings")
            .update({
                confirmation_email_sent: true,
            })
            .eq("user_id", user_id)
            .eq("featured_event_id", event.featured_event_id);

        if (update_confirmation_email_sent_error) {
            console.error(update_confirmation_email_sent_error.message);
        }
    } catch (error: any) {
        console.error("Error booking event:", error.message);
    }
};
