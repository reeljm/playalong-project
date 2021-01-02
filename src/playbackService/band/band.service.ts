import { Transport, Loop } from 'tone';
import { Metronome } from '../musicians/metronome/metronome';
import { Musician } from '../musicians/musician';
import { Measure } from '../song/measure';
import { Section } from '../song/section';
import { Song } from '../song/song';

export class BandService {

    private style: string = 'fourFourTime';
    private initialized: boolean = false;
    private newMeasureCallback: () => void;
    public styleOverride: boolean = false;

    constructor(private song: Song, private musicians: Musician[], private metronome: Metronome) { }

    public setStyle(style: string): void {;
        this.style = style;
    }

    public setNewMeasureCallback(fn: () => void): void {
        this.newMeasureCallback = fn;
    }

    public pause(): void {
        Transport.pause('+0');
    }

    public get isPlaying(): boolean {
        return Transport.state === "started";
    }

    public get isPaused(): boolean {
        return Transport.state === "paused";
    }

    public get isStopped(): boolean {
        return Transport.state === "stopped";
    }

    public stop(): void {
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
        this.song.sections.forEach((s: Section) => {
            s.allMeasures.forEach((m: Measure) => {
                m.currentlyPlayingMeasure = false;
            });
            s.allEndings.forEach((e: Measure[]) => {
                e.forEach((m: Measure) => {
                    m.currentlyPlayingMeasure = false;
                })
            });
        });
    }

    public async play(): Promise<void> {
        Transport.context.resume();
        if (!this.initialized) {
            this.createScheduleLoop();
            await this.initialize();
        }
        this.metronome.play(this.song.getFirstMeasure);
        Transport.start();
    }

    public set tempo(tempo: number) {
        Transport.bpm.value = tempo;
    }

    public get tempo(): number {
        return Math.round(Transport.bpm.value);
    }

    public set repeats(tempo: number) {
        this.song.setTotalIterations(tempo);
    }

    public get repeats(): number {
        return this.song.getTotalIterations();
    }

    public get currentRepeat(): number {
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

    private setTransportBasedOnPreviousMeasure(previousMeasure: Measure): void {
        if (previousMeasure && previousMeasure.style === 'fourFourTime') {
            Transport.swing = 0.5;
        } else {
            Transport.swing = 0;
        }
    }

    private createScheduleLoop(): void {
        const self = this;
        let prevMeasure: Measure = null;
        let prevPrevMeasure: Measure = null;
        new Loop(() => {
            this.setTransportBasedOnPreviousMeasure(prevMeasure);
            const currentMeasure: Measure = this.song.nextMeasure();
            if (prevMeasure && currentMeasure) {
                prevMeasure.currentlyPlayingMeasure = true;
            }
            if (prevPrevMeasure) {
                prevPrevMeasure.currentlyPlayingMeasure = false;
            }
            this.newMeasureCallback ? this.newMeasureCallback() : null;
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
            prevPrevMeasure = prevMeasure;
            prevMeasure = currentMeasure;
        }, '1m').start(0);
    }
}
