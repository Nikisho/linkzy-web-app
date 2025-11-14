import GroupsIcon from '@mui/icons-material/Groups';
import ChatIcon from '@mui/icons-material/Chat';
import EventIcon from '@mui/icons-material/Event';
import RsvpIcon from '@mui/icons-material/Rsvp';
import { Link } from 'react-scroll';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import colours from '../../_utils/colours'
import Image from 'next/image';

function ThirdScroll() {
    const appBenefits = [
        {
            mainContent: "Organise Meetups for free & Create Lasting Memories",
            subContent: "Never miss out on a chance to bond with friends.",
            icon: <GroupsIcon fontSize='large' color='inherit' />
        },
        {
            mainContent: "Real-Time Chat ",
            subContent: "Stay connected with friends and plan on the go.",
            icon: <ChatIcon fontSize='large' color='inherit' />
        },
        {
            mainContent: "Discover events near you",
            subContent: "From coffee catch-ups to weekend adventures, there's always something happening",
            icon: <EventIcon fontSize='large' color='inherit' />
        },
        {
            mainContent: "Manage RSVPs",
            subContent: "Track attendee responses and stay updated on who’s coming to your events.",
            icon: <RsvpIcon fontSize='large' color='inherit' />
        },
    ]
    return (
        <div 
            style={{backgroundColor: colours.primaryColour}}
            className='h-auto  flex flex-col justify-center xl:py-10'>
            <div className='bg-black h-full xl:h-2/3 2xl:h-1/2 flex flex-col xl:flex-row '>
                <div className='w-full xl:w-1/2 '>
                    <Image
                        src='/thirdscrollmainimage.jpg'
                        width={5100}
                        height={1500}
                        alt='thirdscroll'
                    />
                </div>
                {/* Promotional Copy */}
                <div className='w-full xl:h-auto xl:w-2/3  text-white flex flex-col justify-center px-5 py-5 xl:p-0'>
                    {appBenefits.map((object) => (
                        <div 
                            key={object.mainContent}
                            className='my-2 flex xl:items-center space-x-5 xl:ml-8 '>
                            <div 
                                style={{backgroundColor: colours.primaryColour}}
                                className='p-3 rounded-lg text-black shadow-lg h-1/2 xl:h-auto'>
                                {object.icon}
                            </div>
                            <div>
                                <div className='xl:text-2xl font-bold'>
                                    {object.mainContent}
                                </div>
                                <div className='xl:text-xl'>
                                    {object.subContent}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
            <div className=' flex justify-center items-center  text-black'>
                <Link className=' my-4 rounded-full shadow-xl font-semibold h-11 w-auto px-5 space-x-2 flex items-center animate-pulse bg-white hover:scale-95 hover:cursor-pointer transition duration-700'
                    to="home"
                    smooth={true}
                    duration={900}
                >
                    <ArrowUpwardIcon
                        fontSize='medium'
                    /> 
                    <p >
                        Sign up
                    </p>
                </Link>
            </div>
        </div>
    )
}

export default ThirdScroll