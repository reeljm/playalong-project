import { Measure } from '../measure/measure';

export interface Musician {

    play(arrangementCurrentMeasure: Measure): void;
    initialize(): Promise<void>;

}
