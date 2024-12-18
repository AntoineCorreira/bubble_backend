var express = require('express');
var router = express.Router();
const sgMail = require('@sendgrid/mail');

// Configurer SendGrid avec la clé API
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Route pour envoyer un email
router.post('/send', async (req, res) => {
    const { to, subject, text, cc } = req.body;

    if (!to || !subject || !text || !cc) {
        return res.status(400).send({ error: "Missing required fields: to, subject, text" });
    }

    const msg = {
        to: to,
        cc: cc,
        from: 'bubble.moyendegarde@gmail.com', // Une adresse vérifiée sur SendGrid
        subject: subject,
        text: text,
    };

    try {
        await sgMail.send(msg);
        res.status(200).send({ message: "Email sent" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
