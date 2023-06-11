import { getProfileMetadataByProfile } from "@/hooks/getProfileMetadata";
import { CandyPayClass } from "@/lib/candypay";
import { Card, CardBody, Text, Image, Box, Stack, Heading, Avatar, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import { SDK, useGumContext } from "@gumhq/react-sdk";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export type Profile = {
  address: string;
  metadata: {
    bio: string,
    name: string,
    avatar: string,
    username: string
  },
  metadata_uri: string,
  profile: string
}

export type Campaign = {
  address: string;
  metadata: {
    authorship: {
      publicKey: string,
      signature: string
    },
    content: {
      nameCampaign: string;
      descriptionCampaign: string;
      imageUrlCampaign: string;
      format: string;
    };
    type: string
  },
  metadata_uri: string,
  profile: string
}

const CampaignModel = ({ onClose, isOpen, campaign, profile }: { onClose: () => void, isOpen: boolean, campaign: Campaign, profile: Profile }) => {
  const contribute = () => {
    CandyPayClass.transaction().then(data => {
      window.location.href = data.payment_url
    })
  }

  return (
    <>
      <Modal onClose={onClose} isOpen isCentered size="4xl">
        <ModalOverlay />
        <ModalContent>
          <Box width="100%" style={{ display: "flex", margin: "10px 10px" }}>
            <Box width="50%">
              <Image
                src={campaign.metadata.content.imageUrlCampaign}
                alt="Image of campaign"
                borderRadius='lg'
                width="80%"
                height="80%"
                objectFit="cover"
              />
            </Box>
            <Box style={{ display: "flex", justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: "50%", paddingRight: "30px" }}>
              <ModalHeader>{campaign.metadata.content.nameCampaign}</ModalHeader>
              <Text size="sm">{campaign.metadata.content.descriptionCampaign}</Text>
              <Button style={{ marginTop: "15px" }} onClick={() => contribute()}>Contribute for this Campaign</Button>
            </Box>
          </Box>
          <ModalCloseButton />
          <ModalBody>
            <Box style={{ display: 'flex', gap: "10px", alignItems: "center" }}>
              <Text fontSize="xl" fontWeight="medium">Campaign Owner: {profile.metadata.name}</Text>
              <Avatar
                src={profile.metadata.avatar}
              />
            </Box>
            <Text>
              {profile.metadata.bio}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

const CampaignCard = ({ campaign, sdk }: { campaign: Campaign, sdk: SDK }) => {
  const [profile, setProfile] = useState<Profile>();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    const getProfileMetadata = async () => {
      const result = await getProfileMetadataByProfile(new PublicKey(campaign.profile), sdk);
      setProfile(result as any);
    }

    if (campaign) {
      getProfileMetadata();
    }
  }, [campaign])

  return (
    campaign &&
    <Card maxW="sm" style={{ margin: "10px 20px" }}>
      <CardBody>
        <Image
          src={campaign.metadata.content.imageUrlCampaign}
          alt="Image of campaign"
          borderRadius='lg'
        />
        <Stack style={{ marginTop: "10px" }}>
          <Text fontSize="2xl" fontWeight="bold">
            {campaign.metadata.content.nameCampaign}
          </Text>
          <Box style={{ display: "flex", justifyContent: "space-around" }}>
            <Box style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Avatar
                src={profile?.metadata.avatar}
              />
              <Text>
                {profile?.metadata.name}
              </Text>
            </Box>
            <Button onClick={onOpen}>
              Detail
            </Button>
            {isOpen && <CampaignModel isOpen={isOpen} onClose={onClose} campaign={campaign} profile={profile!} />}
          </Box>
        </Stack>
      </CardBody>
    </Card>
  )
}

const CampaignList = ({ campaigns }: { campaigns: Campaign[] }) => {
  const { sdk } = useGumContext();
  const router = useRouter();


  return (
    <div style={{ display: "flex", flexWrap: 'wrap', width: "100%" }}>
      {
        campaigns.map((campaign, index) => (
          <CampaignCard campaign={campaign} sdk={sdk} key={index} />
        ))
      }
    </div>
  )
}

export default CampaignList;