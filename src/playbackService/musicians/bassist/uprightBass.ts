import { Sampler } from 'tone';
import { Instrument } from '../instrument';
import { Note } from '../../theory/note';

export class UprightBass extends Instrument {
    static LOWEST_NOTE = Note.getNote("E", 4);
    static HIGHEST_NOTE = Note.getNote("G#", 6);
    // static LOWEST_NOTE = { pitch: 'E', octave: 4, interval: 0 };
    // static HIGHEST_NOTE = { pitch: 'Gs', octave: 6, interval: 0 };

    sampler: Sampler;

    loadInstrument(): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            try {
                const fileConfig = {
                    'E_1.mp3':   './src/playbackService/staticFiles/samples/upright-bass/E_1.mp3',  // 1
                    'F_1.mp3':   './src/playbackService/staticFiles/samples/upright-bass/F_1.mp3',
                    'Fs_1.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Fs_1.mp3',
                    'G_1.mp3':   './src/playbackService/staticFiles/samples/upright-bass/G_1.mp3',
                    'Gs_1.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Gs_1.mp3',
                    'A_1.mp3':   './src/playbackService/staticFiles/samples/upright-bass/A_1.mp3',
                    'As_1.mp3':  './src/playbackService/staticFiles/samples/upright-bass/As_1.mp3',
                    'B_1.mp3':   './src/playbackService/staticFiles/samples/upright-bass/B_1.mp3',
                    'C_2.mp3':   './src/playbackService/staticFiles/samples/upright-bass/C_2.mp3',
                    'Cs_2.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Cs_2.mp3',
                    'D_2.mp3':   './src/playbackService/staticFiles/samples/upright-bass/D_2.mp3',
                    'Ds_2.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Ds_2.mp3',
                    'E_2.mp3':   './src/playbackService/staticFiles/samples/upright-bass/E_2.mp3',
                    'F_2.mp3':   './src/playbackService/staticFiles/samples/upright-bass/F_2.mp3',
                    'Fs_2.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Fs_2.mp3',
                    'G_2.mp3':   './src/playbackService/staticFiles/samples/upright-bass/G_2.mp3',
                    'Gs_2.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Gs_2.mp3',
                    'A_2.mp3':   './src/playbackService/staticFiles/samples/upright-bass/A_2.mp3',
                    'As_2.mp3':  './src/playbackService/staticFiles/samples/upright-bass/As_2.mp3',
                    'B_2.mp3':   './src/playbackService/staticFiles/samples/upright-bass/B_2.mp3',
                    'C_3.mp3':   './src/playbackService/staticFiles/samples/upright-bass/C_3.mp3',
                    'Cs_3.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Cs_3.mp3',
                    'D_3.mp3':   './src/playbackService/staticFiles/samples/upright-bass/D_3.mp3',
                    'Ds_3.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Ds_3.mp3',
                    'E_3.mp3':   './src/playbackService/staticFiles/samples/upright-bass/E_3.mp3',
                    'F_3.mp3':   './src/playbackService/staticFiles/samples/upright-bass/F_3.mp3',
                    'Fs_3.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Fs_3.mp3',
                    'G_3.mp3':   './src/playbackService/staticFiles/samples/upright-bass/G_3.mp3',
                    'Gs_3.mp3':  './src/playbackService/staticFiles/samples/upright-bass/Gs_3.mp3',
                    'A_3.mp3':  './src/playbackService/staticFiles/samples/upright-bass/A_3.mp3',
                    'As_3.mp3':  './src/playbackService/staticFiles/samples/upright-bass/As_3.mp3',
                    'B_3.mp3':  './src/playbackService/staticFiles/samples/upright-bass/B_3.mp3'
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
