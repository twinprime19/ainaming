export interface BotName {
  id: string;
  text: string;
  votes: number;
  submitter?: string;
}

export interface NameSubmission {
  botName: string;
  submitterName: string;
}