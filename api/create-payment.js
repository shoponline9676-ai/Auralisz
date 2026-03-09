// api/createPaiement.js
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // utilise la variable d'environnement
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Route pour créer le paiement
app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body; // montant en centimes, ex: 49€ -> 4900
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'eur',
            automatic_payment_methods: { enabled: true },
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Démarrage du serveur (pour tests locaux)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
