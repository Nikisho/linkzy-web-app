'use client'
import { Box, Modal } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { TicketTypes } from '../../_types/TicketTypes';

function TicketsModal({
    open,
    setOpen,
    ticket_types
}: { open: boolean, setOpen: (bool: boolean) => void, ticket_types: TicketTypes[] }) {

    return (
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
                        {ticket_types?.map((type) => {
                            const soldOut = type.quantity === 0;
                            return (
                                <div
                                    key={type.ticket_type_id}
                                    className="bg-gray-100 rounded-xl p-4 flex flex-col shadow-sm border border-gray-200"
                                >
                                    {/* Name + Price */}
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-semibold text-lg">{type.name}</p>

                                        {
                                            type.price.toString() === '0' ?
                                                <p className=" font-bold">

                                                    Free
                                                </p> :
                                                <p className=" font-bold">
                                                    £{Number(type.price).toFixed(2)}
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
                                        disabled={soldOut}
                                        className={`w-full py-2 rounded-lg font-semibold ${soldOut
                                            ? "bg-gray-300 text-gray-600"
                                            : "bg-black text-white active:scale-[0.98] transition duration-300"
                                            }`}
                                    >
                                        {soldOut ? "Sold Out" : "Select"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Box>
        </Modal>
    )
}

export default TicketsModal