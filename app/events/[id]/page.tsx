import formatDateShortWeekday from '@/app/_utils/formatDateShortWeekday';
import { getColorFromName } from '@/app/_utils/getColorFromName';
import supabase from '@/supabase';
import Image from 'next/image';
import Description from './_components/description/Description';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import Price from './_components/price/Price';
import SeeTickets from './_components/seetickets/SeeTickets';
export default async function EventPage({ params }: { params: { id: string } }) {
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
                            <Image
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


                            <Price ticket_types={event.ticket_types} />
                        </div>
                        <div className='my-3'>
                            <p className='text-2xl'>Promoter</p>
                            <div className='flex space-x-2 my-3 items-center '>

                                {
                                    event?.organizers?.users.photo ?
                                        <div className=" relative h-[50px] w-[50px] overflow-hidden rounded-full">
                                            <Image
                                                src={event?.organizers?.users.photo}
                                                alt={event.organizers.users.id}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
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
                            <SeeTickets
                                // ticket_types={event.ticket_types}
                                event={event}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </>

    )
}
