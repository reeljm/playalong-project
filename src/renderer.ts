// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

import { BandService } from "./playbackService/band/band.service";
import { Drummer } from "./playbackService/musicians/drummer/drummer";
import { DrumSet } from "./playbackService/musicians/drummer/drumset";
import { UprightBass } from "./playbackService/musicians/bassist/uprightBass";
import { Bassist } from "./playbackService/musicians/bassist/bassist";
import { BasslineGenerator } from "./playbackService/musicians/bassist/basslineGenerator";
import { Theory } from "./playbackService/theory/theory";

const bass = new UprightBass();
const drumset = new DrumSet();
const theory = new Theory();
const basslineGenerator = new BasslineGenerator(theory);
const bassist = new Bassist(bass, basslineGenerator);
const drummer = new Drummer(drumset);
const band = new BandService(drummer, bassist, theory);
band.play();
