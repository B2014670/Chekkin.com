import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { loadStripe, Stripe } from "@stripe/stripe-js";

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "";

type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
}
// Define the type for your AppContext
type AppContext = {
    // ToastContext
    showToast: (toastMessage: ToastMessage) => void;
    isLogin: boolean;
    role: string | null;
    stripePromise: Promise<Stripe | null>;

}
//Create the AppContext with an initial value
const AppContext = React.createContext<AppContext | undefined>(undefined);

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY as string);
// Create a component that will provide the AppContext value
export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
    const { data, isError } = useQuery("validateToken", apiClient.validateToken, {
        retry: false,
    });
    const role = data?.role?? null;
    return (
        <AppContext.Provider
            value={{
                showToast: (toastMessage) => {
                    setToast(toastMessage)
                },
                isLogin: !isError,
                role: role,
                stripePromise
            }}
        >
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(undefined)}
                />
            )}
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    return context as AppContext;
}