export interface Vote {
    _id?: String;
    vote: "1" | "-1";
    ruling: String;
    user: String;
}

export interface GroupedVotes {
    _id: String;
    count: number;
}