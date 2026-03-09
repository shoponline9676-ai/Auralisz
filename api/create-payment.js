const Stripe = require("stripe");

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const { amount, currency, email } = req.body;

    if (!amount || amount < 50) {
      return res.status(400).json({ error: "Montant invalide" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   Math.round(amount),
      currency: currency || "eur",
      receipt_email: email || undefined,
      automatic_payment_methods: { enabled: true },
      metadata: { source: "auralizs-zs" }
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({ error: "Erreur Stripe" });
  }
};
