import React, { Component } from 'react'
import { Chord as ChordData } from '../../src/playbackService/theory/chord'

interface IChordProps {
    chord: ChordData;
}

export default class Chord extends Component<IChordProps> {

    private static SVG_MAP: Map<string, string> = new Map([
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

    private static SVG_LOCATION: string = "./assets/svgs/";

    render() {
        // Render the root:
        const chordTokens: string[] = this.props.chord.writtenRoot.split("");
        const toRender: JSX.Element[] = chordTokens.map((e: string) => {
            let className: string = "";
            if (e === "b" || e === "#") {
                className="chord-symbol";
            } else {
                className="chord-root"
            }
            return <img className={className} src={`${Chord.SVG_LOCATION}/${Chord.SVG_MAP.get(e)}`}/>;
        });

        // Render the type:
        let type: string = this.props.chord.type;
        while (type.length > 0) {
            let replaced: boolean = false;
            for (const entry of Array.from(Chord.SVG_MAP.entries())) {
                const key: string = entry[0];
                const value: string = entry[1];

                if (type.startsWith(key)) {
                    toRender.push(<img className="chord-symbol" src={`${Chord.SVG_LOCATION}/${value}`}/>);
                    type = type.replace(key, "");
                    replaced = true;
                }
            }
            if (!replaced) {
                console.log("unable to find symbol for chord", this.props.chord.type);
                break;
            }
        }
        return <div className="chord"> { toRender } </div>;
    }
}
