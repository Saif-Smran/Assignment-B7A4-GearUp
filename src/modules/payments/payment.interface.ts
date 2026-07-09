export type PaymentProvider = "STRIPE";

export interface CreatePaymentPayload {
	rentalOrderId: string;
	provider?: PaymentProvider;
}

export interface ConfirmPaymentPayload {
	id?: string;
	type?: string;
	paymentIntentId?: string;
	payment_status?: string;
	payment_intent?: string;
	transactionId?: string;
	rentalOrderId?: string;
	status?: "succeeded" | "failed" | "canceled";
	data?: {
		object?: {
			id?: string;
			client_reference_id?: string;
			payment_intent?: string;
			payment_status?: string;
			status?: string;
			metadata?: {
				rentalOrderId?: string;
			};
		};
	};
}
