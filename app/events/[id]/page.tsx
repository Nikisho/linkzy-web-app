import formatDateShortWeekday from '@/app/_utils/formatDateShortWeekday';
import { getColorFromName } from '@/app/_utils/getColorFromName';
import supabase from '@/supabase';
import Image from 'next/image';
import Description from './_components/description/Description';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import Price from './_components/price/Price';
import SeeTickets from './_components/seetickets/SeeTickets';
import { Metadata } from 'next';
import TrackPageViews from './_components/pageviews/TrackPageViews';
import Promoters from './_components/promoters/Promoters';
import Lineup from './_components/lineup/Lineup';

export async function generateMetadata({ params }: { params: { id: number } }): Promise<Metadata> {
    const { id } = await params;

    const fetchEventData = async () => {
        try {
            const { data, error } = await supabase
                .from('featured_events')
                .select(`*, organizers(*, users(*)), ticket_types(*)`)
                .eq('featured_event_id', id)
                .single();
            if (data) {
                return data;
            }
            if (error) {
                console.error(error.message);
            }
        } catch (error) {
            throw error
        }
    };


    const event = await fetchEventData();

    function getSupabaseStoragePath(publicUrl: string) {
        const marker = "/storage/v1/object/public/featured-events/";
        return publicUrl.split(marker)[1];
    }

    const imagePath = getSupabaseStoragePath(event.image_url);

    const { data } = supabase.storage
        .from("featured-events")
        .getPublicUrl(imagePath, {
            transform: {
                width: 1200,
                height: 630,
                resize: "contain",
                quality: 70,
            },
        });

    const ogImageUrl = data.publicUrl;

    return {
        title: event.title,
        description: event.description,
        openGraph: {
            title: event.title,
            description: event.description,
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: event.title,
            description: event.description,
            images: [ogImageUrl],
        },
    };
}

export default async function EventPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const fetchEventData = async () => {
        try {
            const { data, error } = await supabase
                .from('featured_events')
                .select(`*
                    , organizers(*, users(*))
                    , ticket_types(*)
                    , refund_policy_types(*)
                    , organizer_collaboration(*, organizers(*, users(*)))
                `)
                .eq('featured_event_id', id)
                .single();
            if (data) {
                return data;
            }
            if (error) {
                console.error(error.message);
            }
        } catch (error) {
            throw error
        }
    };
    const event = await fetchEventData();

    const collaborators = event.organizer_collaboration?.map(
        ({ organizers: { users: { photo, name } } }: { organizers: { users: { photo: string, name: string } } }) => ({
            photo: photo,
            name: name,
        })
    ) ?? [];

    console.log('Collaborators:', collaborators);
    return (
        <>
            <div className='text-white h-full mx-5 xl:flex justify-center xl:mt-20 xl:w-full'>
                <div className='xl:w-2/3 xl:flex xl:space-x-15 xl:'>
                    <div className='xl:w-1/3'>

                        <div className='w-full flex justify-center xl:justify-start xl:hidden'>
                            <p className='text-xl xl:text-2xl font-semibold'>
                                {event.title}
                            </p>
                        </div>

                        <div className='w-full  my-5 flex justify-center'>
                            {/* <Image
                                src={event.image_url}
                                height={370}
                                width={370}
                                alt={event.title}
                                className='rounded-xl xl:w-[110%]'
                            /> */}
                            <img
                                src={event.image_url}
                                height={370}
                                width={370}
                                alt={event.title}
                                className='rounded-xl xl:w-[110%]'
                            />
                        </div>

                        <div
                            className='my-4 mt-7 pb-4 border-b self-center -xl'>
                            <p className='font-semibold mb-2'>Event timing</p>

                            <p>
                                Starts: {formatDateShortWeekday(event.date)}, {event.time.slice(0, -3)}
                            </p>
                            <p>
                                Ends: {event.end_date && formatDateShortWeekday(event.end_date)}, {event.end_time && event.end_time.slice(0, -3)}
                            </p>


                            <div className="pt-4 text-sm text-gray-500">
                                <span className="font-medium">Refund policy:</span>{" "}
                                {event.refund_policy_types.name || "No refunds"}
                            </div>
                        </div>

                        <div className='xl:hidden flex space-x-2'>
                            <LocationPinIcon />
                            <p>
                                {event.location}
                            </p>
                        </div>
                    </div>

                    <div className='xl:w-2/3 flex flex-col justify-between'>
                        <div>
                            <div className='hidden xl:flex'>
                                <p className='text-5xl'>
                                    {event.title}
                                </p>
                            </div>

                            <div className='hidden my-3 xl:flex space-x-2'>
                                <LocationPinIcon />
                                <p className='text-xl'>
                                    {event.location}
                                </p>
                            </div>
                            <Description description={event.description} />


                            <Price
                                ticket_types={event.ticket_types}
                                organizers={event.organizers}
                            />
                        </div>
                        <div className='my-3'>
                            <Promoters
                                organizer={{ name: event.organizers.users.name, photo: event.organizers.users.photo }}
                                collaborators={collaborators}
                            />
                            {/* <p className='text-2xl'>{ collaborators.length> 0 ?'Promoters': 'Promoter' }</p>
                            <div className='flex space-x-2 my-3 items-center '>

                                {
                                    event?.organizers?.users.photo ?
                                        <a href={`/${event?.organizers?.users.name}`} target='_blank' rel='noopener noreferrer' className=" relative h-[50px] w-[50px] overflow-hidden rounded-full">
                                            <img
                                                src={event?.organizers?.users.photo}
                                                alt={event.organizers.users.id}
                                                loading="lazy"
                                                className="object-cover"
                                            />
                                        </a>
                                        :
                                        <div
                                            className='flex justify-center'
                                            style={{
                                                backgroundColor: getColorFromName(event.organizers.users.name),
                                                width: 55,
                                                height: 55,
                                                borderRadius: 50,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginRight: 5,
                                                borderWidth: 1
                                            }}
                                        >
                                            <p style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>
                                                {event.organizers.users.name.charAt(0).toUpperCase()}
                                            </p>
                                        </div>
                                }
                                <p className='ml-3'>
                                    {event.organizers.users.name}
                                </p>
                            </div>
                            <div className='flex items-center space-x-2 '>

                                {
                                    collaborators?.map((collaborator: { photo: string; name: string }, index: number) =>
                                    
                                            <div key={index} className=' mt-2 flex items-center space-x-2'>
                                       
                                            {
                                                collaborator.photo ?
                                                    <a href={`/${collaborator.name}`} target='_blank' rel='noopener noreferrer' className=" relative h-[50px] w-[50px] overflow-hidden rounded-full">
                                                        <img
                                                            src={collaborators[0].photo}
                                                            alt={collaborator.name}
                                                            loading="lazy"
                                                            className="object-cover"
                                                        />
                                                    </a>
                                                    :
                                                    <div
                                                        className='flex justify-center'
                                                        style={{
                                                            backgroundColor: getColorFromName(collaborator.name),
                                                            width: 55,
                                                            height: 55,
                                                            borderRadius: 50,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            marginRight: 5,
                                                            borderWidth: 1
                                                        }}
                                                    >
                                                        <p style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>
                                                            {collaborator.name.charAt(0).toUpperCase()}
                                                        </p>
                                                    </div>
                                            }
                                            <p className='ml-3'>
                                                {collaborator.name}
                                            </p>
                                        </div>
                                        )
                                    
                                }
                            </div> */}
                            {
                                event.featured_event_id === 304 &&
                            <Lineup
                                members={[
                                    {
                                        name: 'Lingala Lounge',
                                        description: `Lingala Lounge creates spaces for people to connect through Lingala and Congolese culture, whether they speak fluently, understand a little or are just beginning.

At Learn Lingala Live, Lingala Lounge will bring the conversation, community and energy that turn language learning into a shared experience.`,
                                        photo: 'https://wffeinvprpdyobervinr.supabase.co/storage/v1/object/public/app_assets/lingalaloungeimage.webp',
                                        tiktok: 'https://www.tiktok.com/@lingalalounge',
                                        instagram: 'https://www.instagram.com/lingalaloungee/?hl=zh-cn',
                                    },
                                ]}
                            />
                            }
                            {event.cancelled ?
                                <div className='bg-red-500 text-white p-2 rounded-md mb-3'>
                                    This event has been cancelled.
                                </div>
                                :
                                <SeeTickets
                                    // ticket_types={event.ticket_types}
                                    event={event}
                                />

                            }
                        </div>
                        <TrackPageViews featured_event_id={id} />
                    </div>
                </div>
            </div>
        </>

    )
}
