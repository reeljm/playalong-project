import { Musician } from '../musician';
import { Measure } from '../../song/measure';
import { Piano } from './piano';
import { EventBuilder } from '../../eventBuilder/eventBuilder';
import { Theory } from '../../../../src/playbackService/theory/theory';
import { Chord } from '../../../../src/playbackService/theory/chord';
import { Scale } from '../../../../src/playbackService/theory/scale';
import { Note } from '../../../../src/playbackService/theory/note';
import rawData from '../../staticFiles/patterns/piano-comping.json';

const library: any[] = (rawData as any);

export class Pianist implements Musician {

    private currentOctave: number = 3;
    private previousChord: any;

    constructor(private piano: Piano, private theory: Theory) { }

    public clearCache(): void {
        this.previousChord = null;
    }

    initialize(): Promise<void> {
        return this.piano.loadInstrument();
    }

    play(currentMeasure: Measure) {
        for (let currentBeat = 0; currentBeat < currentMeasure.numberOfBeats; currentBeat++) {
            const currentChord: Chord = currentMeasure.chords[currentBeat];
            const isFirstBeatOfLastMeasure: boolean = !currentMeasure.nextMeasure && currentBeat === 0;
            const isNewCurrentChord: boolean = currentBeat === 0 || !this.previousChord || !this.previousChord.equals(currentChord);
            let currentChordDuration: number = 0;
            let lookaheadIndex: number = currentBeat;
            while (isNewCurrentChord && lookaheadIndex < currentMeasure.numberOfBeats) {
                const currentLookaheadChord: Chord = currentMeasure.chords[lookaheadIndex];
                const isDifferentChord: boolean = !currentChord.equals(currentLookaheadChord);
                if (isDifferentChord) {
                    break;
                } else {
                    currentChordDuration++;
                }
                lookaheadIndex++;
            }
            if (isFirstBeatOfLastMeasure || isNewCurrentChord) {
                const scale: Scale = this.theory.getScaleForChord(currentChord);

                const voicingNotes: Note[] = [];
                voicingNotes.push(this.theory.getNote(scale.pitches[2], this.currentOctave));
                voicingNotes.push(this.theory.getNote(scale.pitches[4], this.currentOctave));
                voicingNotes.push(this.theory.getNote(scale.pitches[scale.pitches.length - 1], this.currentOctave));

                const filteredLibrary: any[] = library.filter(e => e.durationInBeats === currentChordDuration);
                const compingRhythm: any[] = filteredLibrary[Math.floor(Math.random() * filteredLibrary.length)].events;

                voicingNotes.forEach((note: Note) => {
                    compingRhythm.forEach((eventParam: any) => {
                        let eventParamStart: number = currentBeat + Number.parseInt(eventParam.start.split(":")[0]);
                        const secondHalf: string = eventParam.start.substring(eventParam.start.indexOf(":") + 1);
                        EventBuilder.newEventBuilder()
                        .startTime(`${currentMeasure.arrangementMeasureNumber}:${eventParamStart}:${secondHalf}`)
                        .velocity(eventParam.velocity)
                        .duration(eventParam.duration)
                        .velocityOffset(eventParam.velocityOffset ? eventParam.velocityOffset : 0)
                        .probability(eventParam.probability)
                        .note(note.toPlayableString())
                        .instrument(this.piano)
                        .create();
                    });
                });
            }
            this.previousChord = currentChord;
        }
    }
}
