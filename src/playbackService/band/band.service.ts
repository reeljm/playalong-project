import { Transport, Loop } from 'tone';
import { Musician } from '../musicians/musician';
import { Measure } from '../song/measure';
import { Song } from '../song/song';

export class BandService {

    private style: string = 'fourFourTime';
    private initialized: boolean = false;
    private tempo: number = 120;

    constructor(private song: Song, private musicians: Musician[]) { }

    public setStyle(style: string) {
        this.style = style;
    }

    public pause() {
        Transport.pause('+0');
    }

    public stop() {
        Transport.stop();
        Transport.cancel(0);
        this.createScheduleLoop();
        this.song.restart();
    }

    public play() {
        Transport.swing = 0.5;
        Transport.bpm.value = this.tempo;
        Transport.context.resume();
        if (!this.initialized) {
            this.initialize()
            .then(() => Transport.start());
        } else {
            Transport.start();
        }
    }

    public setTempo(tempo: number) {
        this.tempo = tempo;
        Transport.bpm.value = this.tempo;
    }

    public getTempo() {
        return this.tempo;
    }

    public setSong(song: Song): void {
        this.song = song;
    }

    private async initialize(): Promise<void> {
        this.musicians.forEach(async (m:Musician) => {
            await m.initialize();
        });
        this.createScheduleLoop();
        this.initialized = true;
    }

    private setTransportBasedOnPreviousMeasure(previousMeasure: Measure) {
        if (previousMeasure && previousMeasure.style === 'fourFourTime') {
            Transport.swing = 0.5;
        } else {
            Transport.swing = 0;
        }
    }

    private createScheduleLoop() {
        const self = this;
        let previousMeasure: Measure = null;
        new Loop(() => {
            this.setTransportBasedOnPreviousMeasure(previousMeasure);
            const currentMeasure: Measure = this.song.nextMeasure();
            if (!currentMeasure) {
                self.pause();
                return;
            }
            currentMeasure.style = this.style;
            self.musicians.forEach(musician => musician.play(currentMeasure));
            previousMeasure = currentMeasure;
        }, '1m').start(0);
    }
}
