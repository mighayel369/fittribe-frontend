
import { ShieldAlert, AlertTriangle, Ghost, Ban } from 'lucide-react';

export interface ErrorContentConfig {
    title: string;
    message: string;
    badgeText: string;
    badgeColor: string;
    IconComponent: any;
}

export const getErrorConfig = (status: number, serverMessage?: string): ErrorContentConfig => {
    const maps: Record<number, Omit<ErrorContentConfig, 'message'>> = {
        400: {
            title: "Bad Request",
            badgeText: "Invalid Request",
            badgeColor: "bg-amber-500",
            IconComponent: AlertTriangle,
        },
        401: {
            title: "Session Expired",
            badgeText: "Unauthorized",
            badgeColor: "bg-red-500",
            IconComponent: Ban,
        },
        403: {
            title: "Access Forbidden",
            badgeText: "Protected Area",
            badgeColor: "bg-red-600",
            IconComponent: ShieldAlert,
        },
        404: {
            title: "Lost in the Tribe?",
            badgeText: "Page Not Found",
            badgeColor: "bg-blue-600",
            IconComponent: Ghost,
        },
        500: {
            title: "Internal Server Fault",
            badgeText: "Server Error",
            badgeColor: "bg-purple-600",
            IconComponent: AlertTriangle,
        },
    };

    const fallbackText: Record<number, string> = {
        400: "The server couldn't understand the request. Please check your inputs.",
        401: "Your session has ended. Please log in again to continue your workout streak.",
        403: "Lock room restricted! You don't have permission to access this resource.",
        404: "The page you're looking for doesn't exist or has been moved.",
        500: "Our servers hit a roadblock. Our engineering tribe has been alerted.",
    };

    const target = maps[status] || {
        title: "Unexpected Error Occurred",
        badgeText: "Error",
        badgeColor: "bg-gray-600",
        IconComponent: Ghost,
    };

    return {
        ...target,
        message: serverMessage || fallbackText[status] || "Something went wrong. Please try reloading the app.",
    };
};