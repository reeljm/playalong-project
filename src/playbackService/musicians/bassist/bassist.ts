import { Musician } from '../musician';
import { Measure } from '../../song/measure';
import { UprightBass } from './uprightBass';
import { EventBuilder } from '../../eventBuilder/eventBuilder';
import { BasslineGenerator } from './basslineGenerator';

export class Bassist implements Musician {

    constructor(private bass: UprightBass, private basslineGeneratorMap: Map<string, BasslineGenerator>) { }

    initialize(): Promise<void> {
        return this.bass.loadInstrument();
    }

    play(currentMeasure: Measure) {
        const generator: BasslineGenerator = this.basslineGeneratorMap.get(currentMeasure.style);
        const bassline: any[] = generator.gerenateBasslineEventParams(currentMeasure);
        console.log(bassline);
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
