import { Measure } from '../song/measure';

export interface Musician {

    play(arrangementCurrentMeasure: Measure): void;
    initialize(): Promise<void>;
    clearCache(): void;
}
