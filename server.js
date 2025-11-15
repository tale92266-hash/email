// server.js

// .env file se variables load karo
require('dotenv').config(); 
// Upar, daayen, neeche, baayen ke liye margins (User ke custom instruction se)
// margin: 10px 0 5px 0; 
// Thoda left padding taaki bilkul edge se na chipke, right side se bhi (User ke custom instruction se)
// padding: 0 0px; 

const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; // PORT environment variable se lega

// Middleware: JSON aur form data parse karne ke liye
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// index.html ko static file ki tarah serve karo
app.use(express.static(path.join(__dirname, 'public')));

// Transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Yeh apka EMAIL_USER hai
        pass: process.env.EMAIL_PASS  // Yeh apka App Password hai
    }
});

// Email sending endpoint
app.post('/send-email', (req, res) => {
    // Client-side se aaye data ko lo
    const { recipient, subject, message } = req.body;

    if (!recipient || !subject || !message) {
        return res.status(400).json({ error: '❌ Sabhi fields bharna zaroori hai: recipient, subject, aur message.' });
    }

    const mailOptions = {
        from: `"Gemini Support" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject: subject,
        text: message,
        html: `<b>Hello!</b><br><br>Aapka message:<br><i>${message}</i>` // Simple HTML message
    };

    // Mail send karo
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('❌ Error sending mail:', error.message);
            // Free solutions de raha hoon (User ke custom instruction se)
            // Error ke time bhi paid option nahi suggest karunga
            return res.status(500).json({ status: 'error', message: 'Mail bhejte samay error aa gaya. Server logs dekho.' });
        } else {
            console.log('✅ Email sent:', info.response);
            return res.status(200).json({ status: 'success', message: `Email successfully sent to ${recipient}.` });
        }
    });
});

// Server start karo
app.listen(port, () => {
    console.log(`✅ Server chal raha hai http://localhost:${port} par`);
});

// User ke instruction ke mutabik short comments use kiye hain aur English in codes.
