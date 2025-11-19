import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

export default async function ContactPage() {
    return (
        <div className="flex justify-center mx-5">
            <div className="flex flex-col xl:flex-row xl:w-2/3 xl:space-x-15 ">

                {/* Left side  */}
                <div className="xl:w-1/2 ">

                    <div className="h-1/">
                        <h1 className="text-4xl font-semibold my-4">
                            Contact Us
                        </h1>
                        <p>
                            Need help with the app, want to share feedback, or spotted something that isn’t working as expected? We’re here to support you. Whether you have questions about events, tickets, payments, or general app features, feel free to reach out. 
                            Every message helps us improve Linkzy and build a smoother, more enjoyable experience for everyone.
                        </p>
                    </div>

                    <div className=" my-10 flex flex-col transition duration-700 bg-radial-[at_25%_25%] from-cyan-800 to-zinc-900 to-75% rounded-xl p-5 hover:scale-[98%] space-y-10">

                        <div className='flex items-center space-x-5'>
                            <EmailIcon fontSize='large' />
                            <div>

                                <p className="text-2xl font-bold">Email</p>
                                <a href="mailto:support@linkzyapp.com"
                                    className="italic underline text-blue-400">support@linkzyapp.com</a>
                            </div>
                        </div>
                        <div className='flex items-center space-x-5'>
                            <PhoneIcon fontSize='large' />
                            <div>
                                <p className="text-2xl font-bold">Phone</p>
                                <p className="italic">(44)7463030833</p>
                            </div>
                        </div>


                    </div>
                    {/* Paragraphs */}
                    <div className='flex flex-col space-y-5 xl:space-y-0 xl:flex-row xl:space-x-9'>

                        <div className=" transition duration-700 bg-radial-[at_25%_25%] from-gray-800 to-zinc-900 to-75% rounded-xl p-5 hover:scale-[98%]">

                            <h2 className="text-lg font-semibold">
                                Customer Support
                            </h2>
                            <p>
                                Our support team is available around the clock to address
                                any concerns or queries you may have.
                            </p>
                        </div>

                        <div className=" transition duration-700 bg-radial-[at_25%_25%] from-gray-800 to-zinc-900 to-75% rounded-xl p-5 hover:scale-[98%]">

                            <h2 className="text-lg font-semibold">
                                Feedback and Suggestions
                            </h2>
                            <p>
                                We value your feedback and are continuously working to
                                improve Linkzy. Your input is critical and valuable.
                            </p>
                        </div>
                    </div>
                </div>



            </div>

        </div>
    );
}
