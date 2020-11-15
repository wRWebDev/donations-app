import Stripe from 'stripe'

const stripe = new Stripe(process.env.SECRET_KEY)

export default async (req, res) => {

    if( req.method === 'POST' ) {
        try {
            
            const { amount } = req.body;

            if ( amount >= 500 ) {
             
                const paymentIntent = await stripe.paymentIntents.create({
                    amount,
                    currency: "gbp"
                })

                res.status(200).send(paymentIntent.client_secret)

            } else {
                
                throw { message: "Something is wrong with the payment amount" }

            }

        }
        catch ( err ) {

            res.setHeader("Allow", "POST")
            res.status(405).end("Method not allowed.")

        }

    }

}