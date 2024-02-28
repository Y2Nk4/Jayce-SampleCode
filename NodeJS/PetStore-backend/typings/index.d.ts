import 'egg';

declare module 'egg' {
  interface Request{
    rawBody: string;
  }
}

declare module 'stripe' {
  namespace Stripe{
    namespace Event{
      namespace Data {
        interface Object {
          id: string;
          status: string;
          amount_received: number;
          payment_method: string;

          charges: {
            data: Array<{
              id: string,
              outcome: {
                network_status: string;
                reason: string;
                type: string;
              }
              payment_method_details: {
                card: {
                  last4: string
                  network: string
                }
              }
            }>
          }

          last_payment_error?: {
            code: string;
            charge: string;
            decline_code: string;
            message: string;
            payment_method: {
              id: string;
            }
          }
        }
      }
    }
  }
}
