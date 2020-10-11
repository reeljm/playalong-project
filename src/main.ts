import { BandService as Band, BandService } from "./playbackService/band/band.service";
import { Drummer } from "./playbackService/musicians/drummer/drummer";
import { DrumSet } from "./playbackService/musicians/drummer/drumset";
import { UprightBass } from "./playbackService/musicians/bassist/uprightBass";
import { Bassist } from "./playbackService/musicians/bassist/bassist";
import { WalkingBasslineGenerator } from "./playbackService/musicians/bassist/walkingBasslineGenerator";
import { Theory } from "./playbackService/theory/theory";
import { BossaBasslineGenerator } from "./playbackService/musicians/bassist/bossaBasslineGenerator";
import { BasslineGenerator } from "./playbackService/musicians/bassist/basslineGenerator";

import $ from "jquery";
import "bootstrap";

let band: BandService = null;
let style: string = "fourFourTime";

$(() => {
    // initialize player
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
    band = new Band(drummer, bassist, theory);

    $("#pause").hide();
    $("#play").on("click", () => {
        $("#play").hide();
        $("#pause").show();
        band.play();
    });
    
    $("#pause").on("click", () => {
        $("#pause").hide();
        $("#play").show();
        band.pause();
    });

    $("#stop").on("click", () => {
        $("#pause").hide();
        $("#play").show();
        band.stop();
    });

    $("#swing").on("click", () => {
        style = "fourFourTime";
        band.setStyle(style);
    });

    $("#latin").on("click", () => {
        style = "bossa";
        band.setStyle(style);
    });
});
