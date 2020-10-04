import { Sampler } from 'tone';
import { Instrument } from '../instrument';
import { Note } from '../../theory/note';

export class UprightBass extends Instrument {
    static LOWEST_NOTE = Note.getNote("E", 1);
    static HIGHEST_NOTE = Note.getNote("B", 3);

    sampler: Sampler;

    loadInstrument(): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            try {
                const fileConfig = {
                    'E1.wav':   './src/playbackService/staticFiles/samples/upright-bass/E_1.wav',  // 1
                    'F1.wav':   './src/playbackService/staticFiles/samples/upright-bass/F_1.wav',
                    'F#1.wav':  './src/playbackService/staticFiles/samples/upright-bass/Fs_1.wav',
                    'G1.wav':   './src/playbackService/staticFiles/samples/upright-bass/G_1.wav',
                    'G#1.wav':  './src/playbackService/staticFiles/samples/upright-bass/Gs_1.wav',
                    'A1.wav':   './src/playbackService/staticFiles/samples/upright-bass/A_1.wav',
                    'A#1.wav':  './src/playbackService/staticFiles/samples/upright-bass/As_1.wav',
                    'B1.wav':   './src/playbackService/staticFiles/samples/upright-bass/B_1.wav',
                    'C2.wav':   './src/playbackService/staticFiles/samples/upright-bass/C_2.wav',
                    'C#2.wav':  './src/playbackService/staticFiles/samples/upright-bass/Cs_2.wav',
                    'D2.wav':   './src/playbackService/staticFiles/samples/upright-bass/D_2.wav',
                    'D#2.wav':  './src/playbackService/staticFiles/samples/upright-bass/Ds_2.wav',
                    'E2.wav':   './src/playbackService/staticFiles/samples/upright-bass/E_2.wav',
                    'F2.wav':   './src/playbackService/staticFiles/samples/upright-bass/F_2.wav',
                    'F#2.wav':  './src/playbackService/staticFiles/samples/upright-bass/Fs_2.wav',
                    'G2.wav':   './src/playbackService/staticFiles/samples/upright-bass/G_2.wav',
                    'G#2.wav':  './src/playbackService/staticFiles/samples/upright-bass/Gs_2.wav',
                    'A2.wav':   './src/playbackService/staticFiles/samples/upright-bass/A_2.wav',
                    'A#2.wav':  './src/playbackService/staticFiles/samples/upright-bass/As_2.wav',
                    'B2.wav':   './src/playbackService/staticFiles/samples/upright-bass/B_2.wav',
                    'C3.wav':   './src/playbackService/staticFiles/samples/upright-bass/C_3.wav',
                    'C#3.wav':  './src/playbackService/staticFiles/samples/upright-bass/Cs_3.wav',
                    'D3.wav':   './src/playbackService/staticFiles/samples/upright-bass/D_3.wav',
                    'D#3.wav':  './src/playbackService/staticFiles/samples/upright-bass/Ds_3.wav',
                    'E3.wav':   './src/playbackService/staticFiles/samples/upright-bass/E_3.wav',
                    'F3.wav':   './src/playbackService/staticFiles/samples/upright-bass/F_3.wav',
                    'F#3.wav':  './src/playbackService/staticFiles/samples/upright-bass/Fs_3.wav',
                    'G3.wav':   './src/playbackService/staticFiles/samples/upright-bass/G_3.wav',
                    'G#3.wav':  './src/playbackService/staticFiles/samples/upright-bass/Gs_3.wav',
                    'A3.wav':  './src/playbackService/staticFiles/samples/upright-bass/A_3.wav',
                    'A#3.wav':  './src/playbackService/staticFiles/samples/upright-bass/As_3.wav',
                    'B3.wav':  './src/playbackService/staticFiles/samples/upright-bass/B_3.wav'
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
