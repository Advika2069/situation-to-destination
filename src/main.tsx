import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Discover = lazy(() => import("./pages/Discover.tsx"));
const DestinationDetail = lazy(() => import("./pages/DestinationDetail.tsx"));
const Plan = lazy(() => import("./pages/Plan.tsx"));
const MapPage = lazy(() => import("./pages/MapPage.tsx"));
const Move = lazy(() => import("./pages/Move.tsx"));
const Experiences = lazy(() => import("./pages/Experiences.tsx"));
const Trips = lazy(() => import("./pages/Trips.tsx"));
const TripDetail = lazy(() => import("./pages/TripDetail.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const Analytics = lazy(() => import("./pages/Analytics.tsx"));
const WalletPage = lazy(() => import("./pages/Wallet.tsx"));
const Safety = lazy(() => import("./pages/Safety.tsx"));
const Offline = lazy(() => import("./pages/Offline.tsx"));
const TravelTogether = lazy(() => import("./pages/TravelTogether.tsx"));
const Business = lazy(() => import("./pages/Business.tsx"));
const Guides = lazy(() => import("./pages/Guides.tsx"));
const Pricing = lazy(() => import("./pages/Pricing.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in WebContainer environment). */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[WebContainer preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground/80 max-h-40 overflow-auto rounded border border-border/60 p-2">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);



function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <RouteSyncer />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route
                path="/auth"
                element={<AuthPage redirectAfterAuth="/discover" />}
              />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route path="/discover" element={<RequireAuth><Discover /></RequireAuth>} />
              <Route path="/destination/:slug" element={<RequireAuth><DestinationDetail /></RequireAuth>} />
              <Route path="/plan" element={<RequireAuth><Plan /></RequireAuth>} />
              <Route path="/map" element={<RequireAuth><MapPage /></RequireAuth>} />
              <Route path="/move" element={<RequireAuth><Move /></RequireAuth>} />
              <Route path="/experiences" element={<RequireAuth><Experiences /></RequireAuth>} />
              <Route path="/trips" element={<RequireAuth><Trips /></RequireAuth>} />
              <Route path="/trips/:id" element={<RequireAuth><TripDetail /></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />
              <Route path="/wallet" element={<RequireAuth><WalletPage /></RequireAuth>} />
              <Route path="/safety" element={<RequireAuth><Safety /></RequireAuth>} />
              <Route path="/offline" element={<RequireAuth><Offline /></RequireAuth>} />
              <Route path="/travel-together" element={<RequireAuth><TravelTogether /></RequireAuth>} />
              <Route path="/business" element={<RequireAuth><Business /></RequireAuth>} />
              <Route path="/business/dashboard" element={<RequireAuth><Business /></RequireAuth>} />
              <Route path="/guides" element={<RequireAuth><Guides /></RequireAuth>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
