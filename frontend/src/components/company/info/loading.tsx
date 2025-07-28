import Skeleton from '@/components/ui/skeleton';
import CarouselSkeleton from '@/components/ui/carousel/skeleton';
import ParagraphSkeleton from '@/components/ui/paragraph-skeleton';

export default function LoadingCompanyInfo() {
  return (
    <>
      <div className="text-center flex flex-col items-center justify-center gap-1">
        <h2 className="text-xl font-black text-primary font-heading">
          Company Information:
        </h2>
        <Skeleton className="h-5 w-64" />
        <Skeleton className="mx-auto px-4 py-1 h-4 w-24" />
      </div>
      <Skeleton className="w-48 h-48" />
      <CarouselSkeleton
        itemCount={4}
        itemClass="h-4 w-24"
      />
      <ParagraphSkeleton
        lineClass="w-full h-3"
        lineCount={6}
        className="mx-auto relative w-2xl"
      />
    </>
  );
}
