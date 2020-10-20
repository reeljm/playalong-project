import { BandService as Band, BandService } from "./playbackService/band/band.service";
import { Drummer } from "./playbackService/musicians/drummer/drummer";
import { DrumSet } from "./playbackService/musicians/drummer/drumset";
import { UprightBass } from "./playbackService/musicians/bassist/uprightBass";
import { Bassist } from "./playbackService/musicians/bassist/bassist";
import { WalkingBasslineGenerator } from "./playbackService/musicians/bassist/walkingBasslineGenerator";
import { Theory } from "./playbackService/theory/theory";
import { BossaBasslineGenerator } from "./playbackService/musicians/bassist/bossaBasslineGenerator";
import { BasslineGenerator } from "./playbackService/musicians/bassist/basslineGenerator";
import { Piano } from "./playbackService/musicians/pianist/piano";
import { Pianist } from "./playbackService/musicians/pianist/pianist";
import { Musician } from "./playbackService/musicians/musician";
import { Song } from "./playbackService/song/song";
import { Section } from "./playbackService/song/section";
import { Measure } from "./playbackService/song/measure";
import { Chord } from "./playbackService/theory/chord";

import $ from "jquery";
import "bootstrap";

let band: BandService = null;
let style: string = "fourFourTime";

$(async () => {
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
    const songToPlay: Song = new Song(theory);

    // get metadata for all songs:
    const songsURI = "http://localhost:3000/songs";
    const songsMetadata = await $.get(songsURI);

    // get first song:
    const songDataURI = `http://localhost:3000/songs/id/${songsMetadata[3]._id}`;
    const songData = await $.get(songDataURI);

    songToPlay.deserialize(songData);

    band = new Band(songToPlay, musicians);

    createLeadSheet(songToPlay);

    function createLeadSheet(song: Song) {
        $(".song-name").text(song.songName);

        const sections: Section[] = song.allSections;
        sections.forEach((s: Section) => {
            $(".lead-sheet").append(`<h2 class="section-header">${s.sectionName}</h2>`)
            // create bar lines:
            if (s.repeats) {
                $(".lead-sheet").append(`<img class="bar-line" src="./src/playbackService/staticFiles/svgs/startRepeat.svg">`);
            } else {
                $(".lead-sheet").append(`<img class="bar-line" src="./src/playbackService/staticFiles/svgs/doubleBarLine.svg">`);
            }

            const measures: Measure[] = s.allMeasures;
            const numMeasures: number = measures.length;
            const endings: Measure[][] = s.allEndings || [];
            let measureIndex = 0;
            measures.forEach((m: Measure) => {
                if (measureIndex > 0) {
                    $(".lead-sheet").append(`<img class="bar-line" src="./src/playbackService/staticFiles/svgs/barLine.svg">`);
                }
                const chords: Chord[] = m.chords;
                let previousChord: Chord = null;
                let chordHTML: string = "";
                chords.forEach((c: Chord) => {
                    // create chord symbol
                    const chordEq = (c1: Chord, c2: Chord) => c1.writtenRoot === c2.writtenRoot && c1.type === c2.type;
                    if (!previousChord || !chordEq(c, previousChord)) {
                        chordHTML += `<div class="chord">`;
                        const svgMap: Map<string, string> = new Map([
                            ["A", "A.svg"],
                            ["B", "B.svg"],
                            ["C", "C.svg"],
                            ["D", "D.svg"],
                            ["E", "E.svg"],
                            ["F", "F.svg"],
                            ["G", "G.svg"],
                            ["#", "sharp.svg"],
                            ["b", "flat.svg"],
                            ["5" ,"5.svg"],
                            ["7" ,"7.svg"],
                            ["9" ,"9.svg"],
                            ["dim" ,"dim.svg"],
                            ["alt" ,"alt.svg"],
                            ["maj" ,"maj.svg"],
                            ["min" ,"min.svg"],
                            ["relative min" ,"min.svg"]
                        ]);
                        const tokenizedChord = c.writtenRoot.split("");
                        tokenizedChord.forEach((e: string) => {
                            if (e === "b" || e === "#") {
                                chordHTML += `<img class="chord-symbol" src="./src/playbackService/staticFiles/svgs/${svgMap.get(e)}">`;
                            } else {
                                chordHTML += `<img class="chord-root" src="./src/playbackService/staticFiles/svgs/${svgMap.get(e)}">`;
                            }
                        });

                        let type = c.type;
                        while (type.length > 0) {
                            for (const entry of Array.from(svgMap.entries())) {
                                const key: string = entry[0];
                                const value: string = entry[1];

                                if (type.indexOf(key) === 0) {
                                    chordHTML += `<img class="chord-symbol" src="./src/playbackService/staticFiles/svgs/${value}">`;
                                    type = type.replace(key, "");
                                    continue;
                                }
                            }
                        }
                        chordHTML +=`</div>`
                        previousChord = c;
                    }
                });

                $(".lead-sheet").append(`<div class="measure">${chordHTML}</div>`);

                if (((measureIndex + 1) % 4) === 0 && (measureIndex !== numMeasures - 1 || endings.length > 0)) {
                    $(".lead-sheet").append(`<img class="bar-line" src="./src/playbackService/staticFiles/svgs/barLine.svg">`);
                    $(".lead-sheet").append(`<br>`);
                }
                measureIndex++;
            });



            let endingNumber: number = 1;
            endings.forEach((ending: Measure[]) => {
                let initialMeasure = true;
                if (endingNumber !== 1) {
                    $(".lead-sheet").append(`<br>`)
                }
                ending.forEach((m: Measure) => {
                    $(".lead-sheet").append(`<img class="bar-line" src="./src/playbackService/staticFiles/svgs/barLine.svg">`);
                    if (initialMeasure) {
                        initialMeasure = false;
                        let markerHTML: string = "";
                        markerHTML += `<img class="ending-marker" src="./src/playbackService/staticFiles/svgs/repeatBracket.svg">`;
                        markerHTML += `<img class="ending-marker" src="./src/playbackService/staticFiles/svgs/repeat${endingNumber}.svg">`;
                        $(".lead-sheet").append(`<div class="ending-marker-container">${markerHTML}</div>`);
                    }
                    const chords: Chord[] = m.chords;
                    let previousChord: Chord = null;
                    let chordHTML: string = "";
                    chords.forEach((c: Chord) => {
                        // create chord symbol
                        const chordEq = (c1: Chord, c2: Chord) => {
                            return c1.writtenRoot === c2.writtenRoot && c1.type === c2.type;
                        };
                        if (!previousChord || !chordEq(c, previousChord)) {
                            chordHTML += `<div class="chord">`;
                            const svgMap: Map<string, string> = new Map([
                                ["A", "A.svg"],
                                ["B", "B.svg"],
                                ["C", "C.svg"],
                                ["D", "D.svg"],
                                ["E", "E.svg"],
                                ["F", "F.svg"],
                                ["G", "G.svg"],
                                ["#", "sharp.svg"],
                                ["b", "flat.svg"],
                                ["5" ,"5.svg"],
                                ["7" ,"7.svg"],
                                ["9" ,"9.svg"],
                                ["dim" ,"dim.svg"],
                                ["alt" ,"alt.svg"],
                                ["maj" ,"maj.svg"],
                                ["min" ,"min.svg"],
                                ["relative min" ,"min.svg"]
                            ]);
                            const tokenizedChord = c.writtenRoot.split("");
                            tokenizedChord.forEach((e: string) => {
                                if (e === "b" || e === "#") {
                                    chordHTML += `<img class="chord-symbol" src="./src/playbackService/staticFiles/svgs/${svgMap.get(e)}">`;
                                } else {
                                    chordHTML += `<img class="chord-root" src="./src/playbackService/staticFiles/svgs/${svgMap.get(e)}">`;
                                }
                            });

                            let type = c.type;
                            while (type.length > 0) {
                                for (const entry of Array.from(svgMap.entries())) {
                                    const key: string = entry[0];
                                    const value: string = entry[1];

                                    if (type.indexOf(key) === 0) {
                                        chordHTML += `<img class="chord-symbol" src="./src/playbackService/staticFiles/svgs/${value}">`;
                                        type = type.replace(key, "");
                                        continue;
                                    }
                                }
                            }
                            chordHTML+=`</div>`
                            previousChord = c;
                        }
                    });
                    $(".lead-sheet").append(`<div class="measure">${chordHTML}</div>`);
                });
                if (endingNumber !== endings.length) {
                    $(".lead-sheet").append(`<img class="bar-line" src="./src/playbackService/staticFiles/svgs/endRepeat.svg">`);
                }
                endingNumber++;
            });

            if (s.repeats && !endings) {
                $(".lead-sheet").append(`<img class="bar-line" src="./src/playbackService/staticFiles/svgs/endRepeat.svg">`);
            } else {
                $(".lead-sheet").append(`<img class="bar-line" src="./src/playbackService/staticFiles/svgs/doubleBarLine.svg">`);
            }
            $(".lead-sheet").append(`<br>`)
        });
    }

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
