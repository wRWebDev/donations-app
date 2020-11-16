import React, { useState } from 'react'
import Router from 'next/router'
import { CardElement,  useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios'

import DonationButton from './DonationButton'

import styles from '../../components/PaymentForm/payment.module.css'

export default function PaymentForm() {
  
  // For Stripe
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setProcessingTo] = useState(false);
  const [checkoutError, setCheckoutError] = useState();
  
  // For Donation Amount
  const [donation, setDonationTo] = useState(5);

  // Handle Payment
  const handleSubmit = async e => {

    // Prevent default form action
    e.preventDefault();

    // If stripe hasn't loaded, don't allow a submit
    if (!stripe || !elements) {
      return;
    }
  
    // Get billing details
    const billingDetails = {
      name: e.target.name.value,
      email: e.target.email.value,
      address: {
        postal_code: e.target.postCode.value,
      }  
    }
    
    // Get card details
    const cardElement = elements.getElement(CardElement);
    
    // Set state to reflect that we're working in the background
    // Affects payment button text
    setProcessingTo(true)
    
    try{
      // Get payment token for 
      const { data: clientSecret } = await axios.post('/api/payment_intent', {
        amount: donation * 100
      })
      
      // Make a payment request
      const paymentMethodReq = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails
      })

      // Get confirmation of payment
      const confirmedCardPayment = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodReq.paymentMethod.id
      })

      Router.push("/booking/thankyou")

    }catch(err){
      setProcessingTo(false)
      setCheckoutError(err.message)
    }

  };

  // Styling of card details input
  const cardOptions = {
    style: {
      base: {
        color: "#E40385",
        fontSize: "16px"
      },
      invalid: {
        color: "#C61A1A"
      },
    },
    hidePostalCode: true
  }

  // Change the donation amount
  const handleRadios = e => {
    setDonationTo(parseInt(e.target.value))
  }
    
  // Show the form
  return (
      <form onSubmit={handleSubmit}>

        <header>Choose how much to donate</header>

        <div className={styles.donationSelectionContainer}>
          <DonationButton donationAmount="5" currDonation={donation} onChange={handleRadios} />
          <DonationButton donationAmount="10" currDonation={donation} onChange={handleRadios} />
          <DonationButton donationAmount="20" currDonation={donation} onChange={handleRadios} />
        </div>

        <input 
          type="text" 
          name="name" 
          placeholder="Jane Doe">
        </input>

        <input 
          type="email" 
          name="email" 
          placeholder="jane.doe@email.com">
        </input>

        <input 
          type="text" 
          name="postCode" 
          placeholder="W1U 4BN">
        </input>

        <CardElement options={cardOptions}/>
        
        {checkoutError && <div className="checkoutError">{checkoutError}</div>}

        <button 
          type="submit" 
          disabled={!stripe}>{isProcessing ? 'Processing...' : 'Pay'}
        </button>

      </form>
  )
}