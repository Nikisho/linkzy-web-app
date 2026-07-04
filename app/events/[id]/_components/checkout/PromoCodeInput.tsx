'use client'
import supabase from '@/supabase'
import { useEffect, useState } from 'react';

interface PromoCodesProps {
    featured_event_id: number;
    onApply?: (code: string) => void;
};

function PromoCodeInput({ featured_event_id, onApply }: PromoCodesProps) {
    const [promoCodes, setPromoCodes] = useState<any[]>([]);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [applied, setApplied] = useState<any>(null);

    const fetchPromoCodes = async () => {
        const { data, error } = await supabase
            .from("promo_codes")
            .select("*")
            .eq("featured_event_id", featured_event_id);

        if (error) {
            console.error(error.message);
            return;
        }

        setPromoCodes(data || []);
    };

    const handleApply = () => {
        const match = promoCodes.find(
            (p) =>
                p.code.toLowerCase() === code.toLowerCase()
        );

        if (!match) {
            setError("Invalid promo code");
            return;
        }

        if (match.quantity && (match.quantity <= match.redemption_count)) {
            setError("Promo code has been fully redeemed");
            return;
        }

        if (match.valid_until && new Date(match.valid_until) < new Date()) {
            setError("Expired code");
            return;
        }

        setError("");
        console.log("Applied:", match);
        setApplied(true);
        onApply && onApply(match); 

    };
    useEffect(() => {
        fetchPromoCodes();
    }, [featured_event_id]);

    return (
        <div className="border border-gray-200 rounded-lg p-3 mb-3">

            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                    Promo code
                </span>

                <button
                    onClick={handleApply}
                    className={`hover:cursor-pointer hover:scale-95 text-sm font-medium ${applied ? 'text-green-500' : 'text-black'}`}
                >
                    {applied ? 'Applied' : 'Apply'}
                </button>
            </div>

            <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
                className="w-full border border-gray-100 rounded-md px-3 py-2 text-sm outline-none"
            />

            {error && (
                <p className="text-red-500 text-xs mt-2">
                    {error}
                </p>
            )}
        </div>
    );
}

export default PromoCodeInput