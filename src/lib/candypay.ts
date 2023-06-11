import { CandyPay } from "@candypay/checkout-sdk";

export class CandyPayClass {
  
  static transaction = async () => {
    const sdk = new CandyPay({
      api_keys: {
        private_api_key: "cp_private_34eE8QpM_13MWtYVsWFy18xwW7Nw1n8XX",
        public_api_key: "cp_public_VS5PvDGq_8kwcnrJn1TjgR3EsA7BGKHJD",
      },
      network: "devnet", // use 'mainnet' for prod and 'devnet' for dev environment
      config: {
        collect_shipping_address: false,
      },
    });
    const response = await sdk.session.create({
      success_url: `http://localhost:3000/success`,
      cancel_url: `http://localhost:3000/cancel`,
      // additional SPL tokens, SOL and USDC are the supported tokens by default
      tokens: ["dust", "samo"],
      items: [
        {
          name: "Solana Shades",
          // price in USD
          price: 0.1,
          image: "https://imgur.com/M0l5SDh.png",
          quantity: 1,
          // optional product size parameter
          size: "9",
        },
      ],
      shipping_fees: 0.5,
      // metadata: {
      //   campaignId:
      // }
    });

    return response;
  }
}
