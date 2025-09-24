/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import "./globals.css";
import ClientLayout from "./clientlayout";

export const metadata = {
  title: "File Upload Project",
  description: "Upload files with company type",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="bg-gray-100">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
