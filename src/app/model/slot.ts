import { User } from './user';

export class Slot {
    user: User = null;
    color: string = '#000000';
    active: boolean = false;
    points: number = 0;
}