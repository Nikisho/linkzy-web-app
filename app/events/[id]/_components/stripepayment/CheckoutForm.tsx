'use client'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { id } = useParams();
    console.log('Page found :', id)
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}/events/${id}/confirmation`,
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`.
        if (error) {
            setErrorMessage(error.message || 'An unexpected error occurred.');
            console.log('Payment error:', error);
        }

        setIsLoading(false);
    };

    // Show loading state while Stripe loads
    if (!stripe || !elements) {
        return (
            <div className="flex justify-center items-center p-8">
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