import { Navigate } from 'react-router-dom';
import type {JSX} from "react";

interface Props {
    children: JSX.Element;
}

export const ProtectedRoute = ({ children }: Props) => {
    const token = localStorage.getItem('token');

    // Якщо токена нема — редирект на логін
    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
};
