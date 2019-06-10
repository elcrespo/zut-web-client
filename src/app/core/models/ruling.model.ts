import { GroupedVotes } from './vote.model';

export interface Ruling {
    name: string,
    description: string;
    createdDate: string;
    _id: string;
    closeDate: string;
    imgPath: string;
    votes?: GroupedVotes[],
    currentUserVotes?: GroupedVotes[]
  }