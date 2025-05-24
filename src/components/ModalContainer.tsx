import { Fragment, useState, useEffect, useRef } from "react";
import { useModal } from "@/components/ModalContext";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/Button";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(
  import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

// Simple icons (you can replace these with your preferred icon library)
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

function CoffeeIcon(props: React.ComponentPropsWithoutRef<"svg">) {
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
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke="currentColor" />
      <path
        d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"
        stroke="currentColor"
      />
      <path d="M6 1v3" stroke="currentColor" />
      <path d="M10 1v3" stroke="currentColor" />
      <path d="M14 1v3" stroke="currentColor" />
    </svg>
  );
}

function HeartIcon(props: React.ComponentPropsWithoutRef<"svg">) {
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
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke="currentColor"
      />
    </svg>
  );
}

// Pre-defined tip amounts
const tipOptions = [5, 10, 25, 50, 100];

export function ModalContainer() {
  const {
    isTipModalOpen,
    isThankYouModalOpen,
    closeTipModal,
    closeThankYouModal,
  } = useModal();

  const [amount, setAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isSubscriptionThankYou, setIsSubscriptionThankYou] = useState(false);

  // Check URL hash when thank you modal opens or hash changes
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      const isSubscription = hash === "#thank-you-subscription";
      const isOneTime = hash === "#thank-you-tip";

      setIsSubscriptionThankYou(isSubscription);

      // Track payment completion events
      if (typeof window !== "undefined" && (window as any).rybbit) {
        if (isSubscription) {
          (window as any).rybbit.event("new_recurring_tip", {
            amount: amount,
          });
        } else if (isOneTime) {
          (window as any).rybbit.event("new_tip", {
            amount: amount,
          });
        }
      }
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, [isThankYouModalOpen, amount]);

  const handleAmountClick = (amount: number, index: number) => {
    setAmount(amount);
    setSelectedOption(index);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    setCustomAmount(value);
    if (value !== "" && value >= 1) {
      setAmount(value);
      setSelectedOption(-1);
    }
  };

  const handleTipSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, isRecurring }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          console.error("Stripe checkout error:", error);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Tip Modal */}
      <Transition.Root show={isTipModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={closeTipModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 z-[100] bg-zinc-400/25 backdrop-blur-sm dark:bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-2xl ring-1 ring-black/5 transition-all sm:my-8 sm:w-full dark:bg-zinc-900 dark:ring-white/10">
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md text-zinc-400 hover:text-zinc-500 focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:outline-none dark:focus:ring-violet-400 dark:focus:ring-offset-zinc-900"
                      onClick={closeTipModal}
                    >
                      <span className="sr-only">Close</span>
                      <CloseIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center">
                      <CoffeeIcon className="h-6 w-6 flex-none fill-zinc-100 text-black dark:fill-zinc-100/10 dark:text-white" />
                      <Dialog.Title
                        as="h3"
                        className="ml-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                      >
                        Buy Me a Coffee
                      </Dialog.Title>
                    </div>

                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      Your support helps me continue building tools and creating
                      content that benefits the open source community.
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
                      {tipOptions.map((tipAmount, index) => (
                        <button
                          key={tipAmount}
                          onClick={() => handleAmountClick(tipAmount, index)}
                          className={`relative rounded-md px-3 py-2 text-sm font-medium ${
                            selectedOption === index
                              ? "bg-violet-600 text-white dark:bg-violet-400 dark:text-zinc-900"
                              : "bg-zinc-50 text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                          } transition focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:focus-visible:outline-violet-400`}
                        >
                          ${tipAmount}
                        </button>
                      ))}
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Custom Amount
                      </label>
                      <div className="relative mt-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-zinc-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          min="1"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          placeholder="Enter amount"
                          aria-label="Custom tip amount in USD"
                          className="w-full appearance-none rounded-md bg-white px-3 py-2 pl-7 shadow-sm outline outline-1 outline-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-600 focus:outline-violet-600 sm:text-sm dark:bg-zinc-700/50 dark:text-zinc-200 dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-violet-400 dark:focus:outline-violet-400"
                        />
                      </div>
                    </div>

                    <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                      <div className="flex items-center">
                        <button
                          role="switch"
                          aria-checked={isRecurring}
                          onClick={() => setIsRecurring(!isRecurring)}
                          className={`${
                            isRecurring
                              ? "bg-violet-600 dark:bg-violet-400"
                              : "bg-zinc-200 dark:bg-zinc-700"
                          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:outline-none dark:focus:ring-violet-400 dark:focus:ring-offset-zinc-900`}
                        >
                          <span className="sr-only">
                            Make this a monthly recurring tip
                          </span>
                          <span
                            aria-hidden="true"
                            className={`${
                              isRecurring
                                ? "translate-x-5 bg-white"
                                : "translate-x-0 bg-white dark:bg-zinc-200"
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </button>
                        <label
                          onClick={() => setIsRecurring(!isRecurring)}
                          className="ml-3 cursor-pointer text-sm font-medium text-zinc-900 select-none dark:text-zinc-100"
                        >
                          Make this a monthly recurring tip
                        </label>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center">
                      <div className="min-w-0 flex-auto text-sm text-zinc-900 dark:text-zinc-100">
                        <p>
                          Total:{" "}
                          <span className="font-semibold">${amount}</span>
                          {isRecurring && (
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                              {" "}
                              per month
                            </span>
                          )}
                        </p>
                        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                          Secure payment via Stripe{" "}
                          {isRecurring && "• Cancel anytime"}
                        </p>
                      </div>
                      <Button
                        onClick={handleTipSubmit}
                        disabled={isLoading}
                        variant="secondary"
                        className="group ml-4 flex-none"
                      >
                        {isLoading
                          ? "Processing..."
                          : isRecurring
                          ? "Subscribe"
                          : "Send Tip"}
                      </Button>
                    </div>

                    <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
                      Need to cancel a recurring tip?{" "}
                      <a
                        href="/cancel-subscription"
                        onClick={closeTipModal}
                        className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                      >
                        Click here
                      </a>
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Thank You Modal */}
      <Transition.Root show={isThankYouModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[100]"
          onClose={closeThankYouModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 z-[100] bg-zinc-400/25 backdrop-blur-sm dark:bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-2xl ring-1 ring-black/5 transition-all sm:my-8 sm:w-full dark:bg-zinc-900 dark:ring-white/10">
                  <div className="text-center">
                    <HeartIcon className="mx-auto h-10 w-10 text-violet-600 dark:text-violet-400" />
                    <Dialog.Title
                      as="h3"
                      className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100"
                    >
                      Thank You!
                    </Dialog.Title>
                    <div className="mt-3">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {isSubscriptionThankYou
                          ? "Thank you so much for becoming a monthly supporter! Your recurring contribution means the world to me and helps ensure I can continue creating content and maintaining open source projects. You can cancel your subscription anytime."
                          : "Thank you so much for your generous tip! Your support means the world to me and helps me continue creating content and maintaining open source projects."}
                      </p>
                    </div>
                    <div className="mt-5">
                      <Button
                        onClick={closeThankYouModal}
                        variant="secondary"
                        className="group"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
