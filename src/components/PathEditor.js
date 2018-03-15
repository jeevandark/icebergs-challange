import React, { Component } from "react";
import PointEditor from "./PointEditor";

class PathEditor extends Component {
	render() {
		return (
			<div className="path-editor">
				{" "}
				<div className="header-label">Path</div>{" "}
				{this.renderSourcePoint()}
				{this.renderDestinationPoint()}
			</div>
		);
	}

	renderSourcePoint() {
		return (
			<PointEditor
				onClearClick={this.onFromPointCleared.bind(this)}
				label="From"
				point={this.props.sourcePoint}
			/>
		);
	}

	renderDestinationPoint() {
		return (
			<PointEditor
				onClearClick={this.onToPointCleared.bind(this)}
				label="To"
				point={this.props.destinationPoint}
			/>
		);
	}

	onFromPointCleared() {
		this.props.onFromPointCleared();
	}

	onToPointCleared() {
		this.props.onToPointCleared();
	}
}

export default PathEditor;
