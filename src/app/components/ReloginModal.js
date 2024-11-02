"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export function ReloginModal({ onClose }) {
    const router = useRouter();

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-semibold mb-4">Session Expired</h2>
                <p className="mb-4">Your session has expired. Please log in again.</p>
                <button
                    onClick={() => {
                        router.push("/pages/login");
                        onClose();
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
}
