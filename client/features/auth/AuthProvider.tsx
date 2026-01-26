import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AUTH_EXPIRED_EVENT } from "@/lib/api/auth";
import { ensureReady } from "@/lib/telegram";
import {
  getSessionUser,
  initSession,
  type AuthUser,
} from "@/features/auth/telegramAuth";

export type AuthError =
  | "missing_init_data"
  | "session_expired"
  | "auth_failed"
  | null;

interface AuthContextValue {
  user: AuthUser | null;
  isReady: boolean;
  isLoading: boolean;
  error: AuthError;
  reconnect: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const resolveError = (error: unknown): AuthError => {
  const message = error instanceof Error ? error.message : "";
  if (
    message.includes("Missing Telegram init data") ||
    message.includes("Missing Telegram user profile")
  ) {
    return "missing_init_data";
  }

  return "auth_failed";
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(getSessionUser());
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError>(null);
  const [sessionExpiredOpen, setSessionExpiredOpen] = useState(false);

  const runInit = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      ensureReady();
      await initSession();
      setUser(getSessionUser());
      setIsReady(true);
    } catch (err) {
      setIsReady(false);
      setError(resolveError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void runInit();
  }, [runInit]);

  useEffect(() => {
    const handleExpired = () => {
      setSessionExpiredOpen(true);
      setError("session_expired");
      setIsReady(false);
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    };
  }, []);

  const reconnect = useCallback(async () => {
    setSessionExpiredOpen(false);
    await runInit();
  }, [runInit]);

  const value = useMemo(
    () => ({
      user,
      isReady,
      isLoading,
      error,
      reconnect,
    }),
    [user, isReady, isLoading, error, reconnect]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AlertDialog open={sessionExpiredOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Session expired</AlertDialogTitle>
            <AlertDialogDescription>
              Your session expired. Please reconnect to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={reconnect}>Reconnect</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
