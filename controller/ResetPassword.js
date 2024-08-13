const {User} = require('../model/User');
const MailSender = require('../util/MailSender');
const bcrypt = require('bcrypt'); 
const crypto = require('crypto'); 
const {HttpStatusCode}=require('axios');
exports.resetLink = async (req, res) => {
    try {
        // taking email from user
        const { email } = req.body;

        // checking if user is present
        const IsUser = await User.findOne({ email });
        if (!IsUser) { // Check if user does not exist
            return res.status(HttpStatusCode.Unauthorized).json({
                success: false,
                message: "User not found or unauthorized"
            });
        }

        // create link using uuid
        const token = crypto.randomUUID();
        const tokenExpire = Date.now() + 300000; // Token expires in 5 minutes

        // update user with token and tokenExpire
        await User.findOneAndUpdate(
            { email },
            { token, tokenExpire },
            { new: true }
        );

        const resetLink = `http://localhost:3000/reset-password?token=${token}`;
        const mailBody = `
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f0f2f5;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 30px auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    border: 1px solid #eaeaea;
                }
                h2 {
                    color: #444;
                    font-size: 24px;
                    margin-top: 0;
                }
                p {
                    font-size: 16px;
                    margin-bottom: 20px;
                    color: #555;
                }
                .token {
                    font-size: 18px;
                    color: #000;
                    font-weight: bold;
                    background-color: #f1f1f1;
                    padding: 10px;
                    border-radius: 4px;
                    display: inline-block;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 14px;
                    color: #888;
                    text-align: center;
                }
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    font-size: 16px;
                    color: #ffffff;
                    background-color: #007bff;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                    transition: background-color 0.3s ease;
                }
                .button:hover {
                    background-color: #0056b3;
                }
                .link {
                    word-wrap: break-word;
                    color: #007bff;
                    text-decoration: none;
                }
                .link:hover {
                    text-decoration: underline;
                }
            </style>
            <div class="container">
                <h2>Password Reset Request</h2>
                <p>Hello,</p>
                <p>You requested a password reset. Please use the following token to reset your password:</p>
                <p class="token">${token}</p>
                <p>This token is valid for 5 minutes.</p>
                <p>Alternatively, you can reset your password by clicking the button below:</p>
                <a href="${resetLink}" class="button">Reset Password</a>
                <p>If the button above does not work, copy and paste the following link into your browser:</p>
                <p><a href="${resetLink}" class="link">${resetLink}</a></p>
                <p>If you did not request a password reset, please ignore this email or contact support if you have any concerns.</p>
                <div class="footer">
                    <p>Thanks,<br/>The PW Walla Team</p>
                </div>
            </div>
        `;

        const sendMail = await MailSender(email, "Reset Password", mailBody);
        if (sendMail) {
            return res.status(HttpStatusCode.Ok).json({
                success: true,
                message: `Reset link has been sent to ${email}`
            });
        } else {
            return res.status(HttpStatusCode.InternalServerError).json({
                success: false,
                message: "Failed to send the reset email. Please try again later."
            });
        }
    } catch (error) {
        console.error('Error in resetLink:', error);
        return res.status(HttpStatusCode.InternalServerError).json({
            success: false,
            message: "Internal server error"
        });
    }
};

   //..................reset password..................//
   
exports.resetPassword = async (req, res) => {
    try {
        let { newPassword, token } = req.body;

        // Check if all required fields are provided
        if (!newPassword || !token) {
            return res.status(HttpStatusCode.InternalServerError).json({
                success: false,
                message: "Please provide new password, and token."
            });
        }

        // Find user by token
        const user = await User.findOne({ 
            token: token, 
            tokenExpire: { $gt: Date.now() } 
        });
        if (!user) {
            return res.status(HttpStatusCode.InternalServerError).json({
                success: false,
                message: "Invalid or expired token."
            });
        }
        user.password = newPassword; // Assuming you have middleware to hash this
        user.token = undefined;
        user.tokenExpire = undefined;
        await user.save();

        return res.status(HttpStatusCode.Ok).json({
            success: true,
            message: "Password updated successfully."
        });

    } catch (error) {
        console.error('Error in resetPassword:', error);
        return res.status(HttpStatusCode.InternalServerError).json({
            success: false,
            message: "Internal server error"
        });
    }
};


