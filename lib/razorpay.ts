import Razorpay from 'razorpay';
import crypto from 'crypto';

if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Missing Razorpay environment variables');
}

export const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const verifyPaymentSignature = (
    orderId: string,
    paymentId: string,
    signature: string
): boolean => {
    const text = `${orderId}|${paymentId}`;
    const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(text)
        .digest('hex');

    return generated_signature === signature;
};

export const createRazorpayOrder = async (amount: number, receipt: string) => {
    const options = {
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        receipt,
        payment_capture: 1,
    };

    return await razorpay.orders.create(options);
};
