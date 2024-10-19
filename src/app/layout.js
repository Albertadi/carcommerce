import localFont from "next/font/local";
import { AuthProvider } from './pages/authorization/AuthContext';
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const rajdhaniBold = localFont({
  src: "./fonts/Rajdhani-Bold.ttf",
  variable: "--font-rajdhani-bold",
  weight: "700",
})
const rajdhaniLight = localFont({
  src: "./fonts/Rajdhani-Light.ttf",
  variable: "--font-rajdhani-light",
  weight: "300",
})
const rajdhaniMedium = localFont({
  src: "./fonts/Rajdhani-Medium.ttf",
  variable: "--font-rajdhani-medium",
  weight: "500",
})
const rajdhaniRegular = localFont({
  src: "./fonts/Rajdhani-Regular.ttf",
  variable: "--font-rajdhani-regular",
  weight: "400",
})
const rajdhaniSemiBold = localFont({
  src: "./fonts/Rajdhani-SemiBold.ttf",
  variable: "--font-rajdhani-semi-bold",
  weight: "600",
})

export const metadata = {
  title: "CarCommerce",
  description: "hi im description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${rajdhaniBold.variable} ${rajdhaniLight.variable} ${rajdhaniMedium.variable} ${rajdhaniRegular.variable} ${rajdhaniSemiBold.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
