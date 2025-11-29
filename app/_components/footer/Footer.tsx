
function Footer() {

const footerItems = [
    { text: 'Privacy Policy', href: '/privacypolicy.html' },
    { text: 'Terms of Services', href: '/termsofservices.html' },
];


    return (
        <div className="xl:flex xl:justify-center">
            <footer
                style={{ borderTop: '0.5px solid' }}
                className="p-4 my-6 flex flex-col gap-3 xl:flex-row xl:justify-between xl:items-center border-gray-600 xl:w-4/5 2xl:w-2/3 text-sm text-gray-600"
            >
                <div className="text-center xl:text-left font-medium">
                    Linkzy
                </div>

                <div className="flex justify-center gap-6">
                    {footerItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="hover:text-black transition"
                        >
                            {item.text}
                        </a>
                    ))}
                </div>
            </footer>
        </div>
    );
}


export default Footer