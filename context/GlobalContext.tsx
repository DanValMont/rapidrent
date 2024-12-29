"use client";
import { createContext, useContext, useState, Dispatch, SetStateAction } from "react";

interface GlobalContextType {
    unreadCount: number;
    setUnreadCount: Dispatch<SetStateAction<number>>;
}

//Create context
const GlobalContext = createContext({} as GlobalContextType);

//Create a provider
export function GlobalProvider({ children }: {children: React.ReactNode}) {
    const [unreadCount, setUnreadCount] = useState(0);

    return (
        <GlobalContext.Provider value={{ unreadCount, setUnreadCount }}>
            {children}
        </GlobalContext.Provider>
    );
}
 
//Create a custom hook to access context
export function useGlobalContext() {
    return useContext(GlobalContext);
}