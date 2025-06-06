export const PHONEPAY_CONFIG = {
  merchantId: process.env.VITE_PHONEPAY_MERCHANT_ID || '',
  merchantName: process.env.VITE_PHONEPAY_MERCHANT_NAME || 'VendorEliteCircle',
  merchantUpiId: process.env.VITE_PHONEPAY_MERCHANT_UPI_ID || '',
  saltKey: process.env.VITE_PHONEPAY_SALT_KEY || '',
  // Add your PhonePe production environment URL
  apiEndpoint: process.env.VITE_PHONEPAY_API_ENDPOINT || 'https://api.phonepe.com/apis/hermes',
  callbackUrl: process.env.VITE_PHONEPAY_CALLBACK_URL || 'https://your-domain.com/payment/callback',
};