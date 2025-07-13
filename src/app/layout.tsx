// RootLayout.tsx

import "./globals.css";

export const metadata = {
  title: "PCB Perfect",
  description: "Detect defects in PCB images using Deep Learning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-poppins">
        {children}
      </body>
    </html>
  );
}
