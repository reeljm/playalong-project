import { Panner, Sampler } from 'tone';
import { Instrument } from '../instrument';
import { Note } from '../../theory/note';
import rawData from '../../staticFiles/samples/piano/config.json';
const fileConfig = (rawData as any);

export class UprightBass extends Instrument {
    static LOWEST_NOTE = Note.getNote("C", 2);
    static HIGHEST_NOTE = Note.getNote("C", 4);

    sampler: Sampler;

    loadInstrument(): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            try {
                self.sampler = new Sampler(fileConfig, () => resolve());
                this.sampler.volume.value = 6;
                const panner: Panner = new Panner().toDestination();
                panner.pan.value = 0.75;
                this.sampler.connect(panner);
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
