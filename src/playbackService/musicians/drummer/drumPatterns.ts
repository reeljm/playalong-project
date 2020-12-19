export class DrumPattern {
    numberOfMeasures = 1;
    allowsComping = false;
    parts: Parts;
}

export class Parts {
    rideCym?: EventParams[];
    hatChick?: EventParams[];
    crossStick?: EventParams[];
    highTom?: EventParams[];
    snare?: EventParams[];
    kick?: EventParams[];
}

export class EventParams {
    start: string;
    velocity?: number;
    velocityOffset?: number;
    probability?: number;
    duration?: string;
}
