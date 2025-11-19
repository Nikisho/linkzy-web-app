import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Download Linkzy",
  description: "Linkzy Web App",
};
export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return (
    <div>
        {children}
    </div>
  )
}
