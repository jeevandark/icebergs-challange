import React, { Component } from "react";
import PointEditor from "./PointEditor";

class PathEditor extends Component {
	render() {
		return (
			<div className="path-editor">
				<div className="header-label">Path</div>
				{this.renderSourcePoint()}
				{this.renderDestinationPoint()}
			</div>
		);
	}

	renderSourcePoint() {
		if (this.props.sourcePoint != null) {
			return (
				<PointEditor label="Source" point={this.props.sourcePoint} />
			);
		} else {
			return null;
		}
	}

	renderDestinationPoint() {
		if (this.props.destinationPoint != null) {
			return (
				<PointEditor
					label="Destination"
					point={this.props.destinationPoint}
				/>
			);
		} else {
			return null;
		}
	}
}

export default PathEditor;
