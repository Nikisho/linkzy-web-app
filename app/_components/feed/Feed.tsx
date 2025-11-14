'use client'
import { useEffect, useState } from 'react';
import supabase from '../../../supabase'
import Image from 'next/image';
import { Event } from '@/app/_types/Event';
import formatDateShortWeekday from '@/app/_utils/formatDateShortWeekday';
import { getLowestPrice } from '@/app/_utils/getLowetPrice';
function Feed() {
    const [events, setEvents] = useState<Event[]>([]);
    const fetchEvents = async () => {
        const { data, error } = await supabase
            .from('featured_events')
            .select(`*, ticket_types(*), organizers(*, users(*))`)
        if (data) {
            console.log(data);
            setEvents(data)
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const RenderItem = ({ item }: { item: Event }) => {
        const formattedDate = formatDateShortWeekday(item.date);
        const lowestPrice = getLowestPrice(item.ticket_types);

        return (
            <a
                href={`/events/${item.featured_event_id.toString()}`}
                className="flex flex-col lg:flex-col mt-2 items-center sm:items-start hover:opacity-20 hover:cursor-pointer transition duration-500">
                <div className=' justify-between '>
                    <div className="w-full lg:mx-3 sm:w-70 h-70 overflow-hidden rounded-xl lg:mb-3">
                        <Image
                            src={item.image_url!}
                            alt={item.featured_event_id.toString()}
                            width={240}
                            height={240}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <p 
                        
                        className="text-base sm:text-lg font-semibold mx-4 pb-2 truncate">{item.title}</p>
                    <div className='flex justify-between '>

                        <div className="mt-3 sm:mt-0 sm:ml-4 text-center sm:text-left">

                            <p className="text-base sm:text-lg font-semibold">{item.organizers.users.name}</p>

                            {lowestPrice !== null && (
                                <p className="text-sm sm:text-base font-medium text-gray-200">
                                    {lowestPrice}
                                </p>
                            )}
                        </div>
                        <p className="text-sm text-amber-500">{formattedDate}</p>
                    </div>

                </div>

            </a>

        );
    };

    return (
        <div className="p-4 flex justify-center">
            <div
                style={{
                    maxWidth: 1300
                }}
                className='2xl:w-2/3 '>
                <h1 className="text-2xl font-bold mb-4">Events</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-y-5">
                    {events?.map((event) => (
                        <RenderItem key={event.featured_event_id} item={event} />
                    ))}
                </div>
            </div>
        </div>
    );

}

export default Feed