"use client";

import { CameraIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import IconTile from "@/components/ui/icon-tile";
import type { ApiResponse } from "@/lib/api/response";
import { cn } from "@/lib/utils";
import type { BoxPhotoAnalysis } from "@/features/boxes/services/analyze-box-photo-service";

const MAX_BYTES = 8 * 1024 * 1024;

interface PhotoUploadProps {
  onFinishedAnalyzing: (analysis: BoxPhotoAnalysis) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onFinishedAnalyzing }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.size > MAX_BYTES) {
      setError("Photo must be 8MB or smaller.");
      event.target.value = "";
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch("/api/boxes/analyze", {
        method: "POST",
        body: formData,
      });
      const json: ApiResponse<BoxPhotoAnalysis> = await response.json();
      if (json.ok) {
        await onFinishedAnalyzing(json.data);
      } else {
        setError(json.error.message);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to analyze image.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-2">
      <label
        aria-busy={isAnalyzing}
        className={cn(
          "border-border bg-card relative flex h-44 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border p-4",
          previewUrl ? "border-solid" : "border-dash",
          isAnalyzing ? "cursor-wait" : "cursor-pointer",
        )}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          capture="environment"
          onChange={handleChange}
          disabled={isAnalyzing}
        />
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Box content preview"
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <>
            <IconTile icon={CameraIcon} size="md" />

            <span className="text-muted-foreground text-center text-sm">Add a photo</span>
            <span className="text-muted-foreground text-center text-xs">(optional)</span>
          </>
        )}
        {isAnalyzing && (
          <div className="bg-background/80 absolute inset-0 flex items-center justify-center gap-2">
            <Loader2 className="text-primary size-5 animate-spin" />
            <span className="text-foreground text-sm font-medium">Analyzing image…</span>
          </div>
        )}
      </label>
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

export default PhotoUpload;
