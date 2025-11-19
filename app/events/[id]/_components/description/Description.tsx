"use client"
import React, { useState } from 'react'

export default function Description({
    description
}: { description: string }) {
    const [expanded, setExpanded] = useState(false);
    const max = 200;
    const elipsis = description.length >= max ? '...' : ''
    const isLong = description.length > max;
    const shown = expanded ? description : description.slice(0, max) + elipsis;
    return (
        <div className='my-3 bg-radial-[at_25%_25%] from-gray-800 to-zinc-900 to-75% p-3 rounded-2xl'>
            <p className='text-2xl my-2 truncate'>About</p>
            <p>
                {shown}
            </p>
            {isLong && (
                <button onClick={() => setExpanded(!expanded)}>
                    {expanded ? "Read Less" : "Read More"}
                </button>
            )}
        </div>
    )
}
