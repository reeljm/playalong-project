import { Musician } from '../musician';
import { Measure } from '../../song/measure';
import { Piano } from './piano';
import { EventBuilder } from '../../eventBuilder/eventBuilder';
import { Theory } from '../../../../src/playbackService/theory/theory';
import { Chord } from '../../../../src/playbackService/theory/chord';
import { Scale } from '../../../../src/playbackService/theory/scale';
import { Note } from '../../../../src/playbackService/theory/note';

export class Pianist implements Musician {

    private currentOctave: number = 3;
    private previousChord: any;

    constructor(private piano: Piano, private theory: Theory) { }

    initialize(): Promise<void> {
        return this.piano.loadInstrument();
    }

    play(currentMeasure: Measure) {
        const eventParamArray: any[] = [];

        for (let currentBeat = 0; currentBeat < currentMeasure.numberOfBeats; currentBeat++) {
            const currentChord: Chord = currentMeasure.chords[currentBeat];
            const isFirstBeatOfLastMeasure = !currentMeasure.nextMeasure && currentBeat === 0;
            const isNewCurrentChord = !this.previousChord || !this.previousChord.equals(currentChord);
            if (isFirstBeatOfLastMeasure || isNewCurrentChord) {
                const scale: Scale = this.theory.getScaleForChord(currentChord);

                const voicing: Note[] = [];
                voicing.push(this.theory.getNote(scale.pitches[2], this.currentOctave));
                voicing.push(this.theory.getNote(scale.pitches[4], this.currentOctave));
                voicing.push(this.theory.getNote(scale.pitches[6], this.currentOctave));

                let duration: string = "2n";
                if (isFirstBeatOfLastMeasure) {
                    duration = "4m"
                }
                voicing.forEach(note => {
                    eventParamArray.push({
                        startTime: `${currentMeasure.measureNumber}:${currentBeat}:0`,
                        velocity: 0.7,
                        duration: duration,
                        velocityOffset: 0,
                        probability: 1,
                        note: note.toPlayableString()
                    });
                });
            }
            this.previousChord = currentChord;
        }

        eventParamArray.forEach((event: any) => {
            EventBuilder.newEventBuilder()
                .startTime(event.startTime)
                .velocity(event.velocity)
                .duration(event.duration)
                .velocityOffset(event.velocityOffset)
                .probability(event.probability)
                .note(event.note)
                .instrument(this.piano)
                .create();
        });
    }
}
