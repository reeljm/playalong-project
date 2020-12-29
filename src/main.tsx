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
import React from 'react';
import ReactDOM from 'react-dom';
import Toolbar from "./toolbar";

// require instrument samples:
function requireAll(r: any) { r.keys().forEach(r); }
requireAll(require.context('./playbackService/staticFiles/samples/upright-bass', true, /\.mp3$/));
requireAll(require.context('./playbackService/staticFiles/samples/piano', true, /\.mp3$/));
requireAll(require.context('./playbackService/staticFiles/samples/drums', true, /\.mp3$/));
requireAll(require.context('./playbackService/staticFiles/svgs', true, /\.svg$/));

$(async () => {
    // initialize band
    let band: BandService = null;
    let style: string = "fourFourTime";
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
    const server: string = process.env.BACKEND_API;
    const songsURI: string = `${server}/songs`;
    const songsMetadata: any[] = await $.get(songsURI);

    // populate sidebar:
    songsMetadata.forEach((song: any) => {
        $(".songs-list").append(`<span id="${song._id}">${song.name}</span>`);
        $(`#${song._id}`).on("click", async () => {
            $("#pause").hide();
            $("#play").show();
            $(".songs-list span").css('color', "#818181");
            $(`#${song._id}`).css('color', "#77abff");
            band.stop();

            songIndex = songsMetadata.indexOf(song);
            const songDataURI: string = `${server}/songs/id/${songsMetadata[songIndex]._id}`;
            const songData: any = await $.get(songDataURI);
            songToPlay = new Song(theory);
            songToPlay.deserialize(songData);
            songToPlay.transposeDisplayedChords(transposingKey);
            band.setSong(songToPlay);
            band.tempo = songToPlay.songTempo;
            createLeadSheet(songToPlay);
        });

        $(`#${song._id}`).on("mouseenter", () => {
            if (songToPlay.id !== song._id) {
                $(`#${song._id}`).css('color', "white");
            }
        });

        $(`#${song._id}`).on("mouseleave", () => {
            if (songToPlay.id !== song._id) {
                $(`#${song._id}`).css('color', "#818181");
            }
        });
    });
    // highlight 1st song:
    $(`#${songsMetadata[0]._id}`).css('color', "#77abff");

    $("#songs").on("click", () => {
        $(".songs-list").toggle();
    });




    // get first song:
    let songIndex: number = 0;
    const songDataURI: string = `${server}/songs/id/${songsMetadata[songIndex]._id}`;
    const songData: any = await $.get(songDataURI);
    let transposingKey: string = "C";
    let songToPlay: Song = new Song(theory);
    songToPlay.deserialize(songData);
    songToPlay.transposeDisplayedChords(transposingKey);
    createLeadSheet(songToPlay);
    $(`#transpose-${transposingKey}`).addClass("selected-transposing-key");
    band = new Band(songToPlay, musicians, countIn);
    band.tempo = songToPlay.songTempo;
    band.setNewMeasureCallback((measure: Measure) => {
        $(".highlighted-measure").removeClass("highlighted-measure");
        if (measure && measure.nextMeasure) {
            $(`#${measure.uniqueID}`).addClass("highlighted-measure");
        }
    });

    ReactDOM.render(
        <Toolbar
            theory={theory}
            songsMetadata={songsMetadata}
            band={band}
            onSongChangeCallback={
                async (updatedSong: Song) => {
                    createLeadSheet(updatedSong);
                    $(".songs-list span").css('color', "#818181");
                    $(`#${updatedSong.id}`).css('color', "#77abff");
                }
            }
        />,
        document.getElementById('app')
    );

    function createLeadSheet(song: Song) {
        $("#lead-sheet").hide();
        $(".lead-sheet").empty();
        $(".song-name").text(song.songName);

        function createUUID(): string {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        const sections: Section[] = song.sections;
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
                            ["1", "1.svg"],
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
                            let replaced: boolean = false;
                            for (const entry of Array.from(svgMap.entries())) {
                                const key: string = entry[0];
                                const value: string = entry[1];

                                if (type.startsWith(key)) {
                                    chordHTML += `<img class="chord-symbol" src="./assets/svgs/${value}">`;
                                    type = type.replace(key, "");
                                    replaced = true;
                                }
                                }
                            if (!replaced) {
                                console.log("unable to find symbol for chord", c.type);
                                break;
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
                                ["1" ,"1.svg"],
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
                                let replaced: boolean = false;
                                for (const entry of Array.from(svgMap.entries())) {
                                    const key: string = entry[0];
                                    const value: string = entry[1];

                                    if (type.startsWith(key)) {
                                        chordHTML += `<img class="chord-symbol" src="./assets/svgs/${value}">`;
                                        type = type.replace(key, "");
                                        replaced = true;
                                    }
                                    }
                                if (!replaced) {
                                    console.log("unable to find symbol for chord", c.type);
                                    break;
                                }
                            }
                            chordHTML+=`</div>`
                            previousChord = c;
                        }
                    });
                    const uuid: string = createUUID();
                    m.uniqueID = uuid;
                    $(".lead-sheet").append(`<div id='${uuid}' class="measure">${chordHTML}</div>`);

                    if (((measureIndex + 1) % 4) === 0 && endingMeasureNumber !== endingLength) {
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


    $('body').on("keyup", async (e) => {
        if(e.key === ' ') {
            e.preventDefault();
            if (band.isPaused || band.isStopped) {
                $("#play").hide();
                $("#pause").show();
                $(".lds-ellipsis").show();
                await band.play();
                $(".lds-ellipsis").hide();
            } else {
                $("#pause").hide();
                $("#play").show();
                band.pause();
            }
        }
    });

    $('body').on("keydown", (e) => {
        if(e.key === ' ') {
            e.preventDefault();
        }
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

});
