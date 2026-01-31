import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import InfoCard from "@/components/deals/InfoCard";
import type { DealListItem } from "@/types/deals";
import { post } from "@/api/core/apiClient";
import { getErrorMessage } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageProvider";


