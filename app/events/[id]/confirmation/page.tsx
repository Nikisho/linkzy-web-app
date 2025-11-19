export default function ConfirmationPage() {
    return (
        <div className="flex justify-center">

            <div className="p-6 xl:w-1/3">
                <h1 className="text-2xl font-semibold">Booking Confirmed</h1>

                <p className="mt-2 text-gray-600">
                    Your ticket is booked. A confirmation email has been sent.
                </p>

                <div className="mt-6">
                    <a
                        href="/"
                        className="block w-full text-center bg-black text-white py-3 rounded-md"
                    >
                        Return Home
                    </a>
                </div>
            </div>

        </div>
    );
}
