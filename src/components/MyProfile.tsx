import { SDK, useGumContext, useProfile } from '@gumhq/react-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import Post from './Post';
import CampaignList, {Campaign as CampaignType} from './CampaignList';

async function getAllPostOfUser(publicKey: PublicKey, sdk: SDK): Promise<any> {
  const result = await sdk.post.getPostsByUser(publicKey);
  
  return result;
}

export function MyProfile() {
  const { sdk } = useGumContext();
  const wallet = useWallet();
  const { publicKey } = wallet;
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  // console.log(publicKey?.toString());
  const fixPublicKey = "AGfqsdpL5hmXmJUQwVXoon38321GFtd58e18ZDtLQHD3";

  useEffect(() => {
    const getData = async () => {
      let data = await getAllPostOfUser(new PublicKey(fixPublicKey), sdk);

      setCampaigns(data as CampaignType[]);
    }

    getData();
  }, [publicKey]);

  return (
      <CampaignList campaigns={campaigns} />
  );
}