import React, { Component } from "react";

class ControlPanel extends Component {
	myWidth = this.props.width == null ? 600 : this.props.width;
	mainStyle = {
		width: `${this.myWidth}px`
	};

	render() {
		return (
			<div className="control-panel" style={this.mainStyle}>
				This is the control panel
			</div>
		);
	}
}

export default ControlPanel;
