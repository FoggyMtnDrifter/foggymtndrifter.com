import type { APIRoute } from "astro";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
});

export const prerender = false;

export const POST: APIRoute = async ({ request, site }) => {
  try {
    // Check if we have a body
    const body = await request.text();
    if (!body) {
      return new Response(
        JSON.stringify({ error: "Request body is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { amount, isRecurring } = parsedBody;

    // Validate amount
    if (!amount || amount < 1) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid amount" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const siteUrl =
      import.meta.env.PUBLIC_SITE_URL || site || "http://localhost:4321";

    // If recurring, first create or retrieve the product and price
    let priceId: string | undefined;
    if (isRecurring) {
      // Create or retrieve the product for recurring tips
      const product = await stripe.products.create({
        name: "Monthly Tip",
        description: "Monthly support - thank you!",
      });

      // Create a recurring price for this amount
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: amount * 100, // Convert to cents
        currency: "usd",
        recurring: {
          interval: "month",
        },
      });

      priceId = price.id;
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          ...(isRecurring
            ? {
                price: priceId,
                quantity: 1,
              }
            : {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: "One-time Tip",
                    description: "Thank you for your support!",
                  },
                  unit_amount: amount * 100, // Convert to cents
                },
                quantity: 1,
              }),
        },
      ],
      mode: isRecurring ? "subscription" : "payment",
      success_url: `${siteUrl}/#thank-you-${
        isRecurring ? "subscription" : "tip"
      }`,
      cancel_url: `${siteUrl}/#tipme`,
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create checkout session" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
