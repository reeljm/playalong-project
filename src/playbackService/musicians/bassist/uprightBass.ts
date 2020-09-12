import { Sampler } from 'tone';
import { Instrument } from '../instrument';
import { Note } from '../../theory/note';

export class UprightBass extends Instrument {
    static LOWEST_NOTE = Note.getNote("E", 4);
    static HIGHEST_NOTE = Note.getNote("G#", 6);

    sampler: Sampler;

    loadInstrument(): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            try {
                const fileConfig = {
                    'E4.mp3':   './src/playbackService/staticFiles/samples/upright-bass/E4.mp3',  // 1
                    'F4.mp3':   './src/playbackService/staticFiles/samples/upright-bass/F4.mp3',
                    'F#4.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Fs4.mp3',
                    'G4.mp3':   './src/playbackService/staticFiles/samples/upright-bass/G4.mp3',
                    'G#4.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Gs4.mp3',
                    'A4.mp3':   './src/playbackService/staticFiles/samples/upright-bass/A4.mp3',
                    'A#4.mp3':  './src/playbackService/staticFiles/samples/upright-bass/As4.mp3',
                    'B4.mp3':   './src/playbackService/staticFiles/samples/upright-bass/B4.mp3',
                    'C5.mp3':   './src/playbackService/staticFiles/samples/upright-bass/C5.mp3',
                    'C#5.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Cs5.mp3',
                    'D5.mp3':   './src/playbackService/staticFiles/samples/upright-bass/D5.mp3',
                    'D#5.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Ds5.mp3', // 1
                    'E5.mp3':   './src/playbackService/staticFiles/samples/upright-bass/E5.mp3',  // 2
                    'F5.mp3':   './src/playbackService/staticFiles/samples/upright-bass/F5.mp3',
                    'F#5.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Fs5.mp3',
                    'G5.mp3':   './src/playbackService/staticFiles/samples/upright-bass/G5.mp3',
                    'G#5.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Gs5.mp3',
                    'A5.mp3':   './src/playbackService/staticFiles/samples/upright-bass/A5.mp3',
                    'A#5.mp3':  './src/playbackService/staticFiles/samples/upright-bass/As5.mp3',
                    'B5.mp3':   './src/playbackService/staticFiles/samples/upright-bass/B5.mp3',
                    'C6.mp3':   './src/playbackService/staticFiles/samples/upright-bass/C6.mp3',
                    'C#6.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Cs6.mp3',
                    'D6.mp3':   './src/playbackService/staticFiles/samples/upright-bass/D6.mp3',
                    'D#6.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Ds6.mp3', // 2
                    'E6.mp3':   './src/playbackService/staticFiles/samples/upright-bass/E6.mp3',  // 3
                    'F6.mp3':   './src/playbackService/staticFiles/samples/upright-bass/F6.mp3',
                    'F#6.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Fs6.mp3',
                    'G6.mp3':   './src/playbackService/staticFiles/samples/upright-bass/G6.mp3',
                    'G#6.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Gs6.mp3',
                 };
                self.sampler = new Sampler(fileConfig, () => {
                    resolve();
                }).toDestination();
            } catch (error) {
                alert('error loading instrument');
                reject();
            }
        });
    }

    play(soundName: string, startTime: number, duration?: string, velocity?: number): void {
        this.sampler.triggerAttackRelease(soundName, duration, startTime, velocity);
    }

}
