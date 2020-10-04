// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

import { BandService as Band } from "./playbackService/band/band.service";
import { Drummer } from "./playbackService/musicians/drummer/drummer";
import { DrumSet } from "./playbackService/musicians/drummer/drumset";
import { UprightBass } from "./playbackService/musicians/bassist/uprightBass";
import { Bassist } from "./playbackService/musicians/bassist/bassist";
import { WalkingBasslineGenerator } from "./playbackService/musicians/bassist/walkingBasslineGenerator";
import { Theory } from "./playbackService/theory/theory";
import { BossaBasslineGenerator } from "./playbackService/musicians/bassist/bossaBasslineGenerator";
import { BasslineGenerator } from "./playbackService/musicians/bassist/basslineGenerator";

const bass: UprightBass = new UprightBass();
const drumset: DrumSet = new DrumSet();
const theory: Theory = new Theory();

const basslineGeneratorMap: Map<string, BasslineGenerator> = new Map<string, BasslineGenerator>();
const walkingBasslineGenerator: BasslineGenerator = new WalkingBasslineGenerator(theory);
const bossaBasslineGenerator: BasslineGenerator = new BossaBasslineGenerator(theory);
basslineGeneratorMap.set("bossa", bossaBasslineGenerator);
basslineGeneratorMap.set("fourFourTime", walkingBasslineGenerator);
const bassist: Bassist = new Bassist(bass, basslineGeneratorMap);

const drummer: Drummer = new Drummer(drumset);
const band: Band = new Band(drummer, bassist, theory);
band.play();
