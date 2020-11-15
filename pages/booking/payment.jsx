import { useState } from 'react'
import Router from 'next/router'

import Layout from '../../components/Layout'
import Payment from '../../components/PaymentForm'

const PaymentPage = () => {
 
    return (
        <Layout title="Donate">
            <main>

                <Payment />

            </main>

        </Layout>
    )

}

export default PaymentPage