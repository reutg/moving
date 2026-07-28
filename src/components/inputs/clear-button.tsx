"use client";

import { Loader2, XIcon } from "lucide-react";

import Button from "../button";

interface ClearButtonProps {
  isSearching: boolean;
  searchValue: string;
  clearSearch: () => void;
}

const ClearButton: React.FC<ClearButtonProps> = ({ isSearching, searchValue, clearSearch }) => {
  if (!searchValue) return null;
  return isSearching ? (
    <Loader2 className="animate-spin" />
  ) : (
    <Button variant="ghost" size="icon-xs" onClick={clearSearch} className="bg-input-border">
      <XIcon />
    </Button>
  );
};

export default ClearButton;
