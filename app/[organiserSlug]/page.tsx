import supabase from '@/supabase';
import Image from 'next/image';
import formatDateShortWeekday from '../_utils/formatDateShortWeekday';
import { getLowestPrice } from '../_utils/getLowetPrice';
import { Event } from '../_types/Event';
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { organiserSlug: string } }): Promise<Metadata> {
    const { organiserSlug } = await params;
    const fetchOrganiser = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('name', decodeURIComponent(organiserSlug))
            .single();

        if (error) {
            console.error('Error fetching organiser:', error);
            return null;
        }
        return data;
    };
    const organiserData = await fetchOrganiser();
    return {
        title: organiserData.name,
        description: organiserData.bio,
        openGraph: {
            title: organiserData.name,
            description: organiserData.bio,
            images: [
                {
                    url: organiserData.image_url,
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: organiserData.name,
            description: organiserData.bio,
            images: [organiserData.image_url],
        },
    };
}


async function OrganiserPage({ params }: { params: { organiserSlug: string } }) {

    const { organiserSlug } = await params;
    console.log(await decodeURIComponent(organiserSlug));

    const fetchOrganiser = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('name', decodeURIComponent(organiserSlug))
            .single();

        if (error) {
            console.error('Error fetching organiser:', error);
            return null;
        }
        return data;
    };

    const fetchOrganiserId = async (userId: number) => {
        const { data, error } = await supabase
            .from('organizers')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            console.error('Error fetching organiser ID:', error);
            return null;
        }
        return data;
    };

    const fetchOrganiserEvents = async (organiserId: number) => {
        const { data, error } = await supabase
            .from('featured_events')
            .select(`*`)
            .eq('organizer_id', organiserId)
            .eq('test', false)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching organiser events:', error);
            return [];
        };
        console.log(data)
        return data;
    };

    const organiserData = await fetchOrganiser();
    const organiserId = await fetchOrganiserId(organiserData.id);
    const organiserEvents = await fetchOrganiserEvents(organiserId.organizer_id);

    // app/[organiserSlug]/page.tsx

    const RenderItem = ({ item }: { item: Event }) => {
        const formattedDate = formatDateShortWeekday(item.date);
        const lowestPrice = getLowestPrice(item.ticket_types);

        return (
            <a
                href={`/events/${item.featured_event_id.toString()}`}
                className="flex flex-col lg:flex-col mt-2 items-center sm:items-start hover:opacity-20 hover:cursor-pointer transition duration-500">
                <div className="w-full lg:mx-3 sm:w-70 h-70 overflow-hidden rounded-xl lg:mb-3">
                    <Image
                        src={item.image_url!}
                        alt={item.featured_event_id.toString()}
                        width={240}
                        height={240}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-4 text-center sm:text-left">
                    <p className="text-base sm:text-lg font-semibold">{item.title}</p>
                    <p className="text-sm text-amber-600">{formattedDate}</p>

                    <p className="text-base sm:text-lg font-semibold">{organiserData.name}</p>

                    {lowestPrice !== null && (
                        <>
                            {
                                lowestPrice !== '0' ?
                                    <p className="text-sm sm:text-base font-medium text-gray-200">
                                        £{lowestPrice}
                                    </p> :
                                    <p>
                                        Free
                                    </p>
                            }
                        </>
                    )}
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
                <div className='flex flex-row items-center space-x-5' >
                    <Image
                        src={organiserData.photo || '/default-profile.png'}
                        alt={organiserData.name}
                        width={100}
                        height={100}
                        className="rounded-full mb-4"
                    />
                    <h1 className="text-3xl font-bold mb-4">{organiserData.name}</h1>
                </div>

                <h1 className="text-2xl font-bold mb-4">Events</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-y-5">
                    {organiserEvents?.map((event) => (
                        <RenderItem key={event.featured_event_id} item={event} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OrganiserPage