import { Game } from './game';
import { User } from './user';
import { Slot } from './match/slot';

type MatchStateEnum = "open" | "running" | "finished" | "canceled";

export class Match {
    id: number;
    state: MatchStateEnum = MatchState.open;
    game: Game;
    slots: Slot[];
    masterUser: User;
}

export const MatchState = {
    open: "open" as MatchStateEnum,
    running: "running" as MatchStateEnum,
    finished: "finished" as MatchStateEnum,
    canceled: "canceled" as MatchStateEnum
};