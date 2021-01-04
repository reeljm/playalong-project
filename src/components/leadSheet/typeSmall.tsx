import React, { Component } from 'react'

interface ITypeProps {
    symbol: string;
}

export default class TypeSmall extends Component<ITypeProps> {

    render() {
        return (
            <svg className="chord-symbol" width="14.545454" height="40" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <text
                        xmlSpace="preserve"
                        text-anchor="start"
                        font-family="Helvetica, Arial, sans-serif"
                        font-size="18.181818"
                        id="svg_1"
                        y="20"
                        x="0.272727"
                        stroke-width="0"
                        stroke="#000"
                        fill="#000000">
                            {this.props.symbol}
                    </text>
                </g>
            </svg>
        )
    }
}
