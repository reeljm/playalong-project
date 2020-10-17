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
import { Piano } from "./playbackService/musicians/pianist/piano";
import { Pianist } from "./playbackService/musicians/pianist/pianist";
import { Musician } from "./playbackService/musicians/musician";
import { Song } from "./playbackService/song/song";

let band: BandService = null;
let style: string = "fourFourTime";

$(() => {
    // initialize player
    const bass: UprightBass = new UprightBass();
    const drumset: DrumSet = new DrumSet();
    const piano: Piano = new Piano();
    const theory: Theory = new Theory();

    // configure bassist
    const basslineGeneratorMap: Map<string, BasslineGenerator> = new Map<string, BasslineGenerator>();
    const walkingBasslineGenerator: BasslineGenerator = new WalkingBasslineGenerator(theory);
    const bossaBasslineGenerator: BasslineGenerator = new BossaBasslineGenerator(theory);
    basslineGeneratorMap.set("bossa", bossaBasslineGenerator);
    basslineGeneratorMap.set("fourFourTime", walkingBasslineGenerator);
    const bassist: Bassist = new Bassist(bass, basslineGeneratorMap);

    const drummer: Drummer = new Drummer(drumset);
    const pianist: Pianist = new Pianist(piano, theory);
    const musicians: Musician[] = [pianist, drummer, bassist];
    const song: Song = new Song(theory);
    band = new Band(song, musicians);

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

    const parseTempoAndSetVal = (tempoNum: number) => {
        if (isNaN(tempoNum) || tempoNum > 400 || tempoNum < 40) {
            $("#tempo").val(band.getTempo());
            return;
        }
        band.setTempo(tempoNum);
        $("#tempo").val(tempoNum);
    };

    $("#tempo").on("change", function() {
        const tempoNum: number = parseInt($(this).val().toString(), 0x0);
        parseTempoAndSetVal(tempoNum);
    });

    $("#tempo-increase").on("click", () => {
        band.getTempo()
        parseTempoAndSetVal(band.getTempo() + 1);
    });

    $("#tempo-decrease").on("click", () => {
        band.getTempo()
        parseTempoAndSetVal(band.getTempo() - 1);
    });

    $("#style").on("change", function() {
        const styleInput: string = $(this).val().toString()
        band.setStyle(styleInput);
    });
});
