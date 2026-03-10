const Stripe = require("stripe");

module.exports = async function handler(req, res) {
  // Configuration pour autoriser les paiements depuis ton site
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // Il va chercher la clé secrète que tu as mise dans Vercel
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const { amount, currency, email } = req.body;

    if (!amount || amount < 50) {
      return res.status(400).json({ error: "Montant trop faible ou invalide" });
    }

    // Création de la session de paiement
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Le montant en centimes (ex: 8500 pour 85€)
      currency: currency || "eur",
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
    });

    // On renvoie le ticket secret au site pour afficher le formulaire
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Erreur Stripe:", error.message);
    res.status(500).json({ error: "Erreur lors de l'initialisation du paiement" });
  }
};
