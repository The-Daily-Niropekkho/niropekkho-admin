"use client";

import { getSession } from "@/lib/session";
import { TSession } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

const SessionContext = createContext<{
    session: TSession | null;
    setSession: (session: TSession) => void;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
};

export const SessionProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [session, setSession] = useState<TSession | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchSession = async () => {
        const session = await getSession();
        setSession(session);
        setIsLoading(false);
    };
    
    useEffect(() => {
        fetchSession();
    }, [isLoading]);

    return (
        <SessionContext.Provider
            value={{ session, setSession, isLoading, setIsLoading }}
        >
            {children}
        </SessionContext.Provider>
    );
};
