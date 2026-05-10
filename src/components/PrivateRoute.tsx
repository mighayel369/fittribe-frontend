
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { useSessionManager } from "../hooks/useSessionManager";
import type { JSX } from "react";
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { accessToken, user } = useAppSelector((state: any) => state.auth);
    const { verify } = useSessionManager();

    useEffect(() => {
        if (accessToken) {
            verify();
        }
    }, [accessToken]);

    if (!accessToken) {
        return <Navigate to='/login' replace />;
    }

    if (!user) {
        return <Navigate to='/login' replace />;
    }

    return children;
};

export default PrivateRoute;