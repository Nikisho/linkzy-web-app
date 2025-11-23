'use client'
import { Box, Modal } from '@mui/material';
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useMemo, useState } from 'react';
import supabase from "@/supabase";
import { User } from '../../_types/User';
import { TicketTypes } from '../../_types/TicketTypes';
import { Event } from '@/app/_types/Event';

export default function StripePayment({
    open,
    setOpen,
    user,
    selectedTicket,
    event
}: { open: boolean, setOpen: (bool: boolean) => void, user: User, selectedTicket: TicketTypes, event: Event }) {
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    console.log(selectedTicket)
    const handleStripeCheckout = async () => {
        setLoading(true);
        const forwardUrl = 'http://127.0.0.1:54321/functions/v1/guest_paid_ticket_claim';

        const response = await fetch(forwardUrl, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // user: { name: user.name, email: user.email },
                user: { name: 'Romain', email: 'phobereromain@gmail.com' },
                selected_ticket: {
                    featured_event_id: selectedTicket.featured_event_id,
                    tickets_sold: selectedTicket.tickets_sold,
                    ticket_type_id: selectedTicket.ticket_type_id,
                    price: selectedTicket.price
                },
                event: {
                    date: event.date,
                    organizer_id: event.organizer_id,
                    chat_room_id: event.chat_room_id,
                }
            })
        });

        const data = await response.json();
        console.log(data);
        setClientSecret(data.client_secret)
        setLoading(false);
    };

    useEffect(() => {
        if (!open) return;
        handleStripeCheckout();
    }, [open]);

    const options = clientSecret ? { clientSecret } : undefined;
    const handleSubmit = async (e:any) => {
        e.preventDefault();
        setLoading(true);

        const stripe = await stripePromise;

        const { error } = await stripe!.confirmPayment({
            // elements,
            clientSecret: clientSecret!,
            confirmParams: {
                return_url: `http://localhost:3000/${event.featured_event_id}/confirmation`,
            },
        });

        if (error) {
            console.error(error.message);
            setLoading(false);
            return;
        }
    };

    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box>
                {
                    clientSecret && !loading && (
                        <div
                            className={`fixed inset-0 xl:inset-auto xl:inset-y-0 z-50 bg-white text-black overflow-y-auto 
                            w-full xl:w-1/3 mx-auto p-4
                            ${loading ? 'opacity-30' : ''}`}
                        >
                            <div className="mt-10">
                                <Elements stripe={stripePromise} options={options}>
                                    <form className="flex flex-col gap-4">
                                        <PaymentElement />
                                        <button
                                            type="submit"
                                            onClick={handleSubmit}
                                            className="w-full py-3 rounded-md bg-black text-white font-semibold"
                                        >
                                            Submit
                                        </button>
                                    </form>
                                </Elements>
                            </div>

                        </div>

                    )
                }
            </Box>
        </Modal>
    )
}
