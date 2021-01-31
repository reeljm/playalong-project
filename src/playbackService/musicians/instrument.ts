import { Sampler } from 'tone';

export abstract class Instrument {

    public static VOLUME_MIN: number = -20;
    public static VOLUME_MAX: number = 5;

    protected sampler: Sampler;
    protected abstract volumeVal: number;
    public abstract instrumentName: string;

    static build<T extends Instrument>(constructorFn: new () => T): Promise<Instrument> {
        return new Promise((resolve, reject) => {
            const instrument = new constructorFn();
            instrument.loadInstrument()
                .then(() => {
                    resolve(instrument);
                })
                .catch(() => {
                    reject();
                });
        });
    }

    public get volume(): number {
        return this.volumeVal;
    }

    public set volume(val: number) {
        if (!this.sampler) {
            this.volumeVal = val;
        } else {
            this.volumeVal = val;
            this.sampler.volume.value = this.volumeVal;
            if (val === Instrument.VOLUME_MIN) {
                this.mute();
            } else {
                this.unmute();
            }
        }
    }

    abstract loadInstrument(): Promise<void>;

    abstract mute(): void;

    abstract unmute(): void;

    abstract play(soundName: string, startTime: number, duration?: string , velocity?: number): void;

}
