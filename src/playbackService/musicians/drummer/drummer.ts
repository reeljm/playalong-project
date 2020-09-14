import { Musician } from '../musician';
import rawData from '../../staticFiles/patterns/drums.json';
import { DrumPattern, Parts, EventParams } from './drumPatterns';
import { Measure } from '../../song/measure';
import { EventBuilder } from '../../eventBuilder/eventBuilder';
import { DrumSet } from './drumset';

const library = (rawData as any);

export class Drummer implements Musician {

    pattern: DrumPattern;
    patternNameToPatternArray: Map<string, DrumPattern[]> = new Map<string, DrumPattern[]>();
    measuresAlreadyScheduled = 0;

    constructor(private drumSet: DrumSet) { }

    initialize(): Promise<void> {
        for (const styleName of Object.keys(library)) {
            const timeFeels =  library[styleName];
            for (const timeFeelName of Object.keys(timeFeels)) {
                this.patternNameToPatternArray.set(timeFeelName, timeFeels[timeFeelName]);
            }
        }
        return this.drumSet.loadInstrument();
    }


    play(currentMeasure: Measure) {
        this.playTime(currentMeasure);
    }

    playTime(currentMeasure: Measure) {
        if (this.measuresAlreadyScheduled > 0) {
            this.measuresAlreadyScheduled--;
            return;
        }

        this.pattern = this.getDrumPatternForStyle(currentMeasure.style);
        this.measuresAlreadyScheduled = this.pattern.numberOfMeasures - 1;
        const parts: Parts = this.pattern.parts;

        Object.entries(parts).forEach(([partName, eventParamsList]) => {
            eventParamsList.forEach((eventParams: EventParams) => {
                EventBuilder.newEventBuilder()
                .startTime(`${currentMeasure.measureNumber}:${eventParams.start}`)
                .velocity(eventParams.velocity)
                .duration(eventParams.duration)
                .velocityOffset(eventParams.velocityOffset)
                .probability(eventParams.probability)
                .note(partName)
                .instrument(this.drumSet)
                .create();
            });
        });
    }

    getDrumPatternForStyle(style: string): DrumPattern {
        const patterns = this.patternNameToPatternArray.get(style);
        return this.pattern = patterns[Math.floor(Math.random() * patterns.length)];
    }

}
