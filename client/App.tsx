import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { TelegramProvider, useTelegramContext } from "@/components/telegram/TelegramProvider";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import Layout from "./components/Layout";
import RequireAuth from "@/components/auth/RequireAuth";
import Marketplace from "./pages/Marketplace";
import ChannelDetails from "./pages/ChannelDetails";
import CreateDeal from "./pages/CreateDeal";
import Deals from "./pages/Deals";
import Channels from "./pages/Channels";
import ChannelDetailsManage from "./pages/ChannelDetailsManage";
import Profile from "./pages/Profile";
import AddChannel from "./pages/AddChannel";
import AddChannelStep1 from "./pages/AddChannelStep1";
import AddChannelStep2 from "./pages/AddChannelStep2";
import AddChannelStep3 from "./pages/AddChannelStep3";
import DealDetails from "./pages/DealDetails";
import EscrowPayment from "./pages/EscrowPayment";
import FundsLocked from "./pages/FundsLocked";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import { getTelegramWebApp } from "./lib/telegram";

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
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        <TelegramProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {showSplash ? <SplashScreen onComplete={() => setShowSplash(false)} /> : null}
              <BrowserRouter>
                <NavigationHaptics />
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/marketplace" replace />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/marketplace/channels/:channelId" element={<ChannelDetails />} />
                    <Route
                      path="/marketplace/channels/:channelId/request"
                      element={
                        <RequireAuth>
                          <CreateDeal />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/deals"
                      element={
                        <RequireAuth>
                          <Deals />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/deals/:dealId"
                      element={
                        <RequireAuth>
                          <DealDetails />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/escrow/:dealId"
                      element={
                        <RequireAuth>
                          <EscrowPayment />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/funds-locked"
                      element={
                        <RequireAuth>
                          <FundsLocked />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/channels"
                      element={
                        <RequireAuth>
                          <Channels />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/channel-manage/:id"
                      element={
                        <RequireAuth>
                          <ChannelDetailsManage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/add-channel"
                      element={
                        <RequireAuth>
                          <AddChannel />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/add-channel-step1"
                      element={
                        <RequireAuth>
                          <AddChannelStep1 />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/add-channel-step2"
                      element={
                        <RequireAuth>
                          <AddChannelStep2 />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/add-channel-step3"
                      element={
                        <RequireAuth>
                          <AddChannelStep3 />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <RequireAuth>
                          <Profile />
                        </RequireAuth>
                      }
                    />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </BrowserRouter>
            </TooltipProvider>
          </LanguageProvider>
        </TelegramProvider>
      </TonConnectUIProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
