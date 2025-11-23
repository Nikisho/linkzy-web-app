import formatDateShortWeekday from "@/app/_utils/formatDateShortWeekday";
import supabase from "@/supabase";

export default async function ConfirmationPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    async function fetchEventData() {
        const { data, error } = await supabase
            .from("featured_events")
            .select("*")
            .eq("featured_event_id", id)
            .single();

        if (error) {
            console.error("ConfirmationPage fetch error:", error.message);
            return null;
        }
        return data;
    }

    const event = await fetchEventData();

    return (
        <div className="flex justify-center px-4 py-10">
            <div className="w-full max-w-xl bg-white rounded-xl shadow p-8">
                <h1 className="text-3xl font-bold">Booking Confirmed</h1>

                <p className="mt-3 text-gray-800 text-2xl">
                    Your ticket is confirmed. A confirmation email has been sent.
                </p>

                <div className="border-t pt-3">
                    {event ? (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">{event.title}</h2>

                            {event.image_url && (
                                <img
                                    src={event.image_url}
                                    alt={event.title}
                                    className="rounded-lg object-cover w-full h-56"
                                />
                            )}

                            <p className="text-gray-700">{event.description}</p>

                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                    <span className="font-semibold block text-black">Date & Time</span>
                                    {formatDateShortWeekday(event.date)}, {event.time.slice(0, -3)}
                                </div>

                                <div>
                                    <span className="font-semibold block text-black">Location</span>
                                    {event.location}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">Event details not available.</p>
                    )}
                </div>

                <div className="mt-10">
                    <a
                        href="/"
                        className="block w-full text-center bg-black text-white py-3 rounded-md"
                    >
                        Return Home
                    </a>
                </div>
            </div>
        </div>
    );
}

