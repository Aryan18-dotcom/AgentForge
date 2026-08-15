import { createBrowserRouter, Outlet } from "react-router-dom";
import LandingPage from "./Basic-Pages/LandingPage";
import { NavigationProvider } from "./hooks/NavigationProvider";
import Login from "./features/auth/pages/Login";
import ResetPassword from "./features/auth/pages/ResetPassword";
import Register from "./features/auth/pages/Register";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import Dashboard from "./features/dashboard/pages/Dashboard";
import DashboardContainer from "./components/dashboard-components/DashboardContainer";
import BuildAgent from "./features/BuildAgent/pages/BuildAgent";
import MyCreations from "./features/MyCreations/pages/MyCreations";
import Settings from "./features/Settings/pages/Settings";
import AgentPreview from "./features/BuildAgent/pages/Agent/AgentPreview";
import EmbedChat from "./features/EmbedChat/EmbedChat";
import { PaymentProvider } from "./features/SubscriptionModel/PaymentContext";
import SubscriptionModelPage from "./features/SubscriptionModel/pages/SubscriptionModelPage";
import ProfilePage from "./features/Profile/pages/ProfilePage";
import { ProfileProvider } from "./features/Profile/profileContext";

export const router = createBrowserRouter([
    {
        path: '/',
        element: (<NavigationProvider>
            <Outlet />
        </NavigationProvider>),
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/reset-password',
                element: <ResetPassword />
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path: "/",
                element: <LandingPage />
            },
            {
                path: "/",
                element: <ProtectedRoute><DashboardContainer><Outlet /></DashboardContainer></ProtectedRoute>,
                children: [
                    {
                        path: "build-agent",
                        element: <BuildAgent />
                    },
                    {
                        path: "dashboard",
                        element: <Dashboard />
                    },
                    {
                        path: "my-creations",
                        element: <MyCreations />
                    },
                    {
                        path: "my-creations/:agentId",
                        element: <AgentPreview />
                    },
                    {
                        path: "settings",
                        element: <Settings />
                    },
                    {
                        path: "subscription",
                        element: <PaymentProvider><SubscriptionModelPage /></PaymentProvider>
                    },
                    {
                        path: "profile",
                        element: <ProfileProvider><ProfilePage /></ProfileProvider>
                    }
                ]
            }
        ],
    },
    {
        path: '/embed/chat/:agentId',
        element: <EmbedChat />
    }
]);