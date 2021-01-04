import React, { Component } from 'react'

interface IRepeatBracketProps {
    repeatNumber: number;
}

export default class RepeatBracket extends Component<IRepeatBracketProps> {

    constructor(props: IRepeatBracketProps) {
        super(props);
    }

    render() {
        return (
            <svg className="ending-marker-container" width="30" height="60" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <line stroke="#000" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_23" y2="8.76551" x2="4.6402" y1="23.39344" x1="4.6402" fill-opacity="null" stroke-opacity="null" stroke-width="null" fill="none"/>
                    <line stroke="#000" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_24" y2="8.88958" x2="25.51601" y1="8.88958" x1="4.14392" fill-opacity="null" stroke-opacity="null" stroke-width="null" fill="none"/>
                    <text xmlSpace="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="15" id="svg_25" y="22.81243" x="6.86877" fill-opacity="null" stroke-opacity="null" stroke-width="0" stroke="#000" fill="#000000">{this.props.repeatNumber}.</text>
                </g>
            </svg>
        )
    }
}
