import { ReactNode } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { Button } from "@/components/ui/button";

const AuthLoadingScreen = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
    <p className="text-sm text-muted-foreground">Connecting to Telegram…</p>
  </div>
);

const AuthErrorScreen = ({
  title,
  description,
  onRetry,
}: {
  title: string;
  description: string;
  onRetry: () => void;
}) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <Button onClick={onRetry}>Retry</Button>
  </div>
);

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isReady, isLoading, error, reconnect } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (error === "missing_init_data") {
    return (
      <AuthErrorScreen
        title="Open in Telegram"
        description="This app must be opened inside Telegram to continue."
        onRetry={reconnect}
      />
    );
  }

  if (error === "session_expired") {
    return (
      <AuthErrorScreen
        title="Session expired"
        description="Your session expired. Please reconnect to continue."
        onRetry={reconnect}
      />
    );
  }

  if (error) {
    return (
      <AuthErrorScreen
        title="Unable to connect"
        description="We could not validate your Telegram session. Please retry."
        onRetry={reconnect}
      />
    );
  }

  if (!isReady) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
};
