'use client'
import React, { useEffect, useState } from 'react';
import { Collapse } from '@mui/material';
import { Link } from 'react-scroll';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
	GooglePlayButton,
	AppStoreButton,
} from "react-mobile-app-button";
import Image from 'next/image';

const Home = () => {
	const [open, setOpen] = useState(false);
	const IOSUrl = 'https://apps.apple.com/us/app/linkzy/id6720764102';
	const AndroidUrl = 'https://play.google.com/store/apps/details?id=com.linkzy';
	const primaryColour = '#fffef4';

	useEffect(() => {
		const timer = setTimeout(() => setOpen(true), 500);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div 
			style={{
				background: primaryColour,
				color: '#000000',
			}}
			className={`justify-center items-center flex `}>

			<div className='flex flex-col xl:flex-row  justify-center xl:py-5 space-y-5 xl:space-y-0 w-full 2xl:w-2/3 xl:mt-16 xl:w-4/5 '>
				<div className='w-full xl:w-1/2 space-y-5 p-3 2xl:place-self-center xl:pl-10 pt-10'>

					<Collapse 
						in={open} orientation='vertical' timeout={2000}>
						<div className='text-xl font-sans px-3 xl:p-0 self-center xl:w-full space-y-4'>
							<p className='text-3xl font-bold'>No plans this weekend?</p>
							<p className='text-2xl'>Meet Linkzy, the #1 app for connecting with others, scheduling events, and building lasting friendships!</p>
							<p className='text-2xl'>
								Download Linkzy and start making meaningful connections today.
							</p>
						</div>
						<div className='flex my-8 items-center space-y-3 flex-col xl:flex-row xl:space-x-5 xl:space-y-0'>
							<AppStoreButton
								url={IOSUrl}
								theme={"dark"}
								width={200}
								height={60}
								className={"w-full"}
							/>
							<GooglePlayButton
								url={AndroidUrl}
								theme={"dark"}
								width={200}
								height={60}
								className={""}
							/>
						</div>
					</Collapse>
					{/* <SignUpComponent /> */}
					<div className=' w-3/4 flex justify-start items-center px-3 xl:p-0'>

						<Link className='rounded-full text-white shadow-xl font-semibold h-11 w-11 flex justify-center items-center animate-pulse bg-black hover:scale-95 hover:cursor-pointer transition duration-700'
							to="secondscroll"
							smooth={true}
							duration={900}
						>
							<ArrowDownwardIcon
								fontSize='medium'
							/>
						</Link>
						<p className='px-4 font-bold'>
							Why Linkzy?
						</p>
					</div>

				</div>

				<div className='flex flex-col items-center my-5 xl:flex-row  justify-center rounded-xl lg:w-1/2 max-h-screen  '>

					<Image
						src='/linkzyFrames.png'
						width={400}
						height={400}
						alt='screenshot'
						className=' '
					/>
				</div>
			</div>

		</div>
	);
};

export default Home;
