export const VOTING_START = new Date('2024-12-03T01:30:00Z'); // 15:53 Vietnam time
export const VOTING_END = new Date('2024-12-06T18:00:00Z');

export const isVotingPeriod = (): boolean => {
  const now = new Date();
  return now >= VOTING_START && now < VOTING_END;
};

export const isVotingEnded = (): boolean => {
  return new Date() >= VOTING_END;
};