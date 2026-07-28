import { capitalize } from "lodash";
import { Check, Sparkle } from "lucide-react";

import { COMMON_LOCATIONS, FALLBACK_LOCATION_ICON, LOCATION_ICONS } from "@/constants";

import type { ChipVariant } from "@/components/ui/chip";

import type { AiBoxSearchResult } from "../types/ai-box-search-result";

export const useSearchResultItem = (result: AiBoxSearchResult) => {
  const { roomName, matchType, confidence } = result;

  const room = roomName as keyof typeof COMMON_LOCATIONS;
  const roomLabel = COMMON_LOCATIONS[room] ?? roomName;
  const RoomIcon = LOCATION_ICONS[room] ?? FALLBACK_LOCATION_ICON;

  const matchLabel = `${capitalize(matchType)} match`;
  const confidenceLabel =
    matchType === "exact" ? `100% match` : `${capitalize(confidence)} confidence`;

  const getConfidenceTextColor = () => {
    if (confidence === "medium") return "text-chip-blue-text";
    if (confidence === "low") return "text-chip-neutral-text";
    return "text-primary";
  };

  const getChipVariant = (): ChipVariant => {
    if (confidence === "medium") return "blue";
    if (confidence === "low") return "neutral";
    return "default";
  };

  const getExplanationBackground = () => {
    if (confidence === "low") return "bg-chip-neutral-bg";
    if (confidence === "medium") return "bg-chip-blue-bg";
    return "bg-accent";
  };

  const getExplanationIconColor = () => {
    if (confidence === "low") return "text-chip-neutral-text";
    if (confidence === "medium") return "text-chip-blue-text";
    return "text-primary";
  };

  const explanationLabelColor =
    confidence === "low" ? "text-chip-neutral-text" : "text-chip-blue-text:";
  const ChipIcon = matchType === "exact" ? Check : Sparkle;

  return {
    roomLabel,
    RoomIcon,
    matchLabel,
    confidenceLabel,
    confidenceTextColor: getConfidenceTextColor(),
    chipVariant: getChipVariant(),
    explanationLabelColor,
    explanationBackground: getExplanationBackground(),
    explanationIconColor: getExplanationIconColor(),
    ChipIcon,
  };
};
