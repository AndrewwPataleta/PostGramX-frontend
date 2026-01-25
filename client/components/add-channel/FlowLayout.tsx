import { ReactNode, useEffect, useRef, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FlowLayoutProps {
  title: string;
  backTo?: string;
  onBack?: () => void;
  children: ReactNode;
  footer?: ReactNode;
  footerMode?: "fixed" | "sticky";
  footerPaddingClassName?: string;
}

export default function FlowLayout({
  title,
  backTo,
  onBack,
  children,
  footer,
  footerMode = "fixed",
  footerPaddingClassName = "pb-[calc(104px+var(--tg-content-safe-area-inset-bottom))]",
}: FlowLayoutProps) {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) {
      return;
    }

    const updateHeaderHeight = () => {
      setHeaderHeight(header.offsetHeight);
    };

    updateHeaderHeight();
    const observer = new ResizeObserver(() => updateHeaderHeight());
    observer.observe(header);
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (backTo) {
      navigate(backTo);
      return;
    }
    navigate(-1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        ref={headerRef}
        className="fixed left-0 right-0 z-30 border-b border-border/50 bg-background/90 backdrop-blur-glass"
        style={{
          top: "calc(var(--tg-content-safe-area-inset-top) + var(--wallet-banner-height, 0px))",
        }}
      >
        <div className="mx-auto w-full max-w-2xl">
          <div className="grid grid-cols-[auto,1fr,auto] items-center gap-3 px-4 py-3">
            <button type="button" onClick={handleBack} className="text-foreground">
              <ArrowLeft size={22} />
            </button>
            <p className="text-center text-sm font-semibold text-foreground">{title}</p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button type="button" className="text-foreground">
                  <X size={20} />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-sm rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Exit channel connection?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your progress will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => navigate("/marketplace")}>
                    Exit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div
        className={`px-4 pt-4 ${footer ? footerPaddingClassName : "pb-6"}`}
        style={{ paddingTop: headerHeight }}
      >
        {children}
        {footer && footerMode === "sticky" ? (
          <div
            className="sticky z-20 mt-3"
            style={{
              bottom: "calc(var(--tg-content-safe-area-inset-bottom) + 12px)",
            }}
          >
            {footer}
          </div>
        ) : null}
      </div>

      {footer && footerMode === "fixed" ? (
        <div
          className="fixed left-0 right-0 z-30"
          style={{
            bottom: "calc(var(--tg-content-safe-area-inset-bottom) + 12px)",
          }}
        >
          <div className="mx-auto w-full max-w-2xl px-4">{footer}</div>
        </div>
      ) : null}
    </div>
  );
}
