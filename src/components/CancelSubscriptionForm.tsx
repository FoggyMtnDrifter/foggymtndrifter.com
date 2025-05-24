"use client";

import { useState } from "react";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { AnalyticsLink } from "@/components/AnalyticsLink";

export function CancelSubscriptionForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Your subscription has been successfully cancelled.");

        // Track successful subscription cancellation
        if (typeof window !== "undefined" && (window as any).rybbit) {
          (window as any).rybbit.event("subscription_cancelled", {
            location: window.location.pathname,
          });
        }
      } else {
        setStatus("error");
        setMessage(
          data.error ||
            "An error occurred while cancelling your subscription. Please try again."
        );
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        "An error occurred while cancelling your subscription. Please try again."
      );
    }
  };

  return (
    <Container className="mt-16 sm:mt-32">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
          Cancel Tip
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          To cancel your monthly recurring tip, please enter the email address
          that was used to send your receipt. If you aren&apos;t sure which
          email was used, please reach out to me at{" "}
          <AnalyticsLink
            href="mailto:michael@foggymtndrifter.com"
            eventName="email_click"
            eventProps={{ context: "subscription_cancellation" }}
            className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
          >
            michael@foggymtndrifter.com
          </AnalyticsLink>
          .
        </p>

        <form onSubmit={handleSubmit} className="mt-10">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full appearance-none rounded-md border border-zinc-200 bg-white px-3 py-2 shadow-sm placeholder:text-zinc-400 focus:border-violet-600 focus:ring-violet-600 focus:outline-none sm:text-sm dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-violet-400 dark:focus:ring-violet-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="secondary"
              disabled={status === "loading"}
              className="w-full"
            >
              {status === "loading" ? "Processing..." : "Cancel Tip"}
            </Button>
          </div>
        </form>

        {message && (
          <div
            className={`mt-6 rounded-md p-4 ${
              status === "success"
                ? "bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-200"
                : "bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-200"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </Container>
  );
}
