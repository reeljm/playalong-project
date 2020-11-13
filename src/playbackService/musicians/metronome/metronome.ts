import { Musician } from '../musician';
import { Measure } from '../../song/measure';
import { MetronomeInstrument } from './metronomeInstrument';
import { EventBuilder } from '../../eventBuilder/eventBuilder';

export class Metronome implements Musician {

    constructor(private metronomeInstrument: MetronomeInstrument) { }

    public clearCache(): void {
        // do nothing
    }

    initialize(): Promise<void> {
        return this.metronomeInstrument.loadInstrument();
    }

    play(currentMeasure: Measure) {
        for (let i = 0; i < currentMeasure.numberOfBeats; i++) {
            let note: string = "A1";
            if (i === 0) {
                note = "E2";
            }
            EventBuilder.newEventBuilder()
                .startTime(`0:${i}:0`)
                .velocity(1)
                .duration("1n")
                .velocityOffset(0)
                .probability(1)
                .note(note)
                .instrument(this.metronomeInstrument)
                .create();
        }
    }
}
