import { getProfileAccount, getUserAccount } from "@/utils";
import { useCreatePost, useGumContext, useSessionWallet, useUploaderContext } from "@gumhq/react-sdk";
import { GPLCORE_PROGRAMS } from "@gumhq/sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import styles from '@/styles/Home.module.css'
import Post from '@/components/Post';
import Header from "@/components/Header";
import { useRouter } from "next/router";
import { Button, FormControl, FormHelperText, FormLabel, Input, Textarea, useToast } from '@chakra-ui/react';

export type Post = {
  content: {
    content: string;
    format: string;
  };
  type: string;
  authorship: {
    signature: string;
    publicKey: string;
  };
  metadataUri: string;
  transactionUrl: string;
};

export type Campaign = {
  content: {
    nameCampaign: string;
    descriptionCampaign: string;
    imageUrlCampaign: string;
    format: string;
  };
  type: string;
  authorship: {
    signature: string;
    publicKey: string;
  };
  metadataUri: string;
  transactionUrl: string;
}

const CreatePost = () => {
  const [isloadingCampaign, setIsloadingCampaign] = useState(false);
  const [nameCampaign, setNameCampaign] = useState("");
  const [descriptionCampaign, setDescriptionCampaign] = useState("");
  const [imageUrlCampaign, setImageUrlCampaign] = useState("");
  const { sdk } = useGumContext();
  const wallet = useWallet();
  const session = useSessionWallet();
  const { publicKey, sessionToken, createSession, ownerPublicKey, sendTransaction } = session;
  const { handleUpload, uploading, error } = useUploaderContext();
  const { create, createPostError } = useCreatePost(sdk);
  const [user, setUser] = useState<PublicKey | undefined>(undefined);
  const [profile, setProfile] = useState<PublicKey | undefined>(undefined);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const setUp = async () => {
      if (wallet.publicKey) {
        const userAccount = await getUserAccount(sdk, wallet.publicKey);
        if (userAccount) {
          setUser(userAccount);
          const profileAccount = await getProfileAccount(sdk, userAccount);
          if (profileAccount) {
            setProfile(profileAccount);
          } else {
            router.push("/createProfile");
          }
        } else {
          router.push("/createProfile");
        }
      }
    };
    setUp();
  }, [router, sdk, wallet.publicKey]);

  const updateSession = async () => {
    if (!sessionToken) {
      const targetProgramId = GPLCORE_PROGRAMS["devnet"];
      const topUp = true; // this will transfer 0.01 SOL to the session wallet
      const sessionDuration = 60;
      return await createSession(targetProgramId, topUp, sessionDuration);
    }
    return session;
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsloadingCampaign(true);
    e.preventDefault();
    const session = await updateSession();

    if (!session) {
      console.log("missing session");
      toast({
        title: 'missing session',
        description: "missing session",
        status: 'warning',
        duration: 9000,
        isClosable: true,
      })
      setIsloadingCampaign(false);
      return;
    }
    if (!session.sessionToken || !session.publicKey || !session.signMessage || !session.sendTransaction || !profile || !user) {
      console.log(` profile: ${profile} user: ${user}`);
      console.log("missing session or profile or user");
      toast({
        title: 'missing session or profile or user',
        description: "missing session or profile or user",
        status: 'warning',
        duration: 9000,
        isClosable: true,
      })
      setIsloadingCampaign(false);
      return;
    }

    // sign the post with the session wallet
    const nameCampaignArray = new TextEncoder().encode(nameCampaign);
    const signature = await session.signMessage(nameCampaignArray);
    const signatureString = JSON.stringify(signature.toString());

    const campaignMetadata: Campaign = {
      content: {
        nameCampaign,
        descriptionCampaign,
        imageUrlCampaign,
        format: "markdown",
      },
      type: "text",
      authorship: {
        publicKey: session.publicKey.toBase58(),
        signature: signatureString,
      },
      metadataUri: '',
      transactionUrl: '',
    }

    // upload the post to arweave
    const uploader = await handleUpload(campaignMetadata, session);
    if (!uploader) {
      console.log("error uploading post");
      toast({
        title: 'Error Uploading Campaign Metadata',
        description: "Have something wrong when upload metadauri",
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      setIsloadingCampaign(false);
      return;
    }

    // create the post
    const txRes = await create(uploader.url, profile, user, session.publicKey, new PublicKey(session.sessionToken), session.sendTransaction).catch((error) => console.log(error));
    if (!txRes) {
      console.log("error creating post");
      console.log(createPostError);
      toast({
        title: 'Create Campaign Error',
        description: "Have something wrong when create Campaign",
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      setIsloadingCampaign(false);
      return;
    }
    setIsloadingCampaign(false);
    toast({
      title: 'Create Success Campaign',
      description: "Your Campaign is created now We will review your campaign :> ",
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
    setTimeout(() => {
      router.push('/');
    }, 3000)
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <form onSubmit={handleSubmit} style={{ width: '600px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
            <FormControl>
              <FormLabel> Name Campaign </FormLabel>
              <Input type="text" placeholder="Share the name Campagin you want people to contribute" value={nameCampaign} onChange={(event) => setNameCampaign(event.target.value)} />
            </FormControl>

            <FormControl style={{ marginTop: "30px" }}>
              <FormLabel>Description about your Campaign</FormLabel>
              <Textarea
                placeholder="Share the name Campagin you want people to contribute"
                size="md"
                value={descriptionCampaign} onChange={(event) => setDescriptionCampaign(event.target.value)}
              />
            </FormControl>

            <FormControl style={{ marginTop: "30px" }}>
              <FormLabel>Image Url</FormLabel>
              <Input type="text" placeholder="Send us image to tell about your campaign" value={imageUrlCampaign} onChange={(event) => setImageUrlCampaign(event.target.value)} />
            </FormControl>

            <Button
              style={{ marginTop: "30px" }}
              colorScheme="whatsapp"
              type="submit"
              isLoading={isloadingCampaign}
            >
              Submit
            </Button>
          </form>
        </div>
      </main>
    </>
  );
};

export default CreatePost;