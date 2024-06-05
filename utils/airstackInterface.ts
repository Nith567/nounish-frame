interface QueryResponse {
  data: Data | null;
  loading: boolean;
  error: Error | null;
}

interface Data {
  FarcasterChannelParticipants: FarcasterChannelParticipants;
}

interface Error {
  message: string;
}

interface FarcasterChannelParticipants {
  FarcasterChannelParticipant: Participant[] | null;
}

interface Participant {
  participant: {
      userId: string;
  };
}


  export type { QueryResponse, Data, Error, Participant, FarcasterChannelParticipants };
  