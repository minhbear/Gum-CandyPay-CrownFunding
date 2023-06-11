import { CandyPayClass } from '@/lib/candypay';
import styles from '@/styles/Home.module.css'
import Image from 'next/image';
import { useRouter } from 'next/router';

const Post = ({ posts }: any) => {
  const router = useRouter();  

  return (
    <div className={styles.postList}>
      {posts.map((post: any, index: number) => (
        <div className={styles.post} key={index}>
          <div className={styles.postContent}>
            <div className={styles.postText}>{post.content.content}</div>
          </div>
          <div className={styles.logos}>
            <a href={post.metadataUri} target="_blank" rel="noopener noreferrer">
              <Image className={styles.logo} src="https://seeklogo.com/images/A/arweave-ar-logo-7458401CAE-seeklogo.com.png" alt="Arweave Metadata" width={20} height={20} />
            </a>
            <a href={post.transactionUrl} target="_blank" rel="noopener noreferrer">
              <Image className={styles.logo} src="https://seeklogo.com/images/S/solana-sol-logo-12828AD23D-seeklogo.com.png" alt="Solana Tx" width={20} height={20} />
            </a>
          </div>
          <div>
           
          </div>
        </div>
      ))}
    </div>
  );
};

export default Post;

{/* <button
onClick={() => {
  CandyPayClass.transaction().then((data) => {
    window.location.href = data.payment_url
  })
}}
>Donate me</button>
<button
onClick={() => {
  router.push('/view/55')
}}
>
Go to detail
</button> */}