const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// These keys will be securely loaded via your cloud dashboard later
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || "MOCK_TOKEN";
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "MOCK_ID";
const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "property_ai_token_123";

// 1. FACEBOOK/META WEBHOOK HANDSHAKE CHECKER
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('✅ Webhook connection successfully validated by Meta Cloud API!');
            return res.status(200).send(challenge);
        }
        return res.sendStatus(403);
    }
});

// 2. INBOUND MESSAGE PROCESSING CORE
app.post('/webhook', async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const messageObject = changes?.value?.messages?.[0];
        const contactObject = changes?.value?.contacts?.[0];

        if (!messageObject) return res.sendStatus(200);

        const buyerPhone = messageObject.from; 
        const buyerName = contactObject?.profile?.name || "Valued Customer";
        const incomingText = messageObject.text?.body || "";

        console.log(`📩 Inbound text received from ${buyerName} (${buyerPhone}): "${incomingText}"`);

        // Pattern matching engine to check if text contains "Property ID: REGION-LOC-NUM"
        const qrPattern = /Property ID:\s*([A-Z]{3}-[A-Z]{4}-\d+)/i;
        const match = incomingText.match(qrPattern);

        if (match) {
            const extractedPropertyId = match[1].toUpperCase();
            console.log(`🎯 Valid QR code scan detected! Target ID: ${extractedPropertyId}`);
            await deliverPropertyMediaImmediate(buyerPhone, buyerName, extractedPropertyId);
        } else {
            console.log(`ℹ️ Standard text detected. Triggering requirement triage flow...`);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('System handling error:', error.message);
        res.sendStatus(200); // Always send 200 back to Meta to keep your webhook healthy
    }
});

async function deliverPropertyMediaImmediate(toPhone, customerName, propertyId) {
    console.log(`🚀 Dispatching media brochure file package to ${toPhone} for listing: ${propertyId}`);
}

// Start the local testing webhook server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🤖 Property AI WhatsApp Bot Engine is running on port ${PORT}`);
    console.log(`👉 Your Verification Token is: ${VERIFY_TOKEN}`);
    console.log(`--- Run verification verification test now ---`);
});