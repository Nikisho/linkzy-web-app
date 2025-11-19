'use client'

import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import { useState } from 'react';

function Header() {
    const [openMenu, setOpenMenu] = useState(false);
    const menuOptions = [
        {
            link: '/',
            text: 'Browse'
        },
        {
            link: '/contact',
            text: 'Contact us'
        }
    ]
    return (
        <div className='xl:flex xl:justify-center'>
            <div className="p-3 my-3 flex justify-between items-center relative xl:w-4/5 2xl:w-2/3">
                {/* Logo */}
                <a
                    href='/'
                    className="flex items-center hover:opacity-25 transtion duration-500 hover:cursor-pointer">
                    <Image
                        src="/icon.png"
                        alt="Main Logo"
                        width={35}
                        height={35}
                        style={{
                            borderRadius: 30,
                            opacity: openMenu ? 0.3 : 1,
                        }}
                        className='lg:h-15 lg:w-15'
                    />
                    <span className="hidden sm:inline ml-2 mx-2 text-3xl font-bold font-stretch-125% ">Linkzy</span>
                </a>

                {/* Desktop Menu */}
                <div className="hidden sm:flex space-x-6 font-semibold items-center">
                    {menuOptions.map((option) => (
                        <a
                            key={option.text}
                            href={option.link}
                            className="hover:text-gray-700 transition-colors"
                        >
                            {option.text}
                        </a>
                    ))}
                    <div className='bg-white p-2  px-4 rounded-full text-black'>
                        <a href='download'>
                            Download Linkzy
                        </a>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className="sm:hidden bg-white rounded-full items-center justify-center flex h-8 w-8"
                >
                    <MenuIcon fontSize="small" color="action" />
                </button>

                {/* Mobile Dropdown */}
                {openMenu && (
                    <div className="rounded-lg right-5 left-5 absolute bg-white top-20 w-11/12 self-center shadow-lg z-50 sm:hidden">
                        {menuOptions.map((menuOption) => (
                            <div key={menuOption.text} className="p-3 py-4 text-black font-semibold ">
                                <a href={menuOption.link}>{menuOption.text}</a>
                            </div>
                        ))}
                        <div className='bg-black p-1 px-4 mx-2 my-2 font-bold rounded-full text-white'>
                            <a href='download'>
                                Download Linkzy
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>

    )
}

export default Header