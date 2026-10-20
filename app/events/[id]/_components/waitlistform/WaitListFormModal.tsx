import React, { useState } from 'react'
import { User } from '../../_types/User';
import { Event } from "@/app/_types/Event";
import { TicketTypes } from '../../_types/TicketTypes';
import { Box, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import supabase from '@/supabase';
import formatDateShortWeekday from '@/app/_utils/formatDateShortWeekday';

function WaitListFormModal({
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
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState("");
    const [errors, setErrors] = useState({ name: "", email: "", confirmEmail: "" });
    const validateEmail = (value: string) => {
        if (!value.trim()) return "Email is required";
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(value)) return "Invalid email format";
        return "";
    };


    const handleClose = () => {
        setOpen(false);
        setUser({ name: '', email: '', confirmEmail: '' });
        setErrors({ name: "", email: "", confirmEmail: "" });
        setServerError("");
        setSuccess(false);
    };
    const validateName = (value: string) => {
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(value.trim()))
            return "Invalid name format";
        return "";
    };
    const handleJoinWaitlist = async () => {


        setServerError("");
        setSuccess(false);

        const name = user.name.trim();
        const email = user.email.trim();

        const nameError = name ? "" : "Name is required";
        const emailError = validateEmail(email);

        if (nameError || emailError) return;

        setLoading(true);

        try {
            //check if the user has already joined the waitlist for this ticket type
            const { data: existingEntry, error: fetchError } = await supabase
                .from("event_waitlist")
                .select("*")
                .eq("featured_event_id", selectedTicket.featured_event_id)
                .eq("ticket_type_id", selectedTicket.ticket_type_id)
                .eq("email", user.email.trim())
                .single();
            if (existingEntry) {
                setServerError("You have already joined the waitlist for this ticket.");
                return;
            }
            if (fetchError && fetchError.code !== "PGRST116") {
                console.error("Error checking waitlist:", fetchError);
                setServerError(
                    "An error occurred while checking the waitlist. Please try again."
                );
                return;
            }
            const { error } = await supabase
                .from("event_waitlist")
                .insert({
                    featured_event_id: selectedTicket.featured_event_id,
                    ticket_type_id: selectedTicket.ticket_type_id,
                    name,
                    email,
                });

            if (error) {
                console.error("Waitlist error:", error);

                setServerError(
                    "An error occurred while joining the waitlist. Please try again."
                );
                return;
            }

            setSuccess(true);
        } catch (error) {
            console.error("Waitlist error:", error);

            setServerError(
                "An error occurred while joining the waitlist. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            {selectedTicket && (
                <Modal open={open} onClose={() => setOpen(false)}>
                    <Box>
                        {loading && (
                            <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/70">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
                            </div>
                        )}

                        <div className="bg-white text-black fixed inset-0 z-50 xl:w-1/3 flex flex-col">

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto pb-24">

                                {/* Close */}
                                <button
                                    onClick={() => handleClose()}
                                    className="absolute top-3 right-3 z-10 p-2"
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
                                    <h1 className="text-xl font-semibold">
                                        {event.title}
                                    </h1>

                                    <p className="text-sm text-gray-600 mt-1">
                                        {formatDateShortWeekday(event.date)}
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        {event.location}
                                    </p>
                                </div>

                                {/* Waitlist Message */}
                                <div className="px-4">
                                    <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                                        <p className="text-sm text-gray-700">
                                            This ticket is currently sold out.
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Join the waitlist and we'll email you if a ticket
                                            becomes available.
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold mb-3">
                                        Join the waitlist
                                    </h2>

                                    {/* Name */}
                                    <div className="mb-4">
                                        <label className="text-sm font-medium">
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            className={`w-full border rounded-md px-3 py-2 mt-1 ${errors.name
                                                ? "border-red-500"
                                                : "border-gray-300"
                                                }`}
                                            placeholder="Your name"
                                            value={user.name}
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                setUser((prev) => ({
                                                    ...prev,
                                                    name: value,
                                                }));

                                                setErrors((prev) => ({
                                                    ...prev,
                                                    name: validateName(value),
                                                }));
                                            }}
                                            onBlur={(e) =>
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    name: validateName(e.target.value),
                                                }))
                                            }
                                        />

                                        {errors.name && (
                                            <p className="text-red-600 text-xs mt-1">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="text-sm font-medium">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            className={`w-full border rounded-md px-3 py-2 mt-1 ${errors.email
                                                ? "border-red-500"
                                                : "border-gray-300"
                                                }`}
                                            placeholder="your@email.com"
                                            value={user.email}
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                setUser((prev) => ({
                                                    ...prev,
                                                    email: value,
                                                }));

                                                setErrors((prev) => ({
                                                    ...prev,
                                                    email: validateEmail(value),
                                                }));
                                            }}
                                            onBlur={(e) =>
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    email: validateEmail(e.target.value),
                                                }))
                                            }
                                        />

                                        {errors.email && (
                                            <p className="text-red-600 text-xs mt-1">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Ticket */}
                                <div className="px-4">
                                    <h2 className="text-lg font-semibold mb-2">
                                        Ticket
                                    </h2>

                                    <div className="border border-gray-200 p-3 rounded-lg">
                                        <p className="font-medium">
                                            {selectedTicket.name}
                                        </p>

                                        {selectedTicket.description && (
                                            <p className="text-sm mt-1 text-gray-500">
                                                {selectedTicket.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Messages */}
                                {success && (
                                    <div className="mx-4 mt-4 bg-green-100 text-green-800 p-3 rounded-md text-sm">
                                        You have been added to the waitlist.
                                    </div>
                                )}

                                {serverError && (
                                    <div className="mx-4 mt-4 bg-red-100 text-red-800 p-3 rounded-md text-sm">
                                        {serverError}
                                    </div>
                                )}
                            </div>

                            {/* Sticky Button */}
                            <div className="sticky bottom-0 w-full bg-white border-t border-gray-200 p-4">
                                <button
                                    onClick={handleJoinWaitlist}
                                    disabled={loading}
                                    className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                                >
                                    {loading ? "Joining..." : "Join Waitlist"}
                                </button>
                            </div>
                        </div>
                    </Box>
                </Modal>
            )}
        </div>
    )
}

export default WaitListFormModal