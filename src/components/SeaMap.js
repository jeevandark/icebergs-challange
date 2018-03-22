import React, { Component } from "react";

class SeaMap extends Component {
	myWidth = this.props.width == null ? 600 : this.props.width;
	myHeight = this.props.height == null ? 600 : this.props.height;

	icebergStyle = { fill: "white", stroke: "white", strokeWidth: 1 };
	icebergSelectedStyle = {
		fill: "white",
		stroke: "deepSkyBlue",
		strokeWidth: 2
	};
	mainStyle = { fill: "blue" };
	styleForShortestPath = {
		fill: "none",
		stroke: "green",
		strokeWidth: 2
	};
	styleForIcebergInCreation = {
		fill: "none",
		stroke: "white",
		strokeWidth: 2
	};

	state = { hoverPoint: null };

	render() {
		return (
			<div
				className="svg-wrapper"
				style={{
					width: `${this.myWidth}px`,
					height: `${this.myHeight}px`
				}}
				onClick={this.handleLocalClickOnMap.bind(this)}
				onMouseDown={this.handleMouseDownOnMap.bind(this)}
				onContextMenu={(e) => {e.preventDefault()}}
				onMouseMove={this.handleHoverOverMap.bind(this)}
				ref={input => {
					this.refToWrapper = input;
				}}
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
					{this.renderShortestPath()}
					{this.renderPathOfIcebergInCreation()}
					{this.renderHoverLine()}
				</svg>
			</div>
		);
	}

	renderIcebergs() {
		if (this.props != null && this.props.icebergs != null) {
			return this.props.icebergs.map((item, idx) => {
				let pointList = null;
				if (item != null && item.points != null) {
					pointList = item.points.reduce((prevStr, curPoint) => {
						return (
							prevStr +
							(prevStr === "" ? "" : " ") +
							`${curPoint.x},${curPoint.y}`
						);
					}, "");
				}
				return pointList != null ? (
					<polygon
						key={idx}
						points={pointList}
						style={this.determinePolygonStyle.call(this, item)}
					/>
				) : null;
			});
		} else {
			return null;
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.pathForNewIceberg == null) {
			if (this.state.hoverPoint != null) {
				this.setState({ hoverPoint: null });
			}
		}
	}

	handleHoverOverMap(evt) {
		if (
			this.props.pathForNewIceberg != null &&
			this.props.pathForNewIceberg.length > 0
		) {
			let myRect = this.refToWrapper.getBoundingClientRect();
			let hoverCoord = {
				x: evt.clientX - myRect.x,
				y: myRect.height - (evt.clientY - myRect.y)
			};
			this.setState({
				hoverPoint: hoverCoord
			});
		}
	}

	handleMouseDownOnMap(evt) {
		if (evt.button === 2) {
			// right-mouse-button:
			if (this.props != null && this.props.onCancelMouseOperation != null) {
				evt.preventDefault();
				this.props.onCancelMouseOperation();
			}
		}
	}

	handleLocalClickOnMap(evt) {
		if (this.refToWrapper != null) {
			let myRect = this.refToWrapper.getBoundingClientRect();
			let passedPoint = {
				x: evt.clientX - myRect.x,
				y: myRect.height - (evt.clientY - myRect.y)
			};
			this.props.onClickOnMap(evt, passedPoint);
		}
	}

	determinePolygonStyle(curPolygon) {
		let isSelected = this.props.selectedIceberg === curPolygon;
		return isSelected ? this.icebergSelectedStyle : this.icebergStyle;
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

	renderShortestPath() {
		if (
			this.props != null &&
			this.props.shortestPath != null &&
			this.props.shortestPath.length > 0
		) {
			let pointListStr = this.props.shortestPath.reduce(
				(prevStrVal, curPoint) => {
					return prevStrVal + `${curPoint.x},${curPoint.y} `;
				},
				""
			);
			return (
				<polyline
					points={pointListStr}
					style={this.styleForShortestPath}
				/>
			);
		} else {
			return null;
		}
	}

	renderPathOfIcebergInCreation() {
		if (
			this.props != null &&
			this.props.pathForNewIceberg != null &&
			this.props.pathForNewIceberg.length > 0
		) {
			let pointListStr = this.props.pathForNewIceberg.reduce(
				(prevStrVal, curPoint) => {
					return prevStrVal + `${curPoint.x},${curPoint.y} `;
				},
				""
			);
			return (
				<polyline
					points={pointListStr}
					style={this.styleForIcebergInCreation}
				/>
			);
		} else {
			return null;
		}
	}

	renderHoverLine() {
		if (
			this.props != null &&
			this.props.pathForNewIceberg != null &&
			this.props.pathForNewIceberg.length > 0 &&
			this.state.hoverPoint != null
		) {
			let lastPoint = this.props.pathForNewIceberg[
				this.props.pathForNewIceberg.length - 1
			];
			return (
				<line
					x1={lastPoint.x.toString()}
					y1={lastPoint.y.toString()}
					x2={this.state.hoverPoint.x.toString()}
					y2={this.state.hoverPoint.y.toString()}
					style={this.styleForIcebergInCreation}
				/>
			);
		} else {
			return null;
		}
	}
}

export default SeaMap;
