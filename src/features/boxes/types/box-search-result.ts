import type { BoxStatus } from "@/constants";

export type BoxSearchItemResult = {
  item: string;
  boxNumber: number;
  room: string;
  status: BoxStatus;
};

export type BoxSearchBoxResult = {
  title: string;
  boxNumber: number;
  room: string;
  status: BoxStatus;
  match: string;
};

export type BoxSearchResult = {
  items: BoxSearchItemResult[];
  boxes: BoxSearchBoxResult[];
  totalCount: number;
};
