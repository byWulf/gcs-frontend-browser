import { Game } from './game';
import { User } from './user';
import { Slot } from './match/slot';
import { Element } from './match/element';

type MatchStateEnum = "open" | "running" | "finished" | "canceled";

export class Match {
    id: number;
    state: MatchStateEnum = MatchState.open;
    game: Game;
    slots: Slot[];
    masterUser: User;
    elements: Element[];
}

export const MatchState = {
    open: "open" as MatchStateEnum,
    running: "running" as MatchStateEnum,
    finished: "finished" as MatchStateEnum,
    canceled: "canceled" as MatchStateEnum
};