const nodemailer = require('nodemailer');
require('dotenv').config();

const Sendmail = async (email, title, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: process.env.MAIL_PORT == 465, // Corrected comparison
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS // Corrected environment variable name
            }
        });

        const htmlbody = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Code</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background: #ffffff;
                    padding: 0;
                    border-radius: 15px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(90deg, #ff7e5f, #feb47b);
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 700;
                }
                .content {
                    padding: 30px 20px;
                    text-align: center;
                }
                .content p {
                    margin: 15px 0;
                    font-size: 16px;
                    line-height: 1.6;
                    color: #555555;
                }
                .otp {
                    font-size: 36px;
                    font-weight: bold;
                    color: #ff7e5f;
                    margin: 25px 0;
                    background: #ffe4e1;
                    padding: 10px;
                    border-radius: 10px;
                    display: inline-block;
                }
                .footer {
                    padding: 20px;
                    text-align: center;
                    background: #f8f8f8;
                    font-size: 14px;
                    color: #777;
                }
                .footer p {
                    margin: 5px 0;
                }
                .footer a {
                    color: #ff7e5f;
                    text-decoration: none;
                    font-weight: 600;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Verification Code</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>Thank you for registering with us. Your verification code is:</p>
                    <div class="otp">${otp}</div>
                    <p>This code is valid for 5 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        const sendmail = await transporter.sendMail({
            from: process.env.MAIL_USER, 
            to: email,
            subject: title,
            html: htmlbody
        });

        console.log("Mail sent", sendmail);
        return sendmail;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = Sendmail;
