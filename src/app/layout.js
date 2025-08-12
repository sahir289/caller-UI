/* eslint-disable react/prop-types */

import React from 'react';
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import './globals.css'

export const metadata = {
  title: 'File Upload Project',
  description: 'Upload files with company type',
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex flex-col flex-1">
            <Header />
            <main className="p-6 overflow-y-auto flex-1">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
