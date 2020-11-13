import { Panner, Sampler } from 'tone';
import { Instrument } from '../instrument';
import rawData from '../../staticFiles/samples/metronome/config.json';
const fileConfig = (rawData as any);

export class MetronomeInstrument extends Instrument {

    sampler: Sampler;

    loadInstrument(): Promise<void> {
        const self = this;
        return new Promise((resolve, reject) => {
            try {
                self.sampler = new Sampler(fileConfig, () => {
                    self.sampler.volume.value = 6;
                    const panner: Panner = new Panner().toDestination();
                    panner.pan.value = 0;
                    self.sampler.connect(panner);
                    resolve();
                });
            } catch (error) {
                alert('error loading instrument');
                reject();
            }
        });
    }

    play(soundName: string, startTime: number, duration?: string, velocity?: number): void {
        this.sampler.triggerAttackRelease(soundName, duration, startTime);
    }

}
