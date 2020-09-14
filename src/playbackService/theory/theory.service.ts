import rawChordsToScales from '../staticFiles/chordsToScales.json';
import { Scale } from './scale';
import { Note } from './note';
import { BasslineRequestParams } from '../musicians/bassist/basslineRequestParams';
import { BasslineResponseParams } from '../musicians/bassist/basslineResponseParams';
import { MusicUtility } from './pitchArray';

export class TheoryService {

    private chordsToScales = (rawChordsToScales as any);

    public getNextBasslineNote(params: BasslineRequestParams): BasslineResponseParams {
        console.log(params);

        const root: string = this.parseEnharmonicPitch(params.chord.root);
        const scaleType: string = this.chordsToScales[params.chord.type];
        const scale: Scale = this.getScale(root, scaleType);
        let directionChange = false;

        let nextNote: Note = null;
        if (params.desiredDegreeOfChord != null) {
            // if we know what scale degree we want to play, just pick it out from the scale:
            const indexInScale = params.desiredDegreeOfChord - 1;
            nextNote = this.getNote(scale.pitches[indexInScale], params.desiredOctave);
        } else {
            // use lastNoteScheduled, chordTone, scale, and desiredDirection to get the next note:
            const currentOctave = params.lastNoteScheduled.octave;
            const lastNote = params.lastNoteScheduled;

            let possibleIntervals: number[] = null
            if (params.requireChordTone) {
                possibleIntervals = [0, 4];
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

            // special case: we have 1 note left to schedule in this measure. The last note we played is whole step from a chord tone
            if (params.numberOfBeatsUntilNextChord === 1) {
                const nextChordRoot: string = this.parseEnharmonicPitch(params.nextChord.root);
                const nextChordScaleType: string = this.chordsToScales[params.nextChord.type];
                const nextScale: Scale = this.getScale(nextChordRoot, nextChordScaleType);

                let nextRoot: Note = this.getNote(nextScale.pitches[0], currentOctave);
                let distanceToNextRoot = lastNote.distanceTo(nextRoot) % 12;

                // we are within a whole step of the next root, play a step above the root in the next chord
                if (Math.abs(distanceToNextRoot) <= 2) {
                    let nextNotePitchIndex: number = MusicUtility.pitchArray.indexOf(nextRoot.pitch);
                    nextNotePitchIndex = (nextNotePitchIndex + 1) % 12;
                    nextNote = this.getNote(MusicUtility.pitchArray[nextNotePitchIndex], currentOctave);
                    directionChange = true;
                    if (params.desiredDirection == "up") {
                        directionChange = true;
                    }
                } else {

                    let next5th: Note = this.getNote(nextScale.pitches[4], currentOctave);
                    let distanceToNextRoot = lastNote.distanceTo(next5th) % 12;
                    
                    if (Math.abs(distanceToNextRoot) <= 2) {
                        let nextNotePitchIndex: number = MusicUtility.pitchArray.indexOf(next5th.pitch);
                        nextNotePitchIndex = (nextNotePitchIndex + 1) % 12;
                        nextNote = this.getNote(MusicUtility.pitchArray[nextNotePitchIndex], currentOctave);
                        if (params.desiredDirection == "up") {
                            directionChange = true;
                        }
                    }
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

        console.log(nextNote.toPlayableString());

        const response = this.newBasslineResponseParams();
        response.noteScheduled = nextNote;
        response.directionChange = directionChange;
        return response;
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
        let currentNoteIndex = MusicUtility.pitchArray.indexOf(pitch[0]);
        let sharpsAndFlats = pitch.substring(1, pitch.length - 1);
        while (sharpsAndFlats.length > 0) {
            const sharpOrFlat = sharpsAndFlats[0];
            if (sharpOrFlat == "#") {
                currentNoteIndex++;
            } else if (sharpOrFlat == "b") {
                currentNoteIndex--;
            }
            sharpsAndFlats = sharpsAndFlats.substring(1, sharpsAndFlats.length);
        }
        const parsedNote = MusicUtility.pitchArray[currentNoteIndex];
        return parsedNote;
    }
}
