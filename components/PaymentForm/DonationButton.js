import React from 'react'
import styles from '../../components/PaymentForm/payment.module.css'


const DonationButton = ({ donationAmount, currDonation, onChange }) => {
    return (
        <label 
            className={styles.selectAmount}
            style={
                parseInt(donationAmount) === currDonation 
                    ? {color: "#fff",background:"#2e018a"} 
                    : {color: "#2e018a"}
            }
        >
        &pound;{ donationAmount }
        <input 
            type="radio" 
            name="donationAmount" 
            value={donationAmount} 
            onChange={onChange}
        />
        </label>
    )
}

export default DonationButton