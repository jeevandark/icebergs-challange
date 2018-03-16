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
				onChange={this.onFromPointChange.bind(this)}
			/>
		);
	}

	renderDestinationPoint() {
		return (
			<PointEditor
				onClearClick={this.onToPointCleared.bind(this)}
				label="To"
				point={this.props.destinationPoint}
				onChange={this.onToPointChange.bind(this)}
			/>
		);
	}

	onFromPointCleared() {
		this.props.onFromPointChange(null);
	}

	onToPointCleared() {
		this.props.onToPointChange(null);
	}

	onFromPointChange(newVal) {
		this.props.onFromPointChange(newVal);
	}

	onToPointChange(newVal) {
		this.props.onToPointChange(newVal);
	}
}

export default PathEditor;
