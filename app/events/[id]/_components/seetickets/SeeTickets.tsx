'use client'
import { useState } from "react";
import TicketsModal from "./TicketsModal";
import { TicketTypes } from "../../_types/TicketTypes";

export default function SeeTickets({
    ticket_types
}: {ticket_types: TicketTypes[]}) {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className='bg-white my-5 w-full rounded-full py-3 px-5 xl:w-1/2 xl:mt-10 hover:cursor-pointer hover:opacity-60 transition duration-900'>
                <p className='text-black text-center'>See tickets</p>
            </button>
            <TicketsModal
                open={open}
                setOpen={setOpen}
                ticket_types={ticket_types}
            />
        </div>
    )
}
