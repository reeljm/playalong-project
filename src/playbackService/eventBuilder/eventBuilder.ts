import { ToneEvent } from 'tone';
import { Instrument } from '../musicians/instrument';

export class EventBuilder {

    private start: string;
    private vel: number;
    private dur: string;
    private velOffset: number;
    private prob: number;
    private n: string;
    private inst: Instrument;
    private eventScheduled: boolean = false;

    static newEventBuilder(): EventBuilder {
        return new EventBuilder();
    }

    startTime(startTime: string): EventBuilder {
        this.start = startTime;
        return this;
    }

    velocity(velocity: number): EventBuilder {
        this.vel = velocity;
        return this;
    }

    duration(duration: string): EventBuilder {
        this.dur = duration;
        return this;
    }

    velocityOffset(velocityOffset: number): EventBuilder {
        this.velOffset = velocityOffset;
        return this;
    }

    probability(probability: number): EventBuilder {
        this.prob = probability;
        return this;
    }

    note(note: string): EventBuilder {
        this.n = note;
        return this;
    }

    instrument(instrument: Instrument): EventBuilder {
        this.inst = instrument;
        return this;
    }

    create(): ToneEvent {
        const self = this;
        const event = new ToneEvent((time) => {
            if (!self.eventScheduled) {
                self.eventScheduled = true;
            this.inst.play(this.n, time, this.dur, this.offset(this.vel, this.velOffset));
            }
        }, {}).start(this.start);
        event.probability = this.prob;
        return event;
    }

    private offset(num: number, plusOrMinusAmount: number): number {
        const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        return  num + plusOrMinus * Math.random() * (plusOrMinusAmount);
    }
}
