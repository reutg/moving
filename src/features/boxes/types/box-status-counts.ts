import type { BoxStatus } from "@/constants";

export type BoxStatusCounts = Record<BoxStatus, number> & {
  total: number;
};
