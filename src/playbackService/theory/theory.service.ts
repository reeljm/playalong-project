import rawChordsToScales from '../staticFiles/chordsToScales.json';
import { Scale } from './scale';
import { Note } from './note';
import { BasslineRequestParams } from '../musicians/bassist/basslineRequestParams';
import { BasslineResponseParams } from '../musicians/bassist/basslineResponseParams';
import { MusicUtility } from './pitchArray';
import { write } from 'fs';
import { Abs } from 'tone';

export class TheoryService {

    private chordsToScales = (rawChordsToScales as any);

    public getNextBasslineNote(params: BasslineRequestParams): BasslineResponseParams {
        console.log(params);

        const root: string = this.parseEnharmonicPitch(params.currentChord.root);
        const scaleType: string = this.chordsToScales[params.currentChord.type];
        const scale: Scale = this.getScale(root, scaleType);
        let directionChange = false;

        let nextNote: Note = null;
        if (params.desiredDegreeOfChord != null) {
            // if we know what scale degree we want to play, just pick it out from the scale:
            const indexInScale = params.desiredDegreeOfChord - 1;
            nextNote = this.getNote(scale.pitches[indexInScale], params.desiredOctave);
        } else {
            // use lastNoteScheduled, chordTone, scale, and desiredDirection to get the next note:
            const currentOctave = params.previousNoteScheduled.octave;
            const lastNote = params.previousNoteScheduled;

            let possibleIntervals: number[] = null
            if (params.requireChordTone) {
                possibleIntervals = [0,4];
            } else {
                possibleIntervals = Array.from(Array(scale.pitches.length).keys());
            }

            // go through these notes in the octave below, the current octave, and the octave above to see which note is closest:
            let scaleDegree = null;
            let chordToneNotesAndDistances: any[] = [];
            for (let octave = currentOctave - 1; octave <= currentOctave + 1; octave++) {
                possibleIntervals.forEach(interval => {
                    const note: Note = this.getNote(scale.pitches[interval], octave);
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
            if (params.numberOfBeatsUntilNextChord === 1) {
                const nextChordRoot: string = this.parseEnharmonicPitch(params.nextChord.root);
                const nextChordScaleType: string = this.chordsToScales[params.nextChord.type];
                const nextScale: Scale = this.getScale(nextChordRoot, nextChordScaleType);

                const rootOfNextChord: Note = this.getNoteInClosestOctave(nextScale.pitches[0], lastNote);
                const fifthOfNextChord: Note = this.getNoteInClosestOctave(nextScale.pitches[4], lastNote);

                const distanceToNextRoot: number = lastNote.distanceTo(rootOfNextChord);
                const distanceToNext5th: number = lastNote.distanceTo(fifthOfNextChord);

                let targetNote: Note = null;
                let distanceFromLastNoteToTargetNote: number = 0;
                console.log("next root:", rootOfNextChord.toPlayableString(), "distance:",distanceToNextRoot);
                console.log("next 5th:", fifthOfNextChord.toPlayableString(), "distance:",distanceToNext5th);
                if (Math.abs(distanceToNextRoot) <= Math.abs(distanceToNext5th)) {
                    // next root is equally close/closer than the next 5th:
                    console.log("next root!");
                    targetNote = rootOfNextChord;
                    distanceFromLastNoteToTargetNote = distanceToNextRoot;
                } else {
                    // next 5th is closer than the next root:
                    console.log("next 5th!");
                    targetNote = fifthOfNextChord;
                    distanceFromLastNoteToTargetNote = distanceToNext5th;
                }

                // set the next note to initially be the note we are targeting:
                let potentialNextNote = targetNote;
                let nextDirection = params.desiredDirection;
                if (distanceFromLastNoteToTargetNote === 2) {
                    // whole step above next target, schedule half step below:
                    nextNote = this.transpose(potentialNextNote, -1);
                    nextDirection = "up";
                } else if (distanceFromLastNoteToTargetNote === -2) {
                    // whole step below next target, schedule half step above:
                    nextNote = this.transpose(potentialNextNote, 1);
                    nextDirection = "down";
                } else if (distanceFromLastNoteToTargetNote === 1) {
                    // halfstep step above next target, schedule half step below:
                    nextNote = this.transpose(potentialNextNote, -1);
                    nextDirection = "up";
                } else if (distanceFromLastNoteToTargetNote === -1) {
                    // halfstep step below next target, schedule half step above:
                    nextNote = this.transpose(potentialNextNote, 1);
                    nextDirection = "down";
                } else if (distanceFromLastNoteToTargetNote === 0) {
                    console.log("SAME NOTE!!!");
                    if (params.desiredDirection === "up") {
                        nextNote = this.transpose(potentialNextNote, 1);
                        nextDirection = "down";
                    }
                    else if (params.desiredDirection === "down") {
                        nextNote = this.transpose(potentialNextNote, -1);
                        nextDirection = "up";
                    }
                } else {
                    // we have a step larger than a whole step, there is a scale degree we can use:
                    if (distanceFromLastNoteToTargetNote > 0) {
                        
                    }
                }

                directionChange = false;
                if (params.desiredDirection !== nextDirection) {
                    directionChange = true;
                }
            }
        }

        // make sure the note is within the instrument's range:
        while (nextNote.compareTo(params.highestNote) === 1) {
            nextNote = Note.getNote(nextNote.pitch, nextNote.octave - 1);
            directionChange = true;
        }

        while (nextNote.compareTo(params.lowestNote) === -1) {
            nextNote = Note.getNote(nextNote.pitch, nextNote.octave + 1);
            directionChange = true;
        }

        const response = this.newBasslineResponseParams();
        response.notesScheduled = [nextNote];
        response.directionChange = directionChange;
        return response;
    }

    private transpose(note: Note, semitones: number): Note {
        let pitchIndex = MusicUtility.pitchArray.indexOf(note.pitch);
        let currentOctave = note.octave;
        const numberOfTones = MusicUtility.pitchArray.length;
        while (semitones != 0) {
            if (semitones < 0) {
                pitchIndex = pitchIndex - 1;
                semitones++;
            } else if(semitones > 0) {
                pitchIndex = pitchIndex + 1;
                semitones--;
            }
            
            if (pitchIndex < 0) {
                pitchIndex = numberOfTones - 1;
                currentOctave--;
            } else if (pitchIndex > numberOfTones - 1) {
                pitchIndex = 0;
                currentOctave++;
            }
        }
        return this.getNote(MusicUtility.pitchArray[pitchIndex], currentOctave);
    }

    private getNoteInClosestOctave(pitch: string, note: Note): Note {
        let lowerOctaveNote: Note = this.getNote(pitch, note.octave-1);
        let currentOctaveNote: Note = this.getNote(pitch, note.octave);
        let higherOctaveNote: Note = this.getNote(pitch, note.octave+1);

        const lowerOctaveDist = Math.abs(lowerOctaveNote.distanceTo(note));
        const currentOctaveDist = Math.abs(currentOctaveNote.distanceTo(note));
        const higherOctaveDist = Math.abs(higherOctaveNote.distanceTo(note));

        const min = Math.min(lowerOctaveDist, currentOctaveDist, higherOctaveDist);
        if (min === lowerOctaveDist) {
            return lowerOctaveNote;
        }
        else if (min === currentOctaveDist) {
            return currentOctaveNote;
        }
        else if (min === higherOctaveDist) {
            return higherOctaveNote;
        }
    }

    private newBasslineResponseParams(): BasslineResponseParams {
        return new BasslineResponseParams();
    }

    private getNote(pitch: string, octave: number): Note {
        return Note.getNote(pitch, octave);
    }

    private getScale(root: string, scaleType: string): Scale {
        return Scale.getScale(root, scaleType);
    }

    private parseEnharmonicPitch(pitch: string): string {
        if (MusicUtility.pitchArray.includes(pitch)) {
            return pitch;
        }
        const tokenizedPitch: string[] = pitch.split("");
        let currentNoteIndex: number = MusicUtility.pitchArray.indexOf(tokenizedPitch[0]);
        tokenizedPitch.shift();
        while (tokenizedPitch.length > 0) {
            const sharpOrFlat = tokenizedPitch[0];
            if (sharpOrFlat === "#") {
                currentNoteIndex++;
            } else if (sharpOrFlat === "b") {
                currentNoteIndex--;
            }

            // handle out of bounds cases:
            if (currentNoteIndex === -1) {
                currentNoteIndex = 11;
            } else if (currentNoteIndex === 12) {
                currentNoteIndex = 0;
            }
            tokenizedPitch.shift();
        }
        const parsedNote = MusicUtility.pitchArray[currentNoteIndex];
        return parsedNote;
    }
}
