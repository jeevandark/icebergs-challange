import React, { Component } from "react";
import { RaisedButton } from "material-ui";

class OverlayPrompt extends Component {
	render() {
		if (this.props != null && this.props.message != null) {
			return (
				<div className="overlay-prompt-wrapper">
					<h4>{this.props.message}</h4>
					<RaisedButton
						label="Done"
						onClick={this.props.onCancel}
						primary={true}
					/>
				</div>
			);
		} else {
			return null;
		}
	}
}

export default OverlayPrompt;
