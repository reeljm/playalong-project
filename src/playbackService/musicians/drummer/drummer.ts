import { Musician } from '../musician';
import styleRawData from '../../staticFiles/patterns/drum-styles.json';
import compingRawData from '../../staticFiles/patterns/drum-comping.json';
import { DrumPattern, Parts, EventParams } from './drumPatterns';
import { Measure } from '../../song/measure';
import { EventBuilder } from '../../eventBuilder/eventBuilder';
import { DrumSet } from './drumset';

const styleLibrary = (styleRawData as any);
const compingPatternLibrary = (compingRawData as any);

export class Drummer implements Musician {

    pattern: DrumPattern;
    patternNameToPatternArray: Map<string, DrumPattern[]> = new Map<string, DrumPattern[]>();
    eventsToSchedule: EventBuilder[] = [];
    currentStyle: string = null;

    constructor(private drumSet: DrumSet) { }

    clearCache(): void {
        this.eventsToSchedule = [];
        this.currentStyle = null;
    }

    initialize(): Promise<void> {
        for (const styleName of Object.keys(styleLibrary)) {
            const timeFeels =  styleLibrary[styleName];
            for (const timeFeelName of Object.keys(timeFeels)) {
                this.patternNameToPatternArray.set(timeFeelName, timeFeels[timeFeelName]);
            }
        }
        return this.drumSet.loadInstrument();
    }

    public play(currentMeasure: Measure): void {
        let style: string = currentMeasure.style;
        if (!currentMeasure.nextMeasure) {
            // if last measure, play a single note on beat 1
            style = "sustainedCrash";
        } else if (this.eventsToSchedule.length > 0 && this.currentStyle === currentMeasure.style) {
            // schedule the events stored in eventsToSchedule array if needed
            while (this.eventsToSchedule.length > 0) {
                this.eventsToSchedule.pop().create();
            }
            return;
        }

        this.eventsToSchedule = [];

        this.pattern = this.getDrumPatternForStyle(style);
        const partsForCurrentStyle: Parts = this.pattern.parts;
        const partsForCompingPattern: Parts = compingPatternLibrary[Math.floor(Math.random() * compingPatternLibrary.length)].parts;

        this.scheduleEvents(partsForCurrentStyle, currentMeasure);
        const scheduleCompingRhythm: boolean = Math.random() < 0.8;
        if (this.pattern.allowsComping && scheduleCompingRhythm) {
            this.scheduleEvents(partsForCompingPattern, currentMeasure);
        }

        this.currentStyle = currentMeasure.style;
    }

    private scheduleEvents(parts: Parts, currentMeasure: Measure) {
        Object.entries(parts).forEach(([partName, eventParamsList]) => {
            eventParamsList.forEach((eventParams: EventParams) => {
                const beatOfEvent: number = Number.parseInt(eventParams.start.split(":")[0], 0x0);

                const builder: EventBuilder = EventBuilder.newEventBuilder()
                .startTime(`${currentMeasure.arrangementMeasureNumber}:${eventParams.start}`)
                .velocity(eventParams.velocity)
                .duration(eventParams.duration)
                .velocityOffset(eventParams.velocityOffset ? eventParams.velocityOffset : 0)
                .probability(eventParams.probability)
                .note(partName)
                .instrument(this.drumSet);

                if (beatOfEvent > currentMeasure.numberOfBeats - 1) {
                    this.eventsToSchedule.push(builder);
                } else {
                    builder.create();
                }
            });
        });
    }

    private getDrumPatternForStyle(style: string): DrumPattern {
        const patterns = this.patternNameToPatternArray.get(style);
        return patterns[Math.floor(Math.random() * patterns.length)];
    }

}
