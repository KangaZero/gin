import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PetsSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <div className="space-y-3 mt-4">
              <Skeleton className="h-4 w-[250px]" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-[200px]" />
                <Skeleton className="h-3 w-[150px]" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-8 w-[100px]" />
                <Skeleton className="h-8 w-[100px]" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
