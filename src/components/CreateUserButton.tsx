import { useCreateUser, useGumContext } from '@gumhq/react-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from '@/styles/components/GumUserCreateButton.module.css';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export function GumUserCreateButton(): JSX.Element {
  const { sdk } = useGumContext();
  const { publicKey } = useWallet();
  const { create, isCreatingUser, createUserError } = useCreateUser(sdk);
  const toast = useToast();
  const router = useRouter();

  const handleClick = async () => {
    if (publicKey) {
      await create(publicKey);
      toast({
        title: 'Create user success',
        description: "Create user success",
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      setTimeout(() => {
        router.push('/createProfile');
      }, 3000);
    }
  };

  

  return (
    <>
      {sdk && (
        <button
          className={`${styles.button} ${isCreatingUser ? styles.disabled : ''}`}
          onClick={handleClick}
          disabled={isCreatingUser}
        >
          {isCreatingUser ? 'Creating User...' : 'Create User'}
        </button>
      )}
      {createUserError && (
        <p className={styles.error}>{createUserError.message}</p>
      )}
    </>
  );
}
