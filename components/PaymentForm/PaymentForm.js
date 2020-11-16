import React, { useState, useEffect } from 'react'
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
  const donationAmounts = [5, 10, 20]
  const [donation, setDonationTo] = useState(5)
  const [coverFees, setCoverFeesTo] = useState(true)
  const [total, setTotalTo] = useState(5)
  useEffect(()=>{tallyTotal()}, [coverFees, donation])


  const tallyTotal = () => {

    let newTotal = coverFees 
      ? (donation * 1014 + 200) / 1000
      : donation

    setTotalTo(newTotal)

  }

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
        fontSize: "16px",
        '::placeholder': {
          color: "#9790a4",
          fontStyle: "italic"
        },
        iconColor: "#9790a4",
      },
      invalid: {
        color: "#C61A1A",
        iconColor: "#C61A1A"
      },
    },
    hidePostalCode: true
  }

  // Change the donation amount
  const handleRadios = e => {
    setDonationTo(parseInt(e.target.value))
    tallyTotal()
  }

  // Print donation buttons
  const donationButtons = donationAmounts.map(price => {
    return (
      <DonationButton 
        donationAmount={price} 
        currDonation={donation} 
        onChange={handleRadios} 
      />
    )
  })


  // Handler for the fees checkbox
  const toggleFeeStatus = e => {
    setCoverFeesTo(!coverFees)
  }

    
  // Show the form
  return (
      <form onSubmit={handleSubmit}>

        <header>Choose how much to donate</header>

        <div className={styles.donationSelectionContainer}>
          {donationButtons}
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

        <label className={styles.smallLabelText}>
          <input 
            type="checkbox" 
            name="feesConsent" 
            checked={coverFees} 
            onChange={toggleFeeStatus} 
          />
          <span>Help cover our transaction fees,
          and get your full £{donation} to helping beat cancer!</span>
        </label>
        
        {checkoutError && <div className="checkoutError">{checkoutError}</div>}

        <button 
          type="submit" 
          disabled={!stripe}
        >
            {isProcessing ? 'Processing...' : `Give £${total}`}
        </button>

      </form>
  )
}