import { useState } from 'react'
import Router from 'next/router'
import Link from 'next/link'


import Layout from '../../components/Layout'

const PageContent = () => {
 
    return (
        <Layout title="Donate">
            <main>
                <h1>Thank you for your kind donation!</h1>
                <Link href="/"><a>Return home</a></Link>
            </main>
        </Layout>
    )

}

export default PageContent