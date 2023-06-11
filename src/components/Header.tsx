import Head from 'next/head';
import WalletMultiButtonDynamic from './WalletMultiButtonDynamic';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import Style from '@/styles/components/GumUserCreateButton.module.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { GumUserCreateButton } from './CreateUserButton';

const Header = () => {
  const wallet = useWallet();
  const { publicKey } = wallet;
  const router = useRouter();
 

  return (
    <>
      <Head>
        <title>Crown funding</title>
        <link rel="icon" href="https://cdn1.vectorstock.com/i/1000x1000/37/20/crowdfunding-mercy-logo-vector-30103720.jpg" />
      </Head>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image src="https://gum.fun/_next/static/media/gum.7b85652b.svg" alt="Gum Logo" width={150} height={100} />
        </div>
        <div className={styles.wallet} style={{ display: 'flex' }}>
          <GumUserCreateButton />
          <button 
            className={`${Style.button} ${!publicKey || router.pathname === '/createPost' ? Style.disabled : ''}`} 
            style={{ margin: "0 20px" }}
            onClick={() => {
              router.push('/createPost')
            }}
          >
            Create Campaign
          </button>
          <WalletMultiButtonDynamic />
        </div>
      </header>
    </>
  );
};

export default Header;
