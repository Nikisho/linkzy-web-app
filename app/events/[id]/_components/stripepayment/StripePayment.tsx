'use client'
import { Box, Modal } from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { User } from '../../_types/User';
import { TicketTypes } from '../../_types/TicketTypes';
import { Event } from '@/app/_types/Event';
import CheckoutForm from './CheckoutForm';
import supabase from '@/supabase';
import { emailUserUponPurchase } from '@/app/_utils/emailUserUponPurchase';

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

    const handleStripeCheckout = async (): Promise<void> => {

        setLoading(true);
        setClientSecret(null);

        try {
            if (!user?.email || !user?.name) {
                throw new Error('User information is incomplete');
            }

            if (!selectedTicket?.ticket_type_id || !selectedTicket?.price) {
                throw new Error('Ticket information is incomplete');
            }

            if (!event?.organizer_id) {
                throw new Error('Event information is incomplete');
            }

            if ( selectedTicket.price <= 0) {
                throw new Error('Invalid ticket price');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(user.email)) {
                throw new Error('Invalid email format');
            }

            console.log('Initiating Stripe checkout process...');

            const { data, error, response } = await supabase.functions.invoke(
                'guest_paid_ticket_claim',
                {
                    body: {
                        user: {
                            name: user.name.trim(),
                            email: user.email.toLowerCase().trim(),
                        },
                        selected_ticket: {
                            featured_event_id: selectedTicket.featured_event_id,
                            tickets_sold: selectedTicket.tickets_sold,
                            ticket_type_id: selectedTicket.ticket_type_id,
                            price: Number(selectedTicket.price)
                        },
                        event: {
                            date: event.date,
                            organizer_id: event.organizer_id,
                            chat_room_id: event.chat_room_id,
                        },
                    },
                }
            );

            if (error) {
                console.error('Supabase function error:', error);
                const status = response?.status
                console.log('Error code is  ', response?.status)
                if (status === 409) {
                    alert("You already have a booking for this event.");
                    return;
                }

                // alert("Something went wrong. Please try again.");
                return;
                // throw new Error(`Payment setup failed: ${error.message}`);

            }

            // Validate response data structure
            if (!data) {
                throw new Error('No data received from payment service');
            }

            if (!data.client_secret || typeof data.client_secret !== 'string') {
                console.error('Invalid response data:', data);
                throw new Error('Invalid response from payment service');
            }

            console.log('Payment intent created successfully', data.client_secret);

            // Set the client secret for Stripe Elements
            setClientSecret(data.client_secret);

            // Send confirmation email if user_id is provided
            if (data.user_id) {
                try {
                    await emailUserUponPurchase(data.user_id, event, user);
                    console.log('Confirmation email sent successfully');
                } catch (emailError) {
                    // Don't throw error for email failures - payment was still successful
                    console.warn('Failed to send confirmation email:', emailError);
                    // You might want to show a non-blocking warning to the user
                }
            } else {
                console.warn('No user_id received for sending confirmation email');
            }

        } catch (error) {
            console.error('Stripe checkout failed:', error);

            const errorMessage = error instanceof Error
                ? error.message
                : 'An unexpected error occurred during payment setup';

            // Show error to user (you might want to use a toast or state for this)
            // setErrorState(errorMessage);

            // Optionally: trigger error reporting service
            // reportErrorToService(error);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!open) return;
        handleStripeCheckout();
    }, [open]);

    console.log('Secret received: ', clientSecret);

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
                                <Elements stripe={stripePromise} options={{ clientSecret: clientSecret }}>
                                    <CheckoutForm />
                                </Elements>
                            </div>
                        </div>
                    )
                }
            </Box>
        </Modal>
    )
}
