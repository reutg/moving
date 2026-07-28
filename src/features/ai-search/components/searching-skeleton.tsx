import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchingSkeletonProps {}

const SearchingSkeleton: React.FC<SearchingSkeletonProps> = ({}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5 px-2">
        <div className="flex items-center gap-[5px]">
          <span className="animate-aisrch-bounce bg-primary size-2 rounded-full"></span>
          <span className="animate-aisrch-bounce bg-primary size-2 rounded-full [animation-delay:0.18s]"></span>
          <span className="animate-aisrch-bounce bg-primary size-2 rounded-full [animation-delay:0.36s]"></span>
        </div>
        <span className="text-muted-foreground text-sm">Searching all your boxes...</span>
      </div>

      <div className="flex flex-col gap-4">
        <Card className="w-full">
          <CardHeader className="flex items-center gap-2">
            <Skeleton className="size-10 shrink-0 rounded-xl" />
            <div className="flex w-full flex-col gap-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
            <Skeleton className="h-5 w-14 shrink-0 rounded-full" />
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[180px]" />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex items-center gap-2">
            <Skeleton className="size-10 shrink-0 rounded-xl" />
            <div className="flex w-full flex-col gap-2">
              <Skeleton className="h-4 w-[160px]" />
              <Skeleton className="h-4 w-[40px]" />
            </div>
            <Skeleton className="h-5 w-14 shrink-0 rounded-full" />
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[130px]" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SearchingSkeleton;
