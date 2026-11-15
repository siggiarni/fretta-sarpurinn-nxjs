import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frétta sarpurinn",
  description: "Nýjustu fréttir frá íslenskum fréttamiðlum",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="is">
      <body>{children}</body>
    </html>
  );
}
