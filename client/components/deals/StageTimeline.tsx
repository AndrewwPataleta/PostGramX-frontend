import { ChevronLeft, ChevronRight } from "lucide-react";
import { canNavigateTo, stageToLabel, type DealStageId } from "@/features/deals/dealStageMachine";
import type { EscrowStatus } from "@/types/deals";
import { cn } from "@/lib/utils";

interface StageTimelineProps {
  stages: DealStageId[];
  selectedStage: DealStageId;
  escrowStatus: EscrowStatus;
  onSelect: (stage: DealStageId) => void;
}

export default function StageTimeline({
  stages,
  selectedStage,
  escrowStatus,
  onSelect,
}: StageTimelineProps) {
  const currentIndex = stages.indexOf(selectedStage);
  const previousStage = currentIndex > 0 ? stages[currentIndex - 1] : null;
  const nextStage = currentIndex >= 0 && currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;

  return (
    <div className="rounded-2xl border border-border/50 bg-card/80 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Timeline</p>
        <span className="text-xs text-muted-foreground">{stages.length} steps</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => previousStage && onSelect(previousStage)}
          disabled={!previousStage}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition",
            previousStage ? "hover:text-foreground" : "cursor-not-allowed opacity-40"
          )}
          aria-label="Previous stage"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex flex-1 flex-wrap gap-2">
          {stages.map((stage) => {
            const isActive = stage === selectedStage;
            const isDisabled = !canNavigateTo(stage, escrowStatus);
            return (
              <button
                key={stage}
                type="button"
                onClick={() => onSelect(stage)}
                disabled={isDisabled}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition",
                  isActive
                    ? "border-primary/50 bg-primary/15 text-primary-foreground"
                    : "border-border/60 bg-background/50 text-muted-foreground",
                  isDisabled ? "cursor-not-allowed opacity-40" : "hover:border-primary/40 hover:text-foreground"
                )}
              >
                {stageToLabel(stage)}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => nextStage && onSelect(nextStage)}
          disabled={!nextStage}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition",
            nextStage ? "hover:text-foreground" : "cursor-not-allowed opacity-40"
          )}
          aria-label="Next stage"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
