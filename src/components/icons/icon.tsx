import React, { Component } from 'react'

interface IIconProps {
    onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
    title?: string;
    id?: string;
    visible?: boolean;
    paths?: JSX.Element;
}

export default class Icon extends Component<IIconProps> {

    constructor(props: IIconProps) {
        super(props);
    }

    render() {
        return (<>
            <span title={this.props.title} id={this.props.id} className="control-button" onClick={(e) => {this.props.onClick(e)}}>
                <svg width="1em" height="1em" viewBox="0 0 16 16" className={ this.props.visible !== false ? "" : "hidden" } fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    {this.props.paths}
                </svg>
            </span>
        </>);
    }
}
