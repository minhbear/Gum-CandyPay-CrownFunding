import { gql } from 'graphql-request';
import * as anchor from "@project-serum/anchor";
import { SDK } from '@gumhq/react-sdk';

export interface GraphQLProfileMetadata {
  metadata_uri: string;
  metadata: string;
  profile: string;
  address: string;
}

export async function getProfileMetadataByProfile(profileAccount: anchor.web3.PublicKey, sdk: SDK): Promise<GraphQLProfileMetadata> {
  const query = gql`
    query GetProfileMetadataByProfile($profileAccount: String) {
      profile_metadata(where: { profile: { _eq: $profileAccount } }) {
        address
        metadata_uri
        metadata
        profile
        slot_created_at
        slot_updated_at
      }
    }
  `;
  const variables = { profileAccount: profileAccount.toBase58() };
  const data = await sdk.gqlClient!.request<{ profile_metadata: GraphQLProfileMetadata[] }>(query, variables);
  return data.profile_metadata[0];
}