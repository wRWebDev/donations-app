import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>RELAY FOR LIFE</h1>
      <Link href="/booking/payment"><a>Donate now</a></Link>
    </main>
  )
}
