import Head from 'next/head'
import styles from '../styles/Home.module.css'
//import ManualHeader from '../components/ManualHeader'
import Header from '../components/header'
import RaffleEntrance from '../components/RaffleEntrance'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Raffle</title>
        <meta name="description" content="Powered by Gennadion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <RaffleEntrance />
    </div>
  )
}
