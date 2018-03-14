import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { FlatButton, RaisedButton, Dialog } from "material-ui";
import PathEditor from "./PathEditor";

class ControlPanel extends Component {
	myWidth = this.props.width == null ? 600 : this.props.width;
	mainStyle = {
		width: `${this.myWidth}px`
	};

	state = {
		selectedIceberg: null,
		alertMissingParamsIsOpen: false
	};

	handleFindShortestPathClick = () => {
		if (
			this.props.sourcePoint == null ||
			this.props.destinationPoint == null
		) {
			this.setState({ alertMissingParamsIsOpen: true });
		}
	};

	handleCloseMissingParams = () => {
		this.setState({ alertMissingParamsIsOpen: false });
	};

	render() {
		const actionsMissingParamsAlert = [
			<FlatButton
				label="OK"
				primary={true}
				onClick={this.handleCloseMissingParams}
			/>
		];
		return (
			<MuiThemeProvider>
				<div className="control-panel" style={this.mainStyle}>
					{this.renderIcebergPanel()}
					<PathEditor
						sourcePoint={this.props.sourcePoint}
						destinationPoint={this.props.destinationPoint}
					/>
					<div className="buttons-pad">
						<FlatButton
							label="Demo"
							primary={true}
							onClick={this.props.onDemoButtonClick}
						/>
						<RaisedButton
							label="Find shortest path"
							primary={true}
							onClick={this.handleFindShortestPathClick}
						/>
						<Dialog
							actions={actionsMissingParamsAlert}
							modal={true}
							open={this.state.alertMissingParamsIsOpen}
						>
							<div className="alert-text">
								Please define the start and destination points
							</div>
						</Dialog>
					</div>
				</div>
			</MuiThemeProvider>
		);
	}

	renderIcebergPanel() {
		return (
			<div className="iceberg-list">
				<div className="header-label">Icebergs</div>
				<div className="inner-list">{this.renderIcebergList()}</div>
			</div>
		);
	}

	renderIcebergList() {
		if (this.props != null && this.props.icebergs != null) {
			return this.props.icebergs.map((item, idx) => {
				let isSelected = this.state.selectedIceberg === item;
				let strClass = `iceberg-entry ${isSelected ? "selected" : ""}`;
				return (
					<div
						onClick={this.handleIcebergClick.bind(this, item)}
						key={idx}
						className={strClass}
					>{`Iceberg #${idx + 1}`}</div>
				);
			});
		} else {
			return null;
		}
	}

	handleIcebergClick(iceberg) {
		this.setState({
			selectedIceberg: iceberg
		});
	}
}

export default ControlPanel;
