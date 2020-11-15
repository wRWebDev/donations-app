import React from 'react'
import PaymentForm from './PaymentForm'

import styles from '../../components/PaymentForm/payment.module.css'
 
const Payment = () => {

    return (
        <div className={styles.paymentElement}>
            <PaymentForm />
        </div>
    )
}

export default Payment