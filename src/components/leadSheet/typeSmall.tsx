import React, { Component } from 'react'
import { symbolName } from 'typescript'

interface ITypeProps {
    symbol: string;
}

export default class TypeSmall extends Component<ITypeProps> {

    render() {
        return (
            <svg className="chord-symbol" width={Math.max(7*this.props.symbol.length, 14.55)} height="40" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <text
                        xmlSpace="preserve"
                        textAnchor="start"
                        fontFamily="Helvetica, Arial, sans-serif"
                        fontSize="18.181818"
                        id="svg_1"
                        y="20"
                        x="0.272727"
                        strokeWidth="0"
                        stroke="#000"
                        fill="#000000">
                            {this.props.symbol}
                    </text>
                </g>
            </svg>
        )
    }
}
