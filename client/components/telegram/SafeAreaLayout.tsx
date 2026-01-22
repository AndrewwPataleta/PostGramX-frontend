import { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SafeAreaLayoutProps {
  children: ReactNode;
  bottomNavHeight?: number;
  className?: string;
}

const SafeAreaLayout = ({
  children,
  bottomNavHeight = 0,
  className,
}: SafeAreaLayoutProps) => {
  const style: CSSProperties = {
    paddingTop: "var(--tg-content-top)",
    paddingBottom: `calc(var(--tg-content-bottom) + ${bottomNavHeight}px)`,
    paddingLeft: "var(--tg-content-left)",
    paddingRight: "var(--tg-content-right)",
  };

  return (
    <div className={cn("flex-1", className)} style={style}>
      {children}
    </div>
  );
};

export default SafeAreaLayout;
