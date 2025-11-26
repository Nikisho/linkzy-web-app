'use client'
import { Event } from '@/app/_types/Event';
import { emailUserUponPurchase } from '@/app/_utils/emailUserUponPurchase';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { User } from '../../_types/User';

interface CheckoutFormType {
    user_id: number;
};

const CheckoutForm = ({
    user_id
}: CheckoutFormType) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { id } = useParams();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/events/${id}/confirmation?userid=${user_id}`,
            },
        });

        if (error) {
            setErrorMessage(error.message || 'An unexpected error occurred.');
            console.log('Payment error:', error);
        } 
        setIsLoading(false);
    };

    if (!stripe || !elements) {
        return (
            <div className="flex justify-center text-black items-center p-8">
                <div>Loading payment form...</div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <PaymentElement />

            {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
            )}

            <button
                type="submit"
                disabled={!stripe || isLoading}
                className="w-full py-3 rounded-md bg-black text-white font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
};

export default CheckoutForm;