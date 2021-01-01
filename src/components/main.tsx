import { BandService as Band, BandService } from "../playbackService/band/band.service";
import { Drummer } from "../playbackService/musicians/drummer/drummer";
import { DrumSet } from "../playbackService/musicians/drummer/drumset";
import { UprightBass } from "../playbackService/musicians/bassist/uprightBass";
import { Bassist } from "../playbackService/musicians/bassist/bassist";
import { WalkingBasslineGenerator } from "../playbackService/musicians/bassist/walkingBasslineGenerator";
import { Theory } from "../playbackService/theory/theory";
import { BossaBasslineGenerator } from "../playbackService/musicians/bassist/bossaBasslineGenerator";
import { BasslineGenerator } from "../playbackService/musicians/bassist/basslineGenerator";
import { Piano } from "../playbackService/musicians/pianist/piano";
import { Pianist } from "../playbackService/musicians/pianist/pianist";
import { Metronome } from "../playbackService/musicians/metronome/metronome";
import { MetronomeInstrument } from "../playbackService/musicians/metronome/metronomeInstrument";
import { Musician } from "../playbackService/musicians/musician";
import { Song } from "../playbackService/song/song";
import React from 'react';
import ReactDOM from 'react-dom';
import App from "./app";


(async ()=>{
    // require instrument samples:
    function requireAll(r: any) { r.keys().forEach(r); }
    requireAll(require.context('../playbackService/staticFiles/samples/upright-bass', true, /\.mp3$/));
    requireAll(require.context('../playbackService/staticFiles/samples/piano', true, /\.mp3$/));
    requireAll(require.context('../playbackService/staticFiles/samples/drums', true, /\.mp3$/));
    requireAll(require.context('../playbackService/staticFiles/svgs', true, /\.svg$/));

    // initialize band
    let band: BandService = null;
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
    const metadataRes: Response = await fetch(songsURI);
    const songsMetadata: any = await metadataRes.json();

    // get first song:
    const songDataURI: string = `${process.env.BACKEND_API}/songs/id/${songsMetadata[0]._id}`;
    const res: Response = await fetch(songDataURI);
    const songData: any = await res.json();
    const songToPlay: Song = new Song(theory);
    songToPlay.deserialize(songData);
    songToPlay.transposeDisplayedChords("C");
    band = new Band(songToPlay, musicians, countIn);
    band.tempo = songToPlay.songTempo;

    ReactDOM.render(
        <App
            theory={theory}
            band={band}
            song={songToPlay}
            songsMetadata={songsMetadata}
        />,
        document.getElementById('app')
    );
})();
