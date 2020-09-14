import { Musician } from '../musician';
import { Measure } from '../../song/measure';
import { UprightBass } from './uprightBass';
import { EventBuilder } from '../../eventBuilder/eventBuilder';
import { BasslineGenerator } from './basslineGenerator';

export class Bassist implements Musician {

    constructor(private bass: UprightBass, private basslineGenerator: BasslineGenerator) { }

    initialize(): Promise<void> {
        return this.bass.loadInstrument();
    }

    play(currentMeasure: Measure) {
        const bassline = this.basslineGenerator.gerenateBasslineEventParams(currentMeasure);
        bassline.forEach((event: any) => {
            EventBuilder.newEventBuilder()
                .startTime(event.startTime)
                .velocity(event.velocity)
                .duration(event.duration)
                .velocityOffset(event.velocityOffset)
                .probability(event.probability)
                .note(event.note)
                .instrument(this.bass)
                .create();
        });
    }
}
