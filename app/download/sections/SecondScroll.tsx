import React from 'react'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Link } from 'react-scroll';
import colours from '../../_utils/colours'
import Image from 'next/image';

function SecondScroll() {
    return (
        <div 
            style={{backgroundColor: colours.primaryColour}}
            className='h-screen flex flex-col justify-center 2xl:items-center'>
            <div className='bg-black h-full xl:h-auto flex flex-col xl:flex-row  text-white'>
                {/* Promotional Copy */}
                <div className='w-full h-1/2 xl:h-auto xl:w-1/2 2xl:w-[60%] items-center flex flex-col justify-center px-5'>
                    <div className='space-y-3 '>

                        <p className='text-2xl font-'>
                            Struggling to keep your friendships close as life gets busier?
                        </p>
                        <p className='text-2xl font-'>
                            Don't let life's demands pull you apart—stay connected with Linkzy!
                        </p>
                        <div className=' w-3/4 flex justify-start py-4 2xl:h-1/3 items-center rounded-xl'>

                            <Link 
                                style={{backgroundColor: colours.primaryColour}}
                                className='rounded-full shadow-xl font-semibold h-11 w-11 flex justify-center items-center animate-pulse hover:scale-95 hover:cursor-pointer transition duration-700'
                                to="thirdscroll"
                                smooth={true}
                                duration={900}
                            // style={{ width: '10' }}
                            >
                                <ArrowDownwardIcon
                                    fontSize='medium'
                                    // color='black'
                                    className='text-black'
                                />
                            </Link>
                            <p className='px-4 font-bold'>
                                See features
                            </p>
                        </div>
                    </div>
                </div>
                <div className='w-full xl:w-1/2 2xl:w-[40%] '>
                    <Image
                        src='/secondscrollmainimage.jpg'
                        width={5100}
                        height={1500}
                        alt='secondscroll'
                    />
                </div>
            </div>
        </div>
    )
}

export default SecondScroll