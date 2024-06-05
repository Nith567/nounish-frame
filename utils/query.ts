
import { useQuery } from "@airstack/airstack-react";
import { Data, QueryResponse } from "@/utils/airstackInterface";
import axios from 'axios';
/**
 * Fetches Farcaster channel participants based on the provided userId.
 * @param userId - The user ID to check follow status.
 * @returns The user ID if joined, or null if not.
 */
export const fetchFarcasterChannelParticipants = async (userId: string): Promise<string | null> => {
  const query = `
  query CheckFollowStatus {
    FarcasterChannelParticipants(
      input: {filter: {participant: {_eq: "fc_fid:${userId}"}, channelId: {_eq: "outpaint"}, channelActions: {_eq: follow}}, blockchain: ALL, limit: 50}
    ) {
      FarcasterChannelParticipant {
        participant {
          userId
        }
      }
    }
  };
  `;

  const { data, loading, error }: QueryResponse = useQuery<Data>(query, {}, { cache: false });

  if (loading) {
    console.log('Loading...');
    return null;
  }

  if (error) {
    console.error('Error:', error.message);
    return null;
  }

  const participants = data?.FarcasterChannelParticipants?.FarcasterChannelParticipant;

  if (participants && participants.length > 0) {
    return participants[0].participant.userId;
  } else {
    return null;
  }
};


interface ContractResult {
  isHolderOfContract: boolean;
}
async function checkWalletHoldsContract(wallet: string, contractAddress: string): Promise<ContractResult> {
  try {
    const response = await axios.get('https://eth-mainnet.g.alchemy.com/nft/v3/QyxMOKTYrNkmofq71rof8WEO1kw9VuI4/isHolderOfContract', {
      params: {
        wallet,
        contractAddress
      },
      headers: {
        'accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return { isHolderOfContract: false };
  }
}

export const isHolderOfContracts = async (wallets: string[], contractAddresses: string[]): Promise<boolean> => {
  try {
    const results = await Promise.all(
      wallets.flatMap(wallet =>
        contractAddresses.map(contractAddress =>
          checkWalletHoldsContract(wallet, contractAddress)
        )
      )
    );
    return results.some(result => result.isHolderOfContract);
  } catch (error) {
    console.error(error);
    return false;
  }
};