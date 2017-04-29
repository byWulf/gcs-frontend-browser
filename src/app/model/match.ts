import { Game } from './game';
import { User } from './user';
import { Slot } from './slot';

type MatchStateEnum = "open" | "running" | "finished" | "canceled";

export class Match {
    id: string;
    state: MatchStateEnum = MatchState.open;
    game: Game;
    slots: Slot[];
    masterUserId: string;
    elements: Object[];
    progress: number;
    statusMessage: string;
    notifications: Notification[];
}

export const MatchState = {
    open: "open" as MatchStateEnum,
    running: "running" as MatchStateEnum,
    finished: "finished" as MatchStateEnum,
    canceled: "canceled" as MatchStateEnum
};

export class Notification {
    time: number;
    text: string;
}