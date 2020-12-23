import { Musician } from '../musician';
import { Measure } from '../../song/measure';
import { UprightBass } from './uprightBass';
import { EventBuilder } from '../../eventBuilder/eventBuilder';
import { BasslineGenerator } from './basslineGenerator';
import { BasslineCurrentState } from './basslineCurrentState';
import { EventParams } from '../drummer/eventParams';

export class Bassist implements Musician {

    private basslineCurrentState: BasslineCurrentState = new BasslineCurrentState();

    constructor(private bass: UprightBass, private basslineGeneratorMap: Map<string, BasslineGenerator>) { }

    public clearCache(): void {
        this.basslineCurrentState = new BasslineCurrentState();
    }

    initialize(): Promise<void> {
        return this.bass.loadInstrument();
    }

    play(currentMeasure: Measure) {
        const generator: BasslineGenerator = this.basslineGeneratorMap.get(currentMeasure.style);
        const bassline: EventParams[] = generator.gerenateBasslineEventParams(currentMeasure, this.basslineCurrentState);
        bassline.forEach((event: EventParams) => {
            EventBuilder.newEventBuilder()
                .startTime(event.start)
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
