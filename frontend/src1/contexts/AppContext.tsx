import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";

type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
}
// Define the type for your AppContext
type AppContext = {
    // ToastContext
    showToast: (toastMessage: ToastMessage) => void;
    // isLoginContext
    isLogin: boolean;
}
//Create the AppContext with an initial value
const AppContext = React.createContext<AppContext | undefined>(undefined);
// Create a component that will provide the AppContext value
export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
    const { isError } = useQuery("validateToken", apiClient.validateToken, {
        retry: false,
    });
    return (
        <AppContext.Provider
            value={{
                showToast: (toastMessage) => {
                    setToast(toastMessage)
                },
                isLogin: !isError,
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