import supabase from "@/supabase";

export const postEventType = async ({
    featured_event_id,
    event_type,
    visitor_id,
}: {
    featured_event_id: number
    event_type: string
    visitor_id?: string
}) => {
    try {
            const { data, error, response } = await supabase.functions.invoke(
                'track-event-analytics',
                {
                    body: {
                        featured_event_id: featured_event_id,
                        event_type: event_type,
                        visitor_id: visitor_id 
                    },
                }
            )
            if (response?.status !== 200) {
                console.error('Failed to post event type:', response);
            } 
            if (data) {
                console.log('Event type posted successfully:', data);
            }
            if (error) {
                console.error('Supabase function error:', error);
            };
    } catch (err) {
        console.log(err)
    }
}