"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import clsx from "clsx";

type SearchResult = {
  type: "blog" | "project";
  title: string;
  description: string;
  url: string;
  date?: string;
};

function SearchIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M19.25 19.25L15.5 15.5M4.75 11C4.75 7.54822 7.54822 4.75 11 4.75C14.4518 4.75 17.25 7.54822 17.25 11C17.25 14.4518 14.4518 17.25 11 17.25C7.54822 17.25 4.75 14.4518 4.75 11Z"
        stroke="currentColor"
      />
    </svg>
  );
}

function SearchResult({
  result,
  onClose,
}: {
  result: SearchResult;
  onClose: () => void;
}) {
  const handleClick = () => {
    if (result.type === "project") {
      window.open(result.url, "_blank");
    } else {
      // For Astro, use regular navigation
      window.location.href = result.url;
    }
    onClose();
  };

  return (
    <li>
      <button
        className="block w-full rounded-lg p-4 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
        onClick={handleClick}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {result.title}
          </h2>
          <span
            className={clsx(
              "ml-2 rounded-full px-2 py-0.5 text-xs font-medium",
              result.type === "blog"
                ? "bg-violet-100 text-violet-900 dark:bg-violet-900/20 dark:text-violet-400"
                : "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-400"
            )}
          >
            {result.type}
          </span>
        </div>
        {result.description && (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {result.description}
          </p>
        )}
        {result.date && (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
            {result.date}
          </p>
        )}
      </button>
    </li>
  );
}

export function SearchDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "blog" | "project">(
    "all"
  );
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      console.log(`Performing search for: "${searchQuery}"`);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(
            searchQuery
          )}&filter=${activeFilter}`
        );

        if (!response.ok) {
          throw new Error(`Search failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Search returned ${data.length} results:`, data);
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [activeFilter]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setActiveFilter("all");
    }
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-400/25 backdrop-blur-sm dark:bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-zinc-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 transition-all dark:divide-zinc-800 dark:bg-zinc-900 dark:ring-white/10">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                <input
                  ref={inputRef}
                  type="text"
                  className="h-12 w-full rounded-t-xl border-0 bg-transparent pr-4 pl-11 text-zinc-900 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-500 focus:ring-inset sm:text-sm dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-violet-400"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="flex divide-x divide-zinc-100 dark:divide-zinc-800">
                {(["all", "blog", "project"] as const).map((filter) => (
                  <button
                    key={filter}
                    className={clsx(
                      "flex-1 px-4 py-2 text-sm font-medium transition",
                      activeFilter === filter
                        ? "text-violet-600 dark:text-violet-400"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    )}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              <div className="max-h-96 overflow-y-auto p-2">
                {isLoading ? (
                  <div className="p-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Searching...
                  </div>
                ) : results.length > 0 ? (
                  <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {results.map((result, index) => (
                      <SearchResult
                        key={index}
                        result={result}
                        onClose={onClose}
                      />
                    ))}
                  </ul>
                ) : query ? (
                  <div className="p-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    No results found.
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Start typing to search posts and projects...
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export function SearchButton({
  onClick,
}: {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      className="group flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
      onClick={onClick}
      aria-label="Search"
    >
      <SearchIcon className="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400" />
    </button>
  );
}
