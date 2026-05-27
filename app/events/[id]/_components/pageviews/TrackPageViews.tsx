"use client"
import { getVisitorId } from "@/app/_utils/getVisitorId"
import { postEventType } from "@/app/_utils/postEventType"
import { useEffect } from "react"
function TrackPageViews({ featured_event_id }: { featured_event_id: string }) {
    const handlePageView = async () => {
        // This function can be expanded in the future to include more complex logic, such as tracking time spent on page, scroll depth, etc.
        await postEventType({
            featured_event_id: Number(featured_event_id),
            event_type: 'page_view',
            visitor_id: await getVisitorId()
        });
    }
    useEffect(() => {
        handlePageView();
    }, []);
    return (
        <></>
    )
}

export default TrackPageViews