import { Transport, Loop } from 'tone';
import { Metronome } from '../musicians/metronome/metronome';
import { Musician } from '../musicians/musician';
import { Measure } from '../song/measure';
import { Song } from '../song/song';

export class BandService {

    private style: string = 'fourFourTime';
    private initialized: boolean = false;
    private tempo: number = 120;
    private newMeasureCallback: Function;
    private newChorusCallback: Function;
    private instrumentTransposition: string = "C";
    public styleOverride: boolean = false;

    constructor(private song: Song, private musicians: Musician[], private metronome: Metronome) { }

    public setStyle(style: string) {
        this.style = style;
    }

    public setNewMeasureCallback(fn: Function) {
        this.newMeasureCallback = fn;
    }

    public setNewChorusCallback(fn: Function) {
        this.newChorusCallback = fn;
    }

    public pause() {
        Transport.pause('+0');
    }

    public stop() {
        Transport.stop();
        Transport.cancel(0);
        if (this.initialized) {
            this.createScheduleLoop();
            this.song.restart();
        }
        for (const entry of Array.from(this.musicians.entries())) {
            const musician: Musician = entry[1];
            musician.clearCache();
        }
    }

    public async play() {
        Transport.swing = 0.5;
        Transport.bpm.value = this.tempo;
        Transport.context.resume();
        if (!this.initialized) {
            this.createScheduleLoop();
            await this.initialize();
        }
        this.metronome.play(this.song.getFirstMeasure);
        Transport.start();
    }

    public setTempo(tempo: number) {
        this.tempo = tempo;
        Transport.bpm.value = this.tempo;
    }

    public getTempo() {
        return this.tempo;
    }

    public setRepeats(tempo: number) {
        this.song.setTotalIterations(tempo);
    }

    public getRepeats() {
        return this.song.getTotalIterations();
    }

    public getCurrentRepeat() {
        return this.song.getCurrentIteration();
    }

    public setSong(song: Song): void {
        this.song = song;
    }

    private async initialize(): Promise<void> {
        for (let i = 0; i < this.musicians.length; i++) {
            await this.musicians[i].initialize();
        }
        await this.metronome.initialize();
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
            this.newMeasureCallback(previousMeasure);
            if (this.song.runNewChorusCallback) {
                this.newChorusCallback();
            }
            if (!currentMeasure) {
                self.pause();
                return;
            }
            if (this.styleOverride) {
                currentMeasure.style = this.style;
            } else {
                currentMeasure.style = currentMeasure.originalStyle;
            }
            self.musicians.forEach(musician => musician.play(currentMeasure));
            previousMeasure = currentMeasure;
        }, '1m').start(0);
    }
}
