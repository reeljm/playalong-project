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
import { Metronome } from "./playbackService/musicians/metronome/metronome";
import { MetronomeInstrument } from "./playbackService/musicians/metronome/metronomeInstrument";
import { Musician } from "./playbackService/musicians/musician";
import { Song } from "./playbackService/song/song";
import { Section } from "./playbackService/song/section";
import { Measure } from "./playbackService/song/measure";
import { Chord } from "./playbackService/theory/chord";
import $ from "jquery";

// require instrument samples:
function requireAll(r: any) { r.keys().forEach(r); }
requireAll(require.context('./playbackService/staticFiles/samples/upright-bass', true, /\.mp3$/));
requireAll(require.context('./playbackService/staticFiles/samples/piano', true, /\.mp3$/));
requireAll(require.context('./playbackService/staticFiles/samples/drums', true, /\.mp3$/));

// require svgs:
requireAll(require.context('./playbackService/staticFiles/svgs', true, /\.svg$/));

let band: BandService = null;
let style: string = "fourFourTime";

$(async () => {
    // initialize player
    const bass: UprightBass = new UprightBass();
    const drumset: DrumSet = new DrumSet();
    const piano: Piano = new Piano();
    const metronomeInstrument: MetronomeInstrument = new MetronomeInstrument();
    const theory: Theory = new Theory();

    // configure bassist
    const basslineGeneratorMap: Map<string, BasslineGenerator> = new Map<string, BasslineGenerator>();
    const walkingBasslineGenerator: BasslineGenerator = new WalkingBasslineGenerator(theory);
    const bossaBasslineGenerator: BasslineGenerator = new BossaBasslineGenerator(theory);
    basslineGeneratorMap.set("bossa", bossaBasslineGenerator);
    basslineGeneratorMap.set("mambo", bossaBasslineGenerator);
    basslineGeneratorMap.set("fourFourTime", walkingBasslineGenerator);
    const bassist: Bassist = new Bassist(bass, basslineGeneratorMap);

    const drummer: Drummer = new Drummer(drumset);
    const pianist: Pianist = new Pianist(piano, theory);
    const countIn: Metronome = new Metronome(metronomeInstrument);
    const musicians: Musician[] = [pianist, drummer, bassist];


    // get metadata for all songs:
    const server: string = process.env.PLAYALONG_URL;
    const songsURI: string = `https://${server}/songs`;
    const songsMetadata: any[] = await $.get(songsURI);

    // get first song:
    let songIndex: number = 0;
    const songDataURI: string = `https://${server}/songs/id/${songsMetadata[songIndex]._id}`;
    const songData: any = await $.get(songDataURI);
    let transposingKey: string = "C";
    let songToPlay: Song = new Song(theory);
    songToPlay.deserialize(songData);
    $("#tempo").val(songToPlay.songTempo);
    songToPlay.transposeDisplayedChords(transposingKey);
    createLeadSheet(songToPlay);
    $(`#transpose-${transposingKey}`).addClass("selected-transposing-key");
    $(".style-select").hide();
    band = new Band(songToPlay, musicians, countIn);
    band.setTempo(songToPlay.songTempo);
    band.setNewMeasureCallback((measure: Measure) => {
        $(".highlighted-measure").removeClass("highlighted-measure");
        if (measure && measure.nextMeasure) {
            $(`#${measure.uniqueID}`).addClass("highlighted-measure");
        }
    });

    band.setNewChorusCallback(() => {
        parseRepeatsAndSetVal(band.getRepeats());
    });


    function createLeadSheet(song: Song) {
        $("#lead-sheet").hide();
        $(".lead-sheet").empty();
        $(".song-name").text(song.songName);

        function createUUID(): string {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        const sections: Section[] = song.allSections;
        sections.forEach((s: Section) => {
            $(".lead-sheet").append(`<h2 class="section-header">${s.sectionName}</h2>`)
            // create bar lines:
            if (s.repeats) {
                $(".lead-sheet").append(`<img class="bar-line" src="./assets/svgs/startRepeat.svg">`);
            } else {
                $(".lead-sheet").append(`<img class="bar-line" src="./assets/svgs/doubleBarLine.svg">`);
            }

            const measures: Measure[] = s.allMeasures;
            const numMeasures: number = measures.length;
            const endings: Measure[][] = s.allEndings || [];
            let measureIndex = 0;
            measures.forEach((m: Measure) => {
                if (measureIndex > 0) {
                    $(".lead-sheet").append(`<img class="bar-line" src="./assets/svgs/barLine.svg">`);
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
                            ["Maj" ,"maj.svg"],
                            ["min" ,"min.svg"],
                            ["relative min" ,"min.svg"]
                        ]);
                        const tokenizedChord = c.writtenRoot.split("");
                        tokenizedChord.forEach((e: string) => {
                            if (e === "b" || e === "#") {
                                chordHTML += `<img class="chord-symbol" src="./assets/svgs/${svgMap.get(e)}">`;
                            } else {
                                chordHTML += `<img class="chord-root" src="./assets/svgs/${svgMap.get(e)}">`;
                            }
                        });

                        let type = c.type;
                        while (type.length > 0) {
                            for (const entry of Array.from(svgMap.entries())) {
                                const key: string = entry[0];
                                const value: string = entry[1];

                                if (type.indexOf(key) === 0) {
                                    chordHTML += `<img class="chord-symbol" src="./assets/svgs/${value}">`;
                                    type = type.replace(key, "");
                                    continue;
                                }
                            }
                        }
                        chordHTML +=`</div>`
                        previousChord = c;
                    }
                });

                const uuid: string = createUUID();
                m.uniqueID = uuid;
                $(".lead-sheet").append(`<div id='${uuid}' class="measure">${chordHTML}</div>`);

                if (((measureIndex + 1) % 4) === 0 && (measureIndex !== numMeasures - 1 || endings.length > 0)) {
                    $(".lead-sheet").append(`<img class="bar-line" src="./assets/svgs/barLine.svg">`);
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
                let endingMeasureNumber: number = 1;
                const endingLength: number = ending.length;
                ending.forEach((m: Measure) => {
                    $(".lead-sheet").append(`<img class="bar-line" src="./assets/svgs/barLine.svg">`);
                    if (initialMeasure) {
                        initialMeasure = false;
                        let markerHTML: string = "";
                        markerHTML += `<img class="ending-marker" src="./assets/svgs/repeatBracket.svg">`;
                        markerHTML += `<img class="ending-marker" src="./assets/svgs/repeat${endingNumber}.svg">`;
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
                                    chordHTML += `<img class="chord-symbol" src="./assets/svgs/${svgMap.get(e)}">`;
                                } else {
                                    chordHTML += `<img class="chord-root" src="./assets/svgs/${svgMap.get(e)}">`;
                                }
                            });

                            let type = c.type;
                            while (type.length > 0) {
                                for (const entry of Array.from(svgMap.entries())) {
                                    const key: string = entry[0];
                                    const value: string = entry[1];

                                    if (type.indexOf(key) === 0) {
                                        chordHTML += `<img class="chord-symbol" src="./assets/svgs/${value}">`;
                                        type = type.replace(key, "");
                                        continue;
                                    }
                                }
                            }
                            chordHTML+=`</div>`
                            previousChord = c;
                        }
                    });
                    const uuid: string = createUUID();
                    m.uniqueID = uuid;
                    $(".lead-sheet").append(`<div id='${uuid}' class="measure">${chordHTML}</div>`);

                    if (((measureIndex + 1) % 4) === 0 && endingMeasureNumber != endingLength) {
                        $(".lead-sheet").append(`<img class="bar-line" src="./assets/svgs/barLine.svg">`);
                        $(".lead-sheet").append(`<br>`);
                    }
                    measureIndex++;
                    endingMeasureNumber++;

                });
                if (endingNumber !== endings.length) {
                    $(".lead-sheet").append(`<img class="bar-line" src="./assets/svgs/endRepeat.svg">`);
                }
                endingNumber++;
            });

            if (s.repeats && !endings) {
                $(".lead-sheet").append(`<img class="bar-line" src="./assets/svgs/endRepeat.svg">`);
            } else {
                $(".lead-sheet").append(`<img class="bar-line" src="./assets/svgs/doubleBarLine.svg">`);
            }
            $(".lead-sheet").append(`<br>`)
        });
        $("#lead-sheet").show();
    }

    $("#current-repeat").html((band.getCurrentRepeat() + 1).toString());
    $("#total-repeats").html(band.getRepeats().toString());
    $("#pause").hide();
    $(".dropdown-content").hide();
    $("body").show();
    $(".transpose-icon").show();
    $("#play").on("click", async () => {
        $("#play").hide();
        $("#pause").show();
        $(".lds-ellipsis").show();
        await band.play();
        $(".lds-ellipsis").hide();
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
        $(".highlighted-measure").removeClass("highlighted-measure");
    });

    $("#skip-start").on("click", async () => {
        $("#pause").hide();
        $("#play").show();
        band.stop();

        songIndex = (songIndex - 1) % songsMetadata.length;
        if (songIndex < 0) {
            songIndex = songsMetadata.length-1;
        }
        const songDataURI: string = `https://${server}/songs/id/${songsMetadata[songIndex]._id}`;
        const songData: any = await $.get(songDataURI);
        songToPlay = new Song(theory);
        songToPlay.deserialize(songData);
        songToPlay.transposeDisplayedChords(transposingKey);
        band.setSong(songToPlay);
        $("#tempo").val(songToPlay.songTempo);
        band.setTempo(songToPlay.songTempo);
        createLeadSheet(songToPlay);
        parseRepeatsAndSetVal(band.getRepeats());
    });

    $("#skip-end").on("click", async () => {
        $("#pause").hide();
        $("#play").show();
        band.stop();

        songIndex = (songIndex + 1) % songsMetadata.length;
        const songDataURI: string = `https://${server}/songs/id/${songsMetadata[songIndex]._id}`;
        const songData: any = await $.get(songDataURI);
        songToPlay = new Song(theory);
        songToPlay.deserialize(songData);
        songToPlay.transposeDisplayedChords(transposingKey);
        band.setSong(songToPlay);
        $("#tempo").val(songToPlay.songTempo);
        band.setTempo(songToPlay.songTempo);
        createLeadSheet(songToPlay);
        parseRepeatsAndSetVal(band.getRepeats());
    });

    $("#swing").on("click", () => {
        style = "fourFourTime";
        band.setStyle(style);
    });

    $("#latin").on("click", () => {
        style = "bossa";
        band.setStyle(style);
    });

    $("#mambo").on("click", () => {
        style = "mambo";
        band.setStyle(style);
    });

    $("#style-override").on("click", function() {
        if( $(this).is(':checked') ) {
            $(".style-select").show();
            band.styleOverride = true;
        }
        else {
            $(".style-select").hide();
            band.styleOverride = false;
        }
    });

    // tempo controller
    const parseTempoAndSetVal = (tempoNum: number) => {
        if (isNaN(tempoNum)) {
            $("#tempo").val(band.getTempo());
            return;
        } else if (tempoNum > 400) {
            band.setTempo(400);
            tempoNum = 400;
        } else if (tempoNum < 40) {
            band.setTempo(40);
            tempoNum = 40;
        } else {
            band.setTempo(tempoNum);
        }
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

    $("#transpose-Bb").on("click", () => {
        $(".button-control").removeClass("selected-transposing-key");
        $("#transpose-Bb").addClass("selected-transposing-key");
        transposingKey = "Bb";
        const currentMeasureUUID: string = $(".highlighted-measure").attr("id");
        const measureBeingPlayed: Measure = songToPlay.getMeasureByUUID(currentMeasureUUID);
        songToPlay.transposeDisplayedChords("Bb");
        createLeadSheet(songToPlay);
        if (measureBeingPlayed) {
            $(`#${measureBeingPlayed.uniqueID}`).addClass("highlighted-measure");
        }
    });

    $("#transpose-C").on("click", () => {
        $(".button-control").removeClass("selected-transposing-key");
        $("#transpose-C").addClass("selected-transposing-key");
        transposingKey = "C";
        const currentMeasureUUID: string = $(".highlighted-measure").attr("id");
        const measureBeingPlayed: Measure = songToPlay.getMeasureByUUID(currentMeasureUUID);
        songToPlay.transposeDisplayedChords("C");
        createLeadSheet(songToPlay);
        if (measureBeingPlayed) {
            $(`#${measureBeingPlayed.uniqueID}`).addClass("highlighted-measure");
        }
    });

    $("#transpose-Eb").on("click", () => {
        $(".button-control").removeClass("selected-transposing-key");
        $("#transpose-Eb").addClass("selected-transposing-key");
        transposingKey = "Eb";
        const currentMeasureUUID: string = $(".highlighted-measure").attr("id");
        const measureBeingPlayed: Measure = songToPlay.getMeasureByUUID(currentMeasureUUID);
        songToPlay.transposeDisplayedChords("Eb");
        createLeadSheet(songToPlay);
        if (measureBeingPlayed) {
            $(`#${measureBeingPlayed.uniqueID}`).addClass("highlighted-measure");
        }
    });

    $("#style").on("change", function() {
        const styleInput: string = $(this).val().toString()
        band.setStyle(styleInput);
    });

    $("#tempo-icon").on("click", () =>  {
        $("#tempo-dropdown").toggle();
    });

    $("#repeat-icon").on("click", () =>  {
        $("#repeat-dropdown").toggle();
    });

    $("#transpose-icon").on("click", () =>  {
        $("#transpose-dropdown").toggle();
    });

    $(document).on("click", (event) => {
        var $target = $(event.target);
        if(!$target.closest('#repeat-dropdown-container').length &&
        $('#repeat-dropdown').is(":visible")) {
            $('#repeat-dropdown').hide();
        }

        if(!$target.closest('#tempo-dropdown-container').length &&
        $('#tempo-dropdown').is(":visible")) {
            $('#tempo-dropdown').hide();
        }

        if(!$target.closest('#transpose-dropdown-container').length &&
        $('#transpose-dropdown').is(":visible")) {
            $('#transpose-dropdown').hide();
        }
    });

    // repeats controller
    const parseRepeatsAndSetVal = (repeatsNum: number) => {
        if (isNaN(repeatsNum)) {
            $("#repeats").val(band.getRepeats());
            return;
        } else if (repeatsNum > 400) {
            band.setRepeats(400);
            repeatsNum = 400;
        } else if (repeatsNum < 1) {
            band.setRepeats(1);
            repeatsNum = 1;
        } else {
            band.setRepeats(repeatsNum);
        }

        $("#repeats").val(repeatsNum);
        if (band.getCurrentRepeat()+1 <= band.getRepeats()) {
            $("#current-repeat").html((band.getCurrentRepeat()+1).toString());
        }
        $("#total-repeats").html(band.getRepeats().toString());
    };

    $("#repeats").on("change", function() {
        const repeatsNum: number = parseInt($(this).val().toString(), 0x0);
        parseRepeatsAndSetVal(repeatsNum);
    });

    $("#repeats-increase").on("click", () => {
        parseRepeatsAndSetVal(band.getRepeats() + 1);
    });

    $("#repeats-decrease").on("click", () => {
        parseRepeatsAndSetVal(band.getRepeats() - 1);
    });
});
