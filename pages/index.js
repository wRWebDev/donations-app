import Link from 'next/link'
import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout title="Relay For Life">
      <main>
        <h1>RELAY FOR LIFE</h1>
        <Link href="/booking/payment"><a>Donate now</a></Link>
      </main>
    </Layout>
  )
}
