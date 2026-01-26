import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PageLoader from "@/components/PageLoader";
import ErrorBoundary from "@/components/ErrorBoundary";
import AppShell from "@/layout/AppShell";

const Marketplace = lazy(() => import("./pages/Marketplace"));
const ChannelDetails = lazy(() => import("./pages/ChannelDetails"));
const CreateDeal = lazy(() => import("./pages/CreateDeal"));
const Deals = lazy(() => import("./pages/Deals"));
const DealDetails = lazy(() => import("./pages/DealDetails"));
const EscrowPayment = lazy(() => import("./pages/EscrowPayment"));
const FundsLocked = lazy(() => import("./pages/FundsLocked"));
const Channels = lazy(() => import("./pages/Channels"));
const CreateListing = lazy(() => import("./pages/CreateListing"));
const ListingPreview = lazy(() => import("./pages/ListingPreview"));
const ListingSuccess = lazy(() => import("./pages/ListingSuccess"));
const EditListing = lazy(() => import("./pages/EditListing"));
const Profile = lazy(() => import("./pages/Profile"));
const AddChannelStep1 = lazy(() => import("./pages/AddChannelStep1"));
const AddChannelStep2 = lazy(() => import("./pages/AddChannelStep2"));
const AddChannelStep3 = lazy(() => import("./pages/AddChannelStep3"));
const AddChannelLayout = lazy(() => import("./pages/add-channel/AddChannelLayout"));
const ChannelManageLayout = lazy(
  () => import("./pages/channel-manage/ChannelManageLayout"),
);
const ChannelOverview = lazy(() => import("./pages/channel-manage/ChannelOverview"));
const ListingsList = lazy(() => import("./pages/channel-manage/ListingsList"));
const ChannelSettings = lazy(() => import("./pages/channel-manage/ChannelSettings"));
const Splash = lazy(() => import("./pages/Splash"));
const NotFound = lazy(() => import("./pages/NotFound"));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/splash" element={<Splash />} />
        <Route
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <AppShell />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/marketplace" replace />} />
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
          <Route path="/profile" element={<Profile />} />

          <Route path="/add-channel" element={<AddChannelLayout />}>
            <Route index element={<Navigate to="step-1" replace />} />
            <Route path="step-1" element={<AddChannelStep1 />} />
            <Route path="step-2" element={<AddChannelStep2 />} />
            <Route path="step-3" element={<AddChannelStep3 />} />
          </Route>

          <Route path="/channel-manage/:id" element={<ChannelManageLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<ChannelOverview />} />
            <Route path="listings" element={<ListingsList />} />
            <Route path="listings/create" element={<CreateListing />} />
            <Route path="listings/preview" element={<ListingPreview />} />
            <Route path="listings/success" element={<ListingSuccess />} />
            <Route path="listings/:listingId/edit" element={<EditListing />} />
            <Route path="settings" element={<ChannelSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
