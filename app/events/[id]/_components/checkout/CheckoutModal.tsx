'use client'
import { Box, Modal } from "@mui/material"
import { TicketTypes } from "../../_types/TicketTypes"
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { Event } from "@/app/_types/Event";
import formatDateShortWeekday from "@/app/_utils/formatDateShortWeekday";
import supabase from "@/supabase";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import StripePayment from "../stripepayment/StripePayment";
import { User } from "../../_types/User";


function CheckoutModal({
    open,
    setOpen,
    event,
    selectedTicket
}: { open: boolean, setOpen: (bool: boolean) => void, event: Event, selectedTicket: TicketTypes }) {
    const [user, setUser] = useState<User>({
        name: '',
        email: '',
        confirmEmail: ""

    });
    const [errors, setErrors] = useState({ name: "", email: "", confirmEmail: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState("");
    const { push } = useRouter();
    const [openStripeModal, setOpenStripeModal] = useState(false);
    const validateName = (value: string) => {
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(value.trim()))
            return "Invalid name format";
        return "";
    };

    const validateEmail = (value: string) => {
        if (!value.trim()) return "Email is required";
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(value)) return "Invalid email format";
        return "";
    };

    const validateConfirmEmail = (email: string, confirm: string) => {
        if (!confirm.trim()) return "Please confirm your email";
        if (email !== confirm) return "Emails do not match";
        return "";
    };

    async function generateQRCodeBase64(value: string) {
        return await QRCode.toDataURL(value, { width: 500 });
    }
    const emailUserUponPurchase = async (user_id: number) => {

        try {
            const edge_function_base_url = 'https://wffeinvprpdyobervinr.supabase.co/functions/v1/ticket-purchase-email'
            const qrValue = `com.linkzy://event/${event.featured_event_id}/user/${user_id}`;
            const base64Qr = await generateQRCodeBase64(qrValue);

            const {
                data: { session },
            } = await supabase.auth.getSession();

            const accessToken = session?.access_token;
            const response = await fetch(edge_function_base_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    name: user.name,
                    email: user.email,
                    title: event.title,
                    location: event.location,
                    date: event.date && event.time && (formatDateShortWeekday(event.date) + ', ' + (event.time).slice(0, -3)),
                    qrValue: base64Qr.split(",")[1]
                }),
            });

            const data = await response.json();
            console.log("✅ Function response:", data);
        } catch (error: any) {
            console.error('Error booking event:', error.message);

        }
    }
    const openStripePaymentModal = async () => {
        setOpenStripeModal(true);
    };


    const handleFreeCheckout = async () => {

        setServerError("");
        setSuccess(false);

        const nameErr = validateName(user.name);
        const emailErr = validateEmail(user.email);
        const confirmErr = validateConfirmEmail(user.email, user.confirmEmail);

        if (nameErr || emailErr || confirmErr) {
            setErrors({ name: nameErr, email: emailErr, confirmEmail: confirmErr });
            return;
        }

        try {
            setLoading(true);
            if (selectedTicket.price.toString() === '0') {

                const { data: user_id, error, response } = await supabase.functions.invoke(
                    'guest_free_ticket_claim',
                    {
                        body: {
                            user: { name: user.name, email: user.email },
                            selected_ticket: {
                                featured_event_id: selectedTicket.featured_event_id,
                                tickets_sold: selectedTicket.tickets_sold,
                                ticket_type_id: selectedTicket.ticket_type_id
                            },
                            event: {
                                date: event.date,
                                time: event.time,
                                title: event.title,
                                organizer_id: event.organizer_id,
                                location: event.location,
                                chat_room_id: event.chat_room_id
                            }
                        }
                    }
                );

                if (error) {
                    const status = response?.status
                    // console.log('Error code is  ', response?.status)
                    if (status === 409) {
                        setServerError("You already have a booking for this event.");
                        return;
                    }

                    setServerError("Something went wrong. Please try again.");
                    return;
                }

                if (user_id) {
                    emailUserUponPurchase(user_id);
                    push(`/events/${event.featured_event_id}/confirmation`);
                    return;
                }
                setSuccess(true);
                if (success) {
                    push(`/events/${event.featured_event_id}/confirmation`);
                    return;
                }
            } else {
                console.log('no');
                console.log(selectedTicket)
            }

        } catch (e) {
            setServerError("Server error. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {
                selectedTicket && (

                    <Modal open={open} onClose={() => setOpen(false)}>
                        <Box>
                            <div className={`bg-white mb-20 text-black fixed inset-0 z-50 overflow-y-auto xl:w-1/3 {${loading && 'opacity-30'}}`}>

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
                                <div className="xl:hidden">
                                    {
                                        success && (
                                            <div className="bg-green-100 text-green-800 p-3 rounded-md text-sm">
                                                Booking successful. A confirmation email has been sent.
                                            </div>
                                        )
                                    }
                                    {
                                        serverError && (
                                            <div className="bg-red-100  text-red-800 p-3 rounded-md  text-sm">
                                                {serverError}
                                            </div>
                                        )
                                    }
                                </div>
                                {/* Event Info */}
                                <div className="p-4">
                                    <h1 className="text-xl font-semibold">{event.title}</h1>
                                    <p className="text-sm text-gray-600 mt-1">{formatDateShortWeekday(event.date)}</p>
                                    <p className="text-sm text-gray-600">{event.location}</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Hosted by {event.organizers.users.name}
                                    </p>
                                </div>

                                {/* Contact Information */}
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold mb-3">Contact Information</h2>

                                    <div>
                                        <label className="text-sm font-medium">Full Name</label>
                                        <input
                                            type="text"
                                            className={`w-full border rounded-md px-3 py-2 mt-1 ${errors.name ? "border-red-500" : "border-gray-300"
                                                }`}
                                            placeholder="Your name"
                                            value={user.name}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setUser(prev => ({ ...prev, name: value }));
                                                setErrors(prev => ({ ...prev, name: validateName(value) }));
                                            }}
                                            onBlur={(e) =>
                                                setErrors(prev => ({ ...prev, name: validateName(e.target.value) }))
                                            }
                                        />
                                        {errors.name && (
                                            <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <input
                                            type="email"
                                            className={`w-full border rounded-md px-3 py-2 mt-1 ${errors.email ? "border-red-500" : "border-gray-300"
                                                }`}
                                            placeholder="your@email.com"
                                            value={user.email}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setUser(prev => ({ ...prev, email: value }));
                                                setErrors(prev => ({ ...prev, email: validateEmail(value) }));
                                            }}
                                            onBlur={(e) =>
                                                setErrors(prev => ({ ...prev, email: validateEmail(e.target.value) }))
                                            }
                                        />
                                        {errors.email && (
                                            <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Confirm Email</label>
                                        <input
                                            type="email"
                                            className={`w-full border rounded-md px-3 py-2 mt-1 ${errors.confirmEmail ? "border-red-500" : "border-gray-300"
                                                }`}
                                            placeholder="Re-enter your email"
                                            value={user.confirmEmail}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setUser(prev => ({ ...prev, confirmEmail: value }));
                                                setErrors(prev => ({
                                                    ...prev,
                                                    confirmEmail: validateConfirmEmail(user.email, value),
                                                }));
                                            }}
                                            onBlur={(e) =>
                                                setErrors(prev => ({
                                                    ...prev,
                                                    confirmEmail: validateConfirmEmail(user.email, e.target.value),
                                                }))
                                            }
                                        />
                                        {errors.confirmEmail && (
                                            <p className="text-red-600 text-xs mt-1">{errors.confirmEmail}</p>
                                        )}
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
                                {
                                    loading && (
                                        <div className="flex justify-center py-4">
                                            <div className="h-6 w-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                                        </div>
                                    )
                                }
                                {
                                    success && (
                                        <div className="hidden xl:flex bg-green-100 text-green-800 p-3 rounded-md my-3 text-sm">
                                            Booking successful. A confirmation email has been sent.
                                        </div>
                                    )
                                }
                                {
                                    serverError && (
                                        <div className="hidden xl:flex bg-red-100  text-red-800 p-3 rounded-md my-3 text-sm">
                                            {serverError}
                                        </div>
                                    )
                                }

                                {/* Checkout Button (Sticky Bottom) */}
                                <div className="fixed bottom-0 left-0 w-full xl:w-1/3 bg-white border-t border-gray-200 p-4 active:scale-[0.98]">
                                    <button
                                        onClick={() => {selectedTicket.price.toString() === '0' ? handleFreeCheckout() : openStripePaymentModal() }}
                                        className="w-full bg-black text-white py-3 rounded-lg font-semibold"
                                    >
                                        {
                                            selectedTicket.price.toString() === '0' ? "Register" : 'Continue to Payment'
                                        }
                                    </button>
                                </div>
                            </div>
                        </Box>
                    </Modal>
                )
            }
            <StripePayment 
                open={openStripeModal}
                setOpen={setOpenStripeModal}
                user={user}
                selectedTicket={selectedTicket}
                event={event}
            />
        </>


    )
}

export default CheckoutModal