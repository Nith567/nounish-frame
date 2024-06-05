'use client'
import { init, AirstackProvider } from "@airstack/airstack-react";

export default function Providers({children}: {children: JSX.Element}) {
    const apiKey = process.env.NEXT_PUBLIC_AIRSTACK_API_KEY || " "
    return ( 
        <AirstackProvider apiKey={apiKey}>
            {children}
        </AirstackProvider>
    );
}