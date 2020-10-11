// import { Measure } from '../../song/measure';
// import { Theory } from '../../theory/theory';
// import { Note } from '../../theory/note';
// import { BasslineRequestParams } from './basslineRequestParams';
// import { Chord } from '../../theory/chord';
// import { BasslineRule } from './basslineRule';
// import { DesiredScaleDegreeBasslineRule } from './desiredScaleDegreeBasslineRule';
// import { LastBeatOfCurrentChordBasslineRule } from './lastBeatOfCurrentChordBasslineRule';
// import { ClosestScaleDegreeBasslineRule } from './closestScaleDegreeBasslineRule';
// import { BasslineGenerator } from './basslineGenerator';
// import { BasslineCurrentState } from './basslineCurrentState';

// export class BossaBasslineGenerator extends BasslineGenerator {

//     private static DEFAULT_STARTING_OCTAVE: number = 2;
//     private static DEFAULT_STARTING_DIRECTION: string = "up"
//     private static DIFFICULT_CHORD_TYPES: string[] = ["min7b5", "dim7", "7b9"];
//     private playNextSkipBeat: boolean = true;
//     private lastMeasureUtilized: number = null;

//     constructor(theory: Theory) {
//         super(theory);
//     }

//     public gerenateBasslineEventParams(currentMeasure: Measure, basslineCurrentState: BasslineCurrentState): any[] {
//         if (!basslineCurrentState.currentOctave) {
//             basslineCurrentState.currentOctave = 2;
//             console.log("NO CURRENT STATE");
//         }
//         if (!basslineCurrentState.direction) {
//             basslineCurrentState.direction = "up";
//         }
//         if (this.lastMeasureUtilized != currentMeasure.measureNumber - 1) {
//             this.lastMeasureUtilized = null;
//         }

//         const eventParamArray = [];

//         for (let currentBeat = 0; currentBeat < currentMeasure.numberOfBeats; currentBeat++) {
//             let noteDuration: string = "2n";
//             if (!currentMeasure.nextMeasure) {
//                 // the tune is over:
//                 if (currentBeat === 0) {
//                     noteDuration = "4m";
//                 } else {
//                     break;
//                 }
//             }
//             if (currentBeat === 1) {
//                 // randomly choose to change direction:
//                 const dirSwitch = Math.random() >= 0.9;
//                 if (dirSwitch) {
//                     basslineCurrentState.direction = basslineCurrentState.direction === "up" ? "down" : "up";
//                 }
//             }
//             let noteToSchedule: Note = null;
//             const currentChord: Chord = currentMeasure.chords[currentBeat];
//             let nextChord: Chord = null;
//             if (currentBeat === currentMeasure.numberOfBeats - 1) {
//                 nextChord = currentMeasure.nextMeasure ? currentMeasure.nextMeasure.chords[0] : null;
//             } else {
//                 nextChord = currentMeasure.chords[currentBeat + 1];
//             }

//                 const params: BasslineRequestParams = this.newBasslineRequestParams();
//                 params.previousNoteScheduled = basslineCurrentState.previousNoteScheduled;
//                 params.previousChord = basslineCurrentState.previousChord;
//                 params.currentChord = currentChord;
//                 params.nextChord = nextChord;
//                 params.desiredDirection = basslineCurrentState.direction;
//                 params.beatsAlreadySpentOnCurrentChord = basslineCurrentState.beatsAlreadySpentOnCurrentChord;
//                 params.nextBeatIsStrongBeat = currentBeat === currentMeasure.numberOfBeats - 1;
//                 params.isLastBeatOfCurrentChord = !currentChord.equals(nextChord);
//                 params.requireRoot = false;

//                 // see if this is a special case:
//                 if (!basslineCurrentState.previousNoteScheduled || !nextChord) {
//                     // if we are starting or ending, schedule the root:
//                     params.desiredScaleDegree = 0;
//                     params.desiredOctave = 5
//                 } else if (currentBeat % currentMeasure.numberOfBeats === 0) {
//                     // this is a downbeat, schedule the root:
//                     params.desiredScaleDegree = 0;
//                     params.desiredOctave = basslineCurrentState.currentOctave;
//                 } else if (currentBeat % 2 === 0) {
//                     const scaleDegrees: number[] = [2, 4];
//                     const randomDegree = scaleDegrees[Math.floor(Math.random() * scaleDegrees.length)];
//                     params.desiredScaleDegree = randomDegree;
//                     params.desiredOctave = basslineCurrentState.currentOctave;
//                 } else {
//                     continue;
//                 }

//                 // request the next note:
//                 noteToSchedule = this.getNextBasslineNote(params);

//                 // Save info about this schedule cycle:
//                 basslineCurrentState.previousNoteScheduled = noteToSchedule;
//                 if (basslineCurrentState.previousChord && basslineCurrentState.previousChord.equals(currentChord)) {
//                     basslineCurrentState.beatsAlreadySpentOnCurrentChord++;
//                 } else {
//                     basslineCurrentState.beatsAlreadySpentOnCurrentChord = 0;
//                 }
//                 basslineCurrentState.previousChord = currentChord;
//                 const distFromPrevToNextNote: number = this.theory.distanceTo(basslineCurrentState.previousNoteScheduled, noteToSchedule);
//                 if (basslineCurrentState.direction === "up" && distFromPrevToNextNote < 1) {
//                     basslineCurrentState.direction = "down";
//                 } else if (basslineCurrentState.direction === "down" && distFromPrevToNextNote > 1) {
//                     basslineCurrentState.direction = "up";
//                 }
            

//             console.log(noteToSchedule.toPlayableString());

//             const playCurrentSkipBeat: boolean = this.playNextSkipBeat;
//             this.playNextSkipBeat = Math.random() >= 0.1;
//             if (this.playNextSkipBeat) {
//                 noteDuration = "4n.";
//             }

//             console.log(currentMeasure.numberOfBeats);
//             if (playCurrentSkipBeat && currentMeasure.numberOfBeats > 0) {
//                 const skipBeatDuration: string = "8n";
//                 if (this.lastMeasureUtilized && currentBeat === 0) {
//                     eventParamArray.push({
//                         startTime: `${currentMeasure.measureNumber - 1}:${currentMeasure.numberOfBeats - 1}:2`,
//                         velocity: 0.8,
//                         duration: skipBeatDuration,
//                         velocityOffset: 0,
//                         probability: 1,
//                         note: noteToSchedule.toPlayableString()
//                     });
//                 } else if (currentBeat === 2) {
//                     eventParamArray.push({
//                         startTime: `${currentMeasure.measureNumber}:${currentBeat - 1}:2`,
//                         velocity: 0.8,
//                         duration: skipBeatDuration,
//                         velocityOffset: 0,
//                         probability: 1,
//                         note: noteToSchedule.toPlayableString()
//                     });
//                 }
//             }

//             eventParamArray.push({
//                 startTime: `${currentMeasure.measureNumber}:${currentBeat}:0`,
//                 velocity: 0.8,
//                 duration: noteDuration,
//                 velocityOffset: 0,
//                 probability: 1,
//                 note: noteToSchedule.toPlayableString()
//             });   
//         }

//         this.lastMeasureUtilized = currentMeasure.measureNumber;
//         return eventParamArray;
//     }

//     public getNextBasslineNote(params: BasslineRequestParams): Note {
//         console.log(params);

//         const desiredScaleDegreeRule: BasslineRule = new DesiredScaleDegreeBasslineRule(this.theory);
//         const lastBeatOfCurrentChordRule: BasslineRule = new LastBeatOfCurrentChordBasslineRule(this.theory);
//         const closestScaleDegreeChordRule: BasslineRule = new ClosestScaleDegreeBasslineRule(this.theory);

//         const rules: BasslineRule[] = [desiredScaleDegreeRule, lastBeatOfCurrentChordRule, closestScaleDegreeChordRule];

//         for (const rule of rules) {
//             const note: Note = rule.getMatch(params);
//             if (note) {
//                 return note;
//             }
//         }
//     }

//     newBasslineRequestParams(): BasslineRequestParams {
//         return new BasslineRequestParams();
//     }

// }
