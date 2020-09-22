import { Measure } from '../../song/measure';
import { UprightBass } from './uprightBass';
import { TheoryService } from '../../theory/theory.service';
import { Note } from '../../theory/note';
import { BasslineRequestParams } from './basslineRequestParams';
import { BasslineResponseParams } from './basslineResponseParams';
import { Chord } from '../../../../src/playbackService/theory/chord';
import { Scale } from '../../../../src/playbackService/theory/scale';

export class BasslineGenerator {

    private static DEFAULT_STARTING_OCTAVE: number = 2;
    private static DEFAULT_STARTING_DIRECTION: string = "up"
    private previousNoteScheduled: Note = null;
    private previousChord: Chord = null;
    private currentOctave: number;
    private direction: string;
    private presheduledNotes: Note[] = [];
    private beatsAlreadySpentOnCurrentChord: number = 0;
    private static DIFFICULT_CHORD_TYPES: string[] = ["min7b5", "dim7", "7b9"];

    constructor(private theory: TheoryService) { }

    public gerenateBasslineEventParams(currentMeasure: Measure): any[] {
        if (!this.currentOctave) {
            this.currentOctave = BasslineGenerator.DEFAULT_STARTING_OCTAVE;
        }
        if (!this.direction) {
            this.direction = BasslineGenerator.DEFAULT_STARTING_DIRECTION;
        }

        const eventParamArray = [];

        for (let currentBeat = 0; currentBeat < currentMeasure.numberOfBeats; currentBeat++) {
            let noteDuration: string = "4n";
            if (!currentMeasure.nextMeasure) {
                // the tune is over:
                if (currentBeat === 0) {
                    noteDuration = "4m";
                } else {
                    break;
                }
            }
            if (currentBeat === 1) {
                // randomly choose to change direction:
                const dirSwitch = Math.random() >= 0.9;
                if (dirSwitch) {
                    this.direction = this.direction === "up" ? "down" : "up";
                }
            }
            let noteToSchedule: Note = null;
            const currentChord: Chord = currentMeasure.chords[currentBeat];
            let nextChord: Chord = null;
            if (currentBeat === currentMeasure.numberOfBeats - 1) {
                nextChord = currentMeasure.nextMeasure ? currentMeasure.nextMeasure.chords[0] : null;
            } else {
                nextChord = currentMeasure.chords[currentBeat + 1];
            }

            if (this.presheduledNotes.length > 0) {
                noteToSchedule = this.presheduledNotes[0];
                this.presheduledNotes.shift();
            } else {
                const params: BasslineRequestParams = this.newBasslineRequestParams();
                params.previousNoteScheduled = this.previousNoteScheduled;
                params.previousChord = this.previousChord;
                params.currentChord = currentChord;
                params.nextChord = nextChord;
                params.desiredDirection = this.direction;
                params.beatsAlreadySpentOnCurrentChord = this.beatsAlreadySpentOnCurrentChord;
                params.nextBeatIsStrongBeat = currentBeat === currentMeasure.numberOfBeats - 1;
                params.isLastBeatOfCurrentChord = !currentChord.equals(nextChord);
                params.requireRoot = false;

                const isDifficultChord = BasslineGenerator.DIFFICULT_CHORD_TYPES.includes(currentChord.type);

                // see if this is a special case:
                if (!this.previousNoteScheduled || !nextChord) {
                    // if we are starting or ending, schedule the root:
                    params.desiredScaleDegree = 0;
                    params.desiredOctave = BasslineGenerator.DEFAULT_STARTING_OCTAVE;
                } else if (currentBeat % currentMeasure.numberOfBeats === 0) {
                    // this is a downbeat, schedule the root:
                    params.requireRoot = true;
                } else if (isDifficultChord) {
                    const scaleDegrees: number[] = [0, 2, 4];
                    const randomDegree = scaleDegrees[Math.floor(Math.random() * scaleDegrees.length)];
                    params.desiredScaleDegree = randomDegree;
                    params.desiredOctave = this.currentOctave;
                }

                // request the next note:
                const response: BasslineResponseParams = this.getNextBasslineNote(params);

                noteToSchedule = response.notesScheduled[0];
                response.notesScheduled.shift();
                this.presheduledNotes = response.notesScheduled;

                // Save info about this schedule cycle:
                this.previousNoteScheduled = noteToSchedule;
                if (this.previousChord && this.previousChord.equals(currentChord)) {
                    this.beatsAlreadySpentOnCurrentChord++;
                } else {
                    this.beatsAlreadySpentOnCurrentChord = 0;
                }
                this.previousChord = currentChord;
                if (this.direction === "up" && response.directionChange) {
                    this.direction = "down"
                } else if (this.direction === "down" && response.directionChange) {
                    this.direction = "up"
                }
            }

            console.log(noteToSchedule.toPlayableString());

            eventParamArray.push({
                startTime: `${currentMeasure.measureNumber}:${currentBeat}:0`,
                velocity: 0.8,
                duration: noteDuration,
                velocityOffset: 0,
                probability: 1,
                note: noteToSchedule.toPlayableString()
            });
        }
        return eventParamArray;
    }

    public getNextBasslineNote(params: BasslineRequestParams): BasslineResponseParams {
        console.log(params);
        const scale: Scale = this.theory.getScaleForChord(params.currentChord);
        let directionChange = false;

        let nextNote: Note = null;
        if (params.desiredScaleDegree != null) {
            // if we know what scale degree we want to play, just pick it out from the scale:
            const indexInScale = params.desiredScaleDegree;
            nextNote = this.theory.getNote(scale.pitches[indexInScale], params.desiredOctave);
        } else {
            // use lastNoteScheduled, chordTone, scale, and desiredDirection to get the next note:
            const currentOctave = params.previousNoteScheduled.octave;
            const lastNote = params.previousNoteScheduled;

            let possibleIntervals: number[] = null
            if (params.requireRoot) {
                possibleIntervals = [0,4];
            } else {
                possibleIntervals = Array.from(Array(scale.pitches.length).keys());
            }

            // go through these notes in the octave below, the current octave, and the octave above to see which note is closest:
            let chordToneNotesAndDistances: any[] = [];
            for (let octave = currentOctave - 1; octave <= currentOctave + 1; octave++) {
                possibleIntervals.forEach(interval => {
                    const note: Note = this.theory.getNote(scale.pitches[interval], octave);
                    const dist: number = lastNote.distanceTo(note);
                    const noteAndDist = {note: note, dist: dist};
                    chordToneNotesAndDistances.push(noteAndDist);
                });
            }

            // filter out notes that violate our direction requirement:
            chordToneNotesAndDistances = chordToneNotesAndDistances.filter(noteAndDistance => {
                if (params.desiredDirection === "up" && noteAndDistance.dist > 0) {
                    return true;
                } else if (params.desiredDirection === "down" && noteAndDistance.dist < 0) {
                    return true;
                } else {
                    return false;
                }
            });

            // select the note that is closest:
            chordToneNotesAndDistances = chordToneNotesAndDistances.sort((nd1,nd2) => Math.abs(nd1.dist) - Math.abs(nd2.dist));
            nextNote = chordToneNotesAndDistances[0].note;

            // this is the last beat of the current chord. recalculate a more graceful resolution to next chord:
            if (params.isLastBeatOfCurrentChord || params.nextBeatIsStrongBeat) {
                const nextScale: Scale = this.theory.getScaleForChord(params.nextChord);

                // pick which note we want to target:
                const rootOfNextChord: Note = this.theory.getNoteInClosestOctave(nextScale.pitches[0], lastNote);
                const fifthOfNextChord: Note = this.theory.getNoteInClosestOctave(nextScale.pitches[4], lastNote);

                const distanceToNextRoot: number = lastNote.distanceTo(rootOfNextChord);
                const distanceToNextFifth: number = lastNote.distanceTo(fifthOfNextChord);

                let targetNote: Note = null;
                let distanceFromLastNoteToTargetNote: number = 0;
                if (this.beatsAlreadySpentOnCurrentChord < 2) {
                    // the current chord only lasts for 1 or 2 beats. we need to target the next root:
                    targetNote = rootOfNextChord;
                    distanceFromLastNoteToTargetNote = distanceToNextRoot;
                } else if (this.distanceIsMajorOrMinor3rdInDesiredDirection(distanceToNextRoot, params.desiredDirection)) {
                    targetNote = rootOfNextChord;
                    distanceFromLastNoteToTargetNote = distanceToNextRoot;
                    console.log("Picking root", distanceToNextRoot, params.desiredDirection);
                } else if (this.distanceIsMajorOrMinor3rdInDesiredDirection(distanceToNextFifth, params.desiredDirection)) {
                    targetNote = fifthOfNextChord;
                    distanceFromLastNoteToTargetNote = distanceToNextFifth;
                    console.log("Picking 5th", distanceToNextRoot, params.desiredDirection);
                } else if (Math.abs(distanceToNextRoot) <= Math.abs(distanceToNextFifth)) {
                    // next root is equally close/closer than the next 5th:
                    targetNote = rootOfNextChord;
                    distanceFromLastNoteToTargetNote = distanceToNextRoot;
                } else {
                    // next 5th is closer than the next root:
                    targetNote = fifthOfNextChord;
                    distanceFromLastNoteToTargetNote = distanceToNextFifth;
                }

                // set the next note to initially be the note we are targeting:
                let nextDirection = params.desiredDirection;
                if (distanceFromLastNoteToTargetNote === 2) {
                    // whole step below next target, schedule half step above:
                    nextNote = this.theory.transpose(targetNote, -1);
                    nextDirection = "up";
                } else if (distanceFromLastNoteToTargetNote === -2) {
                    // whole step above next target, schedule half step below:
                    nextNote = this.theory.transpose(targetNote, 1);
                    nextDirection = "down";
                } else if (distanceFromLastNoteToTargetNote === 1) {
                    // halfstep step below next target, schedule half step above:
                    nextNote = this.theory.transpose(targetNote, 1);
                    nextDirection = "down";
                } else if (distanceFromLastNoteToTargetNote === -1) {
                    // halfstep step above next target, schedule half step below:
                    nextNote = this.theory.transpose(targetNote, -1);
                    nextDirection = "up";
                } else if (distanceFromLastNoteToTargetNote === 0) {
                    if (params.desiredDirection === "up") {
                        nextNote = this.theory.transpose(targetNote, 1);
                        nextDirection = "down";
                    }
                    else if (params.desiredDirection === "down") {
                        nextNote = this.theory.transpose(targetNote, -1);
                        nextDirection = "up";
                    }
                } else {
                    // we have a distance larger than a whole step, pick the closest scale degree:

                    // check if the target note is in our currrent scale:
                    if (scale.pitches.includes(targetNote.pitch)) {
                        let indexCurrentScale = scale.pitches.indexOf(targetNote.pitch);
                        if (indexCurrentScale > 0) {
                            if (distanceFromLastNoteToTargetNote > 0) {
                                indexCurrentScale = indexCurrentScale - 1;
                                nextDirection = "up";
                            } else {
                                indexCurrentScale = indexCurrentScale + 1;
                                nextDirection = "down";
                            }
                            nextNote = this.theory.getNoteInClosestOctave(scale.pitches[indexCurrentScale], targetNote);
                        } else {
                            if (distanceFromLastNoteToTargetNote > 0) {
                                nextNote = this.theory.transpose(targetNote, -1);
                                nextDirection = "up";
                            } else {
                                nextNote = this.theory.transpose(targetNote, + 1);
                                nextDirection = "down";
                            }
                        }
                    }
                }

                directionChange = false;
                if (params.desiredDirection !== nextDirection) {
                    directionChange = true;
                }
            }
        }

        // make sure the note is within the instrument's range:
        while (nextNote.compareTo(UprightBass.HIGHEST_NOTE) === 1) {
            nextNote = Note.getNote(nextNote.pitch, nextNote.octave - 1);
            directionChange = true;
        }

        while (nextNote.compareTo(UprightBass.LOWEST_NOTE) === -1) {
            nextNote = Note.getNote(nextNote.pitch, nextNote.octave + 1);
            directionChange = true;
        }

        const response = this.newBasslineResponseParams();
        response.notesScheduled = [nextNote];
        response.directionChange = directionChange;
        return response;
    }
    private distanceIsMajorOrMinor3rdInDesiredDirection(noteDistance: number, desiredDirection: string): boolean {
        if (desiredDirection === "up" && (noteDistance === 3 || noteDistance === 4)) {
            return true;
        } else if (desiredDirection === "down" && (noteDistance === -3 || noteDistance === -4)) {
            return true;
        }
        return false;
    }

    private newBasslineResponseParams(): BasslineResponseParams {
        return new BasslineResponseParams();
    }

    newBasslineRequestParams(): BasslineRequestParams {
        return new BasslineRequestParams();
    }

}
