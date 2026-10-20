'use client'
import { Box, Modal } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { TicketTypes } from '../../_types/TicketTypes';
import { useState } from 'react';
import CheckoutModal from '../checkout/CheckoutModal';
import { Event } from '@/app/_types/Event';
import { getPricePlusPlatformFee } from '@/app/_utils/getPricePlusPlatformFee';
import formatDateShortWeekday from '@/app/_utils/formatDateShortWeekday';
import WaitListFormModal from '../waitlistform/WaitListFormModal';

function TicketsModal({
    open,
    setOpen,
    event
}: { open: boolean, setOpen: (bool: boolean) => void, event: Event }) {
    const [openCheckoutModal, setOpenCheckoutModal] = useState<boolean>(false);
    const [openWaitListModal, setOpenWaitListModal] = useState<boolean>(false);
    const [selectedTicketType, setSelectedTicketType] = useState<TicketTypes | null>(null);
    const handleSelect = (ticket: TicketTypes) => {
        setSelectedTicketType(ticket)
        setOpenCheckoutModal(!openCheckoutModal)
    };
    const handleWaitList = (ticket: TicketTypes) => {
        console.log('ticket', ticket)
        setSelectedTicketType(ticket)
        setOpenWaitListModal(!openWaitListModal)
    };


    return (
        <>
            <Modal
                open={open}
                onClose={() => setOpen(!open)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box >
                    <div className="bg-white text-black xl:w-1/3 fixed inset-0 z-50 overflow-y-auto">
                        {/* Close */}
                        <button
                            onClick={() => setOpen(!open)}
                            className=" flex justify-end w-full p-4"
                        >
                            <CloseIcon fontSize="large" />
                        </button>

                        <div className="space-y-4 p-4">
                            {event?.ticket_types?.slice().sort((a, b) => {
                                const now = new Date();

                                const getPriority = (ticket: any) => {
                                    const soldOut = ticket.quantity <= ticket.tickets_sold;
                                    const hasSalesEnded =
                                        new Date(ticket.sales_end).getTime() <= now.getTime();
                                    const salesNotStarted =
                                        new Date(ticket.sales_start).getTime() > now.getTime();

                                    if (!soldOut && !hasSalesEnded && !salesNotStarted) return 0; // Available
                                    if (salesNotStarted) return 1; // Coming soon
                                    if (hasSalesEnded) return 2; // Sales ended
                                    if (soldOut) return 3; // Sold out

                                    return 4;
                                };

                                return getPriority(a) - getPriority(b);
                            })
                                .map((type) => {
                                    const now = new Date();
                                    const soldOut = type.quantity <= type.tickets_sold;
                                    const hasSalesEnded = new Date(type.sales_end).getTime() <= now.getTime();
                                    const salesNotStarted = new Date(type.sales_start).getTime() > now.getTime();
                                    const salesStartDate = new Date(type.sales_start);
                                    const ticketPrice = getPricePlusPlatformFee(
                                        type.price,
                                        event.organizers.platform_fee_discount_pct
                                    );
                                    return (
                                        <div
                                            key={type.ticket_type_id}
                                            className="bg-gray-100 rounded-xl p-4 flex flex-col shadow-sm border border-gray-200"
                                        >
                                            {/* Name + Price */}
                                            <div className="flex justify-between types-center mb-2">
                                                <p className="font-semibold text-lg">{type.name}</p>

                                                {
                                                    type.price.toString() === '0' ?
                                                        <p className=" font-bold">

                                                            Free
                                                        </p> :
                                                        <p className=" font-bold">
                                                            £{ticketPrice?.toFixed(2)}
                                                        </p>
                                                }
                                            </div>

                                            {/* Description (optional) */}
                                            {type.description && (
                                                <p className="text-gray-700 text-sm mb-3">
                                                    {type.description}
                                                </p>
                                            )}

                                            {/* CTA */}
                                            <button
                                                disabled={hasSalesEnded || salesNotStarted}
                                                onClick={() => {
                                                    if (soldOut && !hasSalesEnded) {
                                                        handleWaitList(type);
                                                    } else if (!soldOut && !hasSalesEnded && !salesNotStarted) {
                                                        handleSelect(type);
                                                    }
                                                }}
                                                className={`w-full py-2.5 rounded-lg font-semibold transition duration-200 ${hasSalesEnded || salesNotStarted
                                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                        : "bg-black text-white active:scale-[0.98] hover:bg-gray-800"
                                                    }`}
                                            >
                                                {hasSalesEnded
                                                    ? "Sales ended"
                                                    : salesNotStarted
                                                        ? `Sales start on ${formatDateShortWeekday(salesStartDate)}`
                                                        : soldOut
                                                            ? "Sold out — Join the Waitlist"
                                                            : "Select"}
                                            </button>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </Box>
            </Modal>
            <CheckoutModal
                open={openCheckoutModal}
                setOpen={setOpenCheckoutModal}
                event={event}
                selectedTicket={selectedTicketType!}
            />

            <WaitListFormModal
                open={openWaitListModal}
                setOpen={setOpenWaitListModal}
                event={event}
                selectedTicket={selectedTicketType!}
            />
        </>
    )
}

export default TicketsModal