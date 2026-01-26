import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { TelegramProvider, useTelegramContext } from "@/components/telegram/TelegramProvider";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import AppShell from "@/layout/AppShell";
import { AuthProvider } from "@/components/auth/AuthProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Marketplace from "./pages/Marketplace";
import ChannelDetails from "./pages/ChannelDetails";
import CreateDeal from "./pages/CreateDeal";
import Deals from "./pages/Deals";
import Channels from "./pages/Channels";
import ChannelDetailsManage from "./pages/ChannelDetailsManage";
import CreateListing from "./pages/CreateListing";
import ListingPreview from "./pages/ListingPreview";
import ListingSuccess from "./pages/ListingSuccess";
import EditListing from "./pages/EditListing";
import Profile from "./pages/Profile";
import AddChannel from "./pages/AddChannel";
import AddChannelStep1 from "./pages/AddChannelStep1";
import AddChannelStep2 from "./pages/AddChannelStep2";
import AddChannelStep3 from "./pages/AddChannelStep3";
import DealDetails from "./pages/DealDetails";
import EscrowPayment from "./pages/EscrowPayment";
import FundsLocked from "./pages/FundsLocked";
import NotFound from "./pages/NotFound";
import Splash from "./pages/Splash";
import { getTelegramWebApp } from "./lib/telegram";
import { AUTH_EXPIRED_EVENT } from "@/lib/api/auth";
import { toast } from "sonner";

const queryClient = new QueryClient();

const NavigationHaptics = () => {
  const location = useLocation();
  const { webAppDetected } = useTelegramContext();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!webAppDetected) {
      lastPathRef.current = location.pathname;
      return;
    }

    if (lastPathRef.current && lastPathRef.current !== location.pathname) {
      const webApp = getTelegramWebApp();
      webApp?.HapticFeedback?.impactOccurred?.("light");
    }

    lastPathRef.current = location.pathname;
  }, [location.pathname, webAppDetected]);

  return null;
};

const App = () => {
  const manifestUrl = `${window.location.origin}/tonconnect-manifest.json`;

  useEffect(() => {
    const handleAuthExpired = () => {
      toast.error("Session expired. Please sign in again.");
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        <TelegramProvider>
          <AuthProvider>
            <LanguageProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <NavigationHaptics />
                  <Routes>
                    <Route path="/splash" element={<Splash />} />
                    <Route
                      element={
                        <ProtectedRoute>
                          <AppShell />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="/" element={<Navigate to="/splash" replace />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route
                        path="/marketplace/channels/:channelId"
                        element={<ChannelDetails />}
                      />
                      <Route
                        path="/marketplace/channels/:channelId/request"
                        element={<CreateDeal />}
                      />
                      <Route path="/deals" element={<Deals />} />
                      <Route path="/deals/:dealId" element={<DealDetails />} />
                      <Route path="/escrow/:dealId" element={<EscrowPayment />} />
                      <Route path="/funds-locked" element={<FundsLocked />} />
                      <Route path="/channels" element={<Channels />} />
                      <Route path="/channel-manage/:id" element={<ChannelDetailsManage />} />
                      <Route
                        path="/channel-manage/:id/listings/new"
                        element={<CreateListing />}
                      />
                      <Route
                        path="/channel-manage/:id/listings/preview"
                        element={<ListingPreview />}
                      />
                      <Route
                        path="/channel-manage/:id/listings/success"
                        element={<ListingSuccess />}
                      />
                      <Route
                        path="/channel-manage/:id/listings/:listingId/edit"
                        element={<EditListing />}
                      />
                      <Route path="/add-channel" element={<AddChannel />} />
                      <Route path="/add-channel-step1" element={<AddChannelStep1 />} />
                      <Route path="/add-channel-step2" element={<AddChannelStep2 />} />
                      <Route path="/add-channel-step3" element={<AddChannelStep3 />} />
                      <Route path="/profile" element={<Profile />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </LanguageProvider>
          </AuthProvider>
        </TelegramProvider>
      </TonConnectUIProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
