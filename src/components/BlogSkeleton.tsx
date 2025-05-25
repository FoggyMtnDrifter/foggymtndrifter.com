import { Card } from "./Card";

interface BlogSkeletonProps {
  limit?: number;
}

export function BlogSkeleton({ limit = 3 }: BlogSkeletonProps) {
  return (
    <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
      <div className="flex max-w-3xl flex-col space-y-16">
        {Array.from({ length: limit }).map((_, i) => (
          <article key={i} className="md:grid md:grid-cols-4 md:items-baseline">
            <Card className="md:col-span-3">
              <div className="animate-pulse">
                <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6"></div>
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-violet-600 dark:text-violet-400">
                  <span className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-24"></span>
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="ml-1 h-4 w-4 stroke-current"
                  >
                    <path
                      d="M6.75 5.75 9.25 8l-2.5 2.25"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </Card>
            <div className="mt-1 max-md:hidden">
              <div className="animate-pulse">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-24"></div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function BlogPostSkeleton() {
  return (
    <article className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-2xl lg:max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 mb-8"></div>
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4 mb-12"></div>
          <div className="space-y-4">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </article>
  );
}
