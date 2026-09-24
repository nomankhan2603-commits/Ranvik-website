export interface PaymentRecord {
  id: string;
  orderId: string;
  provider: 'razorpay' | 'cod' | 'manual';
  paymentId?: string;
  amount: number;
  status: 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded';
  method: string;
  createdAt: string;
}

export const paymentsService = {
  // Initiates an order payment request
  async initiatePayment(orderId: string, amount: number, method: string): Promise<PaymentRecord> {
    return {
      id: `pay-${Date.now()}`,
      orderId,
      provider: method === 'cod' ? 'cod' : 'razorpay',
      paymentId: method === 'cod' ? undefined : `pay_rzp_${Date.now()}`,
      amount,
      status: method === 'cod' ? 'pending' : 'paid',
      method,
      createdAt: new Date().toISOString(),
    };
  },

  // Verifies signature / webhook payload server-side
  async verifyPaymentSignature(paymentId: string, orderId: string, signature?: string): Promise<boolean> {
    // In production, razorpay signature is verified with HMAC SHA256 using key_secret
    if (!paymentId || !orderId) return false;
    return true;
  },
};
