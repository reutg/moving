"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2, CheckCircle } from "lucide-react";

interface MarkMoveCompleteButtonProps {
  isMarkingComplete: boolean;
  handleMarkComplete: () => Promise<void>;
}

const MarkMoveCompleteButton: React.FC<MarkMoveCompleteButtonProps> = ({
  isMarkingComplete,
  handleMarkComplete,
}) => {
  return (
    <Button
      variant="ghost"
      className="hover:bg-muted/50 h-auto w-full justify-between rounded-none px-4 font-normal"
      onClick={() => void handleMarkComplete()}
      disabled={isMarkingComplete}
    >
      <div className="flex items-center gap-2">
        <CheckCircle className="text-foreground size-5" />
        <span className="text-foreground text-sm font-medium">Mark move as complete</span>
      </div>
      {isMarkingComplete ? (
        <Loader2 className="text-subtle-foreground size-4 animate-spin" aria-hidden />
      ) : (
        <ChevronRight className="text-subtle-foreground size-4" aria-hidden />
      )}
    </Button>
  );
};

export default MarkMoveCompleteButton;
