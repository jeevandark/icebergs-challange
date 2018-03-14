import React, { Component } from "react";

class SeaMap extends Component {
	myWidth = this.props.width == null ? 600 : this.props.width;
	myHeight = this.props.height == null ? 600 : this.props.height;
	myPolygons = this.props.polygons == null ? [] : this.props.polygons;
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
			>
				<svg
					height={`${this.myHeight}`}
					width="100%"
					viewBox={`0, 0, ${this.myWidth}, ${this.myHeight}`}
					style={this.mainStyle}
				>
					{this.myPolygons.map((item, idx) => {
						let pointList = item.points.reduce(
							(prevStr, curPoint) => {
								return (
									prevStr +
									(prevStr === "" ? "" : " ") +
									`${curPoint.x},${curPoint.y}`
								);
							},
							""
						);
						return (
							<polygon
								key={idx}
								points={pointList}
								style={this.icebergStyle}
							/>
						);
					})}
				</svg>
			</div>
		);
	}
}

export default SeaMap;
