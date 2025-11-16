'use client'
import { Box, Modal } from "@mui/material"
import { TicketTypes } from "../../_types/TicketTypes"
import CloseIcon from '@mui/icons-material/Close';
import supabase from "@/supabase";
import { useEffect, useState } from "react";
import { Event } from "@/app/_types/Event";

function CheckoutModal({
    open,
    setOpen,
    event,
    selectedTicket
}: { open: boolean, setOpen: (bool: boolean) => void, event: Event, selectedTicket: TicketTypes }) {
    const handleCheckout = async () => {
        // console.log()
    }
    return (
        <>
            {
                selectedTicket && (

                    <Modal open={open} onClose={() => setOpen(false)}>
                        <Box>
                            <div className="bg-white text-black fixed inset-0 z-50 overflow-y-auto xl:w-1/3 ">

                                {/* Close Button */}
                                <button
                                    onClick={() => setOpen(false)}
                                    className="absolute top-3 right-3 p-2"
                                >
                                    <CloseIcon fontSize="large" />
                                </button>

                                {/* Event Image */}
                                <div className="w-full h-48 overflow-hidden">
                                    <img
                                        src={event.image_url}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Event Info */}
                                <div className="p-4">
                                    <h1 className="text-xl font-semibold">{event.title}</h1>
                                    <p className="text-sm text-gray-600 mt-1">{event.date}</p>
                                    <p className="text-sm text-gray-600">{event.location}</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Hosted by {event.organizers.users.name}
                                    </p>
                                </div>

                                {/* Contact Information */}
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold mb-3">Contact Information</h2>

                                    <div className="flex flex-col space-y-3">

                                        <div>
                                            <label className="text-sm font-medium">Full Name</label>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                                                placeholder="Your name"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium">Email</label>
                                            <input
                                                type="email"
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                                                placeholder="your@email.com"
                                            />
                                        </div>

                                    </div>
                                </div>

                                {/* Ticket Summary */}
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold mb-3">Your Ticket</h2>

                                    <div
                                        key={selectedTicket.ticket_type_id}
                                        className="border border-gray-200 p-3 rounded-lg mb-3"
                                    >
                                        <p className="font-medium">{selectedTicket.name}</p>
                                        <p className="text-sm mt-1 text-gray-500">{selectedTicket.description}</p>
                                        <p className="text-sm mt-2 font-semibold">
                                            {selectedTicket.price.toString() === '0' ? "Free" : `£${selectedTicket.price}`}
                                        </p>
                                    </div>
                                </div>

                                {/* Checkout Button (Sticky Bottom) */}
                                <div className="fixed bottom-0 left-0 w-full xl:w-1/3 bg-white border-t border-gray-200 p-4 active:scale-[0.98]">
                                    <button
                                        onClick={() => handleCheckout()}
                                        className="w-full bg-black text-white py-3 rounded-lg font-semibold"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>

                            </div>
                        </Box>
                    </Modal>
                )
            }
        </>


    )
}

export default CheckoutModal