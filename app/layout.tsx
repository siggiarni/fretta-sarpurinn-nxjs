import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frétta sarpurinn",
  description: "Nýjustu fréttir frá íslenskum fréttamiðlum",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📰</text></svg>",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="is">
      <body>{children}</body>
    </html>
  );
}
