import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Download Linkzy",
  description: "Linkzy Web App",
};
export default function DownloadLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="">
            {/* Optional: add a section-specific header */}
            {children}
        </div>
    );
}
