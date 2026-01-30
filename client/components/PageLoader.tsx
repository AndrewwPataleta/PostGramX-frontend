import { Loader2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

const PageLoader = () => {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{t("common.loading")}</span>
      </div>
    </div>
  );
};

export default PageLoader;
