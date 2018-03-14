import React, { Component } from "react";

class SeaMap extends Component {
	myWidth = this.props.width == null ? 600 : this.props.width;
	myHeight = this.props.height == null ? 600 : this.props.height;

	icebergStyle = { fill: "white", stroke: "white", strokeWidth: 1 };
	mainStyle = { fill: "blue" };

	render() {
		return (
			<div
				className="svg-wrapper"
				style={{
					width: `${this.myWidth}px`,
					height: `${this.myHeight}px`
				}}
				onClick={this.onClickHandler.bind(this)}
			>
				<svg
					height={`${this.myHeight}`}
					width="100%"
					viewBox={`0, 0, ${this.myWidth}, ${this.myHeight}`}
					style={this.mainStyle}
				>
					{this.renderIcebergs()}
					{this.renderSourcePoint()}
					{this.renderDestinationPoint()}
				</svg>
			</div>
		);
	}

	renderIcebergs() {
		if (this.props != null && this.props.icebergs != null) {
			return this.props.icebergs.map((item, idx) => {
				let pointList = item.points.reduce((prevStr, curPoint) => {
					return (
						prevStr +
						(prevStr === "" ? "" : " ") +
						`${curPoint.x},${curPoint.y}`
					);
				}, "");
				return (
					<polygon
						key={idx}
						points={pointList}
						style={this.icebergStyle}
					/>
				);
			});
		} else {
			return null;
		}
	}

	renderSourcePoint() {
		if (this.props != null && this.props.sourcePoint != null) {
			return this.renderPoint(this.props.sourcePoint, "A");
		}
	}

	renderDestinationPoint() {
		if (this.props != null && this.props.destinationPoint != null) {
			return this.renderPoint(this.props.destinationPoint, "B");
		}
	}

	renderPoint(myPoint, myText) {
		let xStr = myPoint.x.toString();
		let yStr = myPoint.y.toString();
		let yTextStr = (-myPoint.y - 10).toString();

		return (
			<g>
				<circle
					cx={xStr}
					cy={yStr}
					r="4"
					strokeWidth="0"
					fill="forestGreen"
				/>
				<text
					x={xStr}
					y={yTextStr}
					fill="forestGreen" // transform={`rotate(180 ${xStr} ${yShiftStr}) `}
					transform="scale(1, -1)"
				>
					{myText}
				</text>
			</g>
		);
	}

	onClickHandler(evt) {
		// console.log(evt, evt.clientX, evt.clientY);
	}
}

export default SeaMap;
