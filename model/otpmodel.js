const mongoose = require('mongoose');
const Sendmail = require('../util/MailSender');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5, // 5 minutes
    },
}, { timestamps: true });

async function verification(email, otp) {
    try {
        const responsemail = await Sendmail(email, "Verification from Viplaw", otp);
        console.log("Mail sent:", responsemail);
    } catch (error) {
        console.error("Error in verification function:", error.message);
    }
}

otpSchema.pre('save', async function (next) {
    try {
        await verification(this.email, this.otp);
        next(); // Ensure next() is called to proceed with saving the document
    } catch (error) {
        console.error(error.message);
        next(error); // Pass the error to the next middleware
    }
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = {
    Otp,
};
