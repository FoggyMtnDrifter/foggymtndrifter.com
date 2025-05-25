"use client";

import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
} from "@headlessui/react";
import clsx from "clsx";

import { Container } from "@/components/Container";
import { SearchDialog } from "@/components/SearchDialog";

// Custom hook to get current pathname in Astro
function usePathname(initialPathname?: string) {
  const [pathname, setPathname] = useState(initialPathname || "/");

  useEffect(() => {
    // Only update if we don't have an initial pathname or if it's different
    const currentPathname = window.location.pathname;
    if (!initialPathname || currentPathname !== initialPathname) {
      setPathname(currentPathname);
    }

    // Listen for navigation changes
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [initialPathname]);

  return pathname;
}

function CloseIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 8 6" aria-hidden="true" {...props}>
      <path
        d="M1.75 1.75 4 4.25l2.25-2.5"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M8 12.25A4.25 4.25 0 0 1 12.25 8v0a4.25 4.25 0 0 1 4.25 4.25v0a4.25 4.25 0 0 1-4.25 4.25v0A4.25 4.25 0 0 1 8 12.25v0Z" />
      <path
        d="M12.25 3v1.5M21.5 12.25H20M18.791 18.791l-1.06-1.06M18.791 5.709l-1.06 1.06M12.25 20v1.5M4.5 12.25H3M6.77 6.77 5.709 5.709M6.77 17.73l-1.061 1.061"
        fill="none"
      />
    </svg>
  );
}

function MoonIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M17.25 16.22a6.937 6.937 0 0 1-9.47-9.47 7.451 7.451 0 1 0 9.47 9.47ZM12.75 7C17 7 17 2.75 17 2.75S17 7 21.25 7C17 7 17 11.25 17 11.25S17 7 12.75 7Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path
        d="M8.5 14.5a6 6 0 100-12 6 6 0 000 12zM17.5 17.5l-3.5-3.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MobileNavItem({
  href,
  children,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  if (href) {
    return (
      <li>
        <PopoverButton as="a" href={href} className="block py-2">
          {children}
        </PopoverButton>
      </li>
    );
  }

  return (
    <li>
      <PopoverButton
        as="button"
        onClick={onClick}
        className="block w-full py-2 text-left"
      >
        {children}
      </PopoverButton>
    </li>
  );
}

function MobileNavigation(
  props: React.ComponentPropsWithoutRef<typeof Popover>
) {
  return (
    <Popover {...props}>
      {({ close }) => (
        <>
          <PopoverButton className="group flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20">
            Menu
            <ChevronDownIcon className="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400" />
          </PopoverButton>
          <PopoverBackdrop
            transition
            className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-xs duration-150 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in dark:bg-black/80"
          />
          <PopoverPanel
            focus
            transition
            className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 duration-150 data-closed:scale-95 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in dark:bg-zinc-900 dark:ring-zinc-800"
          >
            <div className="flex flex-row-reverse items-center justify-between">
              <PopoverButton aria-label="Close menu" className="-m-1 p-1">
                <CloseIcon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
              </PopoverButton>
              <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Navigation
              </h2>
            </div>
            <nav className="mt-6">
              <ul className="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
                <MobileNavItem href="/about">About</MobileNavItem>
                <MobileNavItem href="/blog">Blog</MobileNavItem>
                <MobileNavItem href="/projects">Projects</MobileNavItem>
              </ul>
            </nav>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
}

function NavItem({
  href,
  children,
  currentPathname,
}: {
  href?: string;
  children: React.ReactNode;
  currentPathname: string;
}) {
  let isActive = href ? currentPathname === href : false;

  if (href) {
    return (
      <li>
        <a
          href={href}
          className={clsx(
            "relative block px-3 py-2 transition",
            isActive
              ? "text-violet-600 dark:text-violet-400"
              : "hover:text-violet-600 dark:hover:text-violet-400"
          )}
        >
          {children}
          {isActive && (
            <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-violet-600/0 via-violet-600/40 to-violet-600/0 dark:from-violet-400/0 dark:via-violet-400/40 dark:to-violet-400/0" />
          )}
        </a>
      </li>
    );
  }

  return <li>{children}</li>;
}

function DesktopNavigation(
  props: React.ComponentPropsWithoutRef<"nav"> & { currentPathname: string }
) {
  const { currentPathname, ...navProps } = props;
  return (
    <nav {...navProps}>
      <ul className="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
        <NavItem href="/about" currentPathname={currentPathname}>
          About
        </NavItem>
        <NavItem href="/blog" currentPathname={currentPathname}>
          Blog
        </NavItem>
        <NavItem href="/projects" currentPathname={currentPathname}>
          Projects
        </NavItem>
      </ul>
    </nav>
  );
}

function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simple toggle function that works directly with the DOM
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="flex h-6 w-6 items-center justify-center transition hover:text-zinc-900 dark:hover:text-zinc-100"
        disabled
      >
        <SunIcon className="h-5 w-5 fill-zinc-100 stroke-zinc-500 transition" />
      </button>
    );
  }

  const isDark = document.documentElement.classList.contains("dark");

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex h-6 w-6 items-center justify-center transition hover:text-zinc-900 dark:hover:text-zinc-100"
      onClick={toggleTheme}
    >
      <SunIcon className="h-5 w-5 fill-zinc-100 stroke-zinc-500 transition hover:fill-zinc-200 hover:stroke-zinc-700 dark:hidden [@media(prefers-color-scheme:dark)]:fill-violet-50 [@media(prefers-color-scheme:dark)]:stroke-violet-500 [@media(prefers-color-scheme:dark)]:hover:fill-violet-50 [@media(prefers-color-scheme:dark)]:hover:stroke-violet-600" />
      <MoonIcon className="hidden h-5 w-5 fill-zinc-700 stroke-zinc-500 transition dark:block [@media_not_(prefers-color-scheme:dark)]:fill-violet-400/10 [@media_not_(prefers-color-scheme:dark)]:stroke-violet-500 [@media(prefers-color-scheme:dark)]:hover:stroke-zinc-400" />
    </button>
  );
}

function clamp(number: number, a: number, b: number) {
  let min = Math.min(a, b);
  let max = Math.max(a, b);
  return Math.min(Math.max(number, min), max);
}

function AvatarContainer({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={clsx(
        className,
        "h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:ring-white/10"
      )}
      {...props}
    />
  );
}

function Avatar({
  large = false,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"a">, "href"> & {
  large?: boolean;
}) {
  return (
    <a
      href="/"
      aria-label="Home"
      className={clsx(className, "pointer-events-auto")}
      {...props}
    >
      <img
        src="/images/avatar.jpeg"
        alt=""
        className={clsx(
          "rounded-full bg-zinc-100 object-cover dark:bg-zinc-800",
          large ? "h-16 w-16" : "h-9 w-9"
        )}
        style={{ viewTransitionName: "header-avatar" }}
      />
    </a>
  );
}

interface HeaderProps {
  pathname?: string;
}

export function Header({ pathname }: HeaderProps = {}) {
  let currentPathname = usePathname(pathname);
  let isHomePage = currentPathname === "/";
  let headerRef = useRef<React.ElementRef<"div">>(null);
  let avatarRef = useRef<React.ElementRef<"div">>(null);
  let isInitial = useRef(true);
  let [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    let downDelay = avatarRef.current?.offsetTop ?? 0;
    let upDelay = 64;

    function setProperty(property: string, value: string) {
      document.documentElement.style.setProperty(property, value);
    }

    function removeProperty(property: string) {
      document.documentElement.style.removeProperty(property);
    }

    function updateHeaderStyles() {
      if (!headerRef.current) {
        return;
      }

      let { top, height } = headerRef.current.getBoundingClientRect();
      let scrollY = clamp(
        window.scrollY,
        0,
        document.body.scrollHeight - window.innerHeight
      );

      if (isInitial.current) {
        setProperty("--header-position", "sticky");
      }

      setProperty("--content-offset", `${downDelay}px`);

      if (isInitial.current || scrollY < downDelay) {
        setProperty("--header-height", `${downDelay + height}px`);
        setProperty("--header-mb", `${-downDelay}px`);
      } else if (top + height < -upDelay) {
        let offset = Math.max(height, scrollY - upDelay);
        setProperty("--header-height", `${offset}px`);
        setProperty("--header-mb", `${height - offset}px`);
      } else if (top === 0) {
        setProperty("--header-height", `${scrollY + height}px`);
        setProperty("--header-mb", `${-scrollY}px`);
      }

      if (top === 0 && scrollY > 0 && scrollY >= downDelay) {
        setProperty("--header-inner-position", "fixed");
        removeProperty("--header-top");
        removeProperty("--avatar-top");
      } else {
        removeProperty("--header-inner-position");
        setProperty("--header-top", "0px");
        setProperty("--avatar-top", "0px");
      }
    }

    function updateAvatarStyles() {
      if (!isHomePage) {
        return;
      }

      let fromScale = 1;
      let toScale = 36 / 64;
      let fromX = 0;
      let toX = 2 / 16;

      let scrollY = downDelay - window.scrollY;

      let scale = (scrollY * (fromScale - toScale)) / downDelay + toScale;
      scale = clamp(scale, fromScale, toScale);

      let x = (scrollY * (fromX - toX)) / downDelay + toX;
      x = clamp(x, fromX, toX);

      setProperty(
        "--avatar-image-transform",
        `translate3d(${x}rem, 0, 0) scale(${scale})`
      );

      let borderScale = 1 / (toScale / scale);
      let borderX = (-toX + x) * borderScale;
      let borderTransform = `translate3d(${borderX}rem, 0, 0) scale(${borderScale})`;

      setProperty("--avatar-border-transform", borderTransform);
      setProperty("--avatar-border-opacity", scale === toScale ? "1" : "0");
    }

    function updateStyles() {
      updateHeaderStyles();
      updateAvatarStyles();
      isInitial.current = false;
    }

    updateStyles();
    window.addEventListener("scroll", updateStyles, { passive: true });
    window.addEventListener("resize", updateStyles);

    return () => {
      window.removeEventListener("scroll", updateStyles);
      window.removeEventListener("resize", updateStyles);
    };
  }, [isHomePage]);

  return (
    <>
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <header
        className="pointer-events-none relative z-50 flex flex-none flex-col"
        style={{
          height: "var(--header-height)",
          marginBottom: "var(--header-mb)",
        }}
      >
        {isHomePage && (
          <>
            <div
              ref={avatarRef}
              className="order-last mt-[calc(4rem-0.75rem)]"
            />
            <Container
              className="top-0 order-last -mb-3 pt-3"
              style={{
                position:
                  "var(--header-position)" as React.CSSProperties["position"],
              }}
            >
              <div
                className="top-[var(--avatar-top,0.75rem)] w-full"
                style={{
                  position:
                    "var(--header-inner-position)" as React.CSSProperties["position"],
                }}
              >
                <div className="relative">
                  <AvatarContainer
                    className="absolute top-3 left-0 origin-left transition-opacity"
                    style={{
                      opacity: "var(--avatar-border-opacity, 0)",
                      transform: "var(--avatar-border-transform)",
                    }}
                  />
                  <Avatar
                    large
                    className="block h-16 w-16 origin-left"
                    style={{ transform: "var(--avatar-image-transform)" }}
                  />
                </div>
              </div>
            </Container>
          </>
        )}
        <div
          ref={headerRef}
          className="top-0 z-10 h-16 pt-6"
          style={{
            position:
              "var(--header-position)" as React.CSSProperties["position"],
          }}
        >
          <Container
            className="top-[var(--header-top,1.5rem)] w-full"
            style={{
              position:
                "var(--header-inner-position)" as React.CSSProperties["position"],
            }}
          >
            <div className="relative flex gap-4">
              <div className="flex flex-1">
                {!isHomePage && (
                  <AvatarContainer>
                    <Avatar />
                  </AvatarContainer>
                )}
              </div>
              <div className="flex flex-1 justify-end md:justify-center">
                <MobileNavigation className="pointer-events-auto md:hidden" />
                <DesktopNavigation
                  className="pointer-events-auto hidden md:block"
                  currentPathname={currentPathname}
                />
              </div>
              <div className="flex justify-end md:flex-1">
                <div className="pointer-events-auto">
                  <div className="group flex h-10 items-center gap-4 rounded-full bg-white/90 px-3 py-2 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:ring-white/10">
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(true)}
                      className="flex h-6 w-6 items-center justify-center transition hover:text-zinc-900 dark:hover:text-zinc-100"
                      aria-label="Search"
                    >
                      <SearchIcon className="h-5 w-5 fill-zinc-100 stroke-zinc-500 transition hover:fill-zinc-200 hover:stroke-zinc-700 dark:hidden [@media(prefers-color-scheme:dark)]:fill-violet-50 [@media(prefers-color-scheme:dark)]:stroke-violet-500 [@media(prefers-color-scheme:dark)]:hover:fill-violet-50 [@media(prefers-color-scheme:dark)]:hover:stroke-violet-600" />
                      <SearchIcon className="hidden h-5 w-5 fill-zinc-700 stroke-zinc-500 transition dark:block [@media_not_(prefers-color-scheme:dark)]:fill-violet-400/10 [@media_not_(prefers-color-scheme:dark)]:stroke-violet-500 [@media(prefers-color-scheme:dark)]:hover:stroke-zinc-400" />
                    </button>
                    <div className="h-6 w-px bg-zinc-900/10 dark:bg-white/15" />
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </header>
      {isHomePage && (
        <div
          className="flex-none"
          style={{ height: "var(--content-offset)" }}
        />
      )}
    </>
  );
}
