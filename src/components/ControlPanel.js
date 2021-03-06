import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { RaisedButton, Dialog, IconButton } from "material-ui";
import PathEditor from "./PathEditor";
import PointEditor from "./PointEditor";
import OverlayPrompt from "./OverlayPrompt";

class ControlPanel extends Component {
	myWidth = this.props.width == null ? 600 : this.props.width;
	mainStyle = {
		width: `${this.myWidth}px`
	};

	state = {
		alertMissingParamsIsOpen: false,
		alertApproveRemoveIcebergWhenRemovingOneOfOnlyThreePoints: false,
		alertConfirmClearAll: false,
		overlayMessage: null
	};

	handleFindShortestPathClick = () => {
		if (
			this.props.sourcePoint == null ||
			this.props.destinationPoint == null
		) {
			this.setState({ alertMissingParamsIsOpen: true });
		} else {
			if (this.props != null && this.props.onCalcShortestPath != null) {
				setTimeout(() => {
					this.props.onCalcShortestPath();
				}, 50);
			}
		}
	};

	handleCloseMissingParams = () => {
		this.setState({ alertMissingParamsIsOpen: false });
	};

	handleApproveRemoveIcebergWhenRemovingOneOfOnlyThreePoints = () => {
		let selIceberg = this.props.selectedIceberg;
		if (this.props != null && this.props.onIcebergModified != null) {
			this.props.onIcebergModified(null, selIceberg);
		}
		this.setState({
			alertApproveRemoveIcebergWhenRemovingOneOfOnlyThreePoints: false
		});
	};

	handleCancelRemoveIcebergWhenRemovingOneOfOnlyThreePoints = () => {
		this.setState({
			alertApproveRemoveIcebergWhenRemovingOneOfOnlyThreePoints: false
		});
	};

	handleApproveClearAllIcebergs = () => {
		this.setState({ alertConfirmClearAll: false });
		this.props.onClearAllIcebergs();
	};

	handleCancelClearAllIcebergs = () => {
		this.setState({ alertConfirmClearAll: false });
	};

	handleClearAllIcebergClick = () => {
		if (this.props != null && this.props.icebergs != null) {
			this.setState({ alertConfirmClearAll: true });
		}
	};

	render() {
		const actionsMissingParamsAlert = [
			<RaisedButton
				label="OK"
				primary={true}
				onClick={this.handleCloseMissingParams}
			/>
		];
		const actionsPromptRemoveIcebergWhenRemovingOneOfOnlyThreePoints = [
			<RaisedButton
				label="Cancel"
				onClick={
					this
						.handleCancelRemoveIcebergWhenRemovingOneOfOnlyThreePoints
				}
			/>,
			<RaisedButton
				label="Remove Iceberg"
				secondary={true}
				onClick={this.handleApproveRemoveIcebergWhenRemovingOneOfOnlyThreePoints.bind(
					this
				)}
			/>
		];
		const actionsPromptClearAllIcebergs = [
			<RaisedButton
				label="Cancel"
				onClick={this.handleCancelClearAllIcebergs}
			/>,
			<RaisedButton
				label="Yes"
				secondary={true}
				onClick={this.handleApproveClearAllIcebergs.bind(this)}
			/>
		];
		const resultPanelClassNames = `result-panel ${
			this.props.shortestPath != null ? "shown" : ""
		}`;
		return (
			<MuiThemeProvider>
				<div className="panels-wrapper">
					<div className="control-panel" style={this.mainStyle}>
						{this.renderIcebergPanel()}
						<PathEditor
							sourcePoint={this.props.sourcePoint}
							destinationPoint={this.props.destinationPoint}
							onFromPointChange={this.props.onFromPointChange}
							onToPointChange={this.props.onToPointChange}
						/>
						<div className="buttons-pad">
							<RaisedButton
								label="Demo"
								default={true}
								onClick={this.handleDemoButtonClick.bind(this)}
								className="demo-button"
							/>
							<RaisedButton
								label="Find shortest path"
								primary={true}
								onClick={this.handleFindShortestPathClick}
								className="fsp-button"
							/>
							<Dialog
								actions={actionsMissingParamsAlert}
								modal={false}
								open={this.state.alertMissingParamsIsOpen}
							>
								<div className="alert-text">
									Please define the start and destination
									points
								</div>
							</Dialog>
						</div>
						<Dialog
							actions={
								actionsPromptRemoveIcebergWhenRemovingOneOfOnlyThreePoints
							}
							modal={false}
							onRequestClose={
								this
									.handleCancelRemoveIcebergWhenRemovingOneOfOnlyThreePoints
							}
							open={
								this.state
									.alertApproveRemoveIcebergWhenRemovingOneOfOnlyThreePoints
							}
						>
							<div className="alert-text">
								An iceberg cannot have less than three points.<br />
								<br />
								Whould you like to remove the selected iceberg?
							</div>
						</Dialog>
						<Dialog
							actions={actionsPromptClearAllIcebergs}
							modal={false}
							onRequestClose={this.handleCancelClearAllIcebergs}
							open={this.state.alertConfirmClearAll}
						>
							<div className="alert-text">
								Are you sure you want to clear the icebergs
								list?
							</div>
						</Dialog>
					</div>
					<div
						className={resultPanelClassNames}
						style={this.mainStyle}
					>
						<div className="header-label">Result</div>
						<div className="result-content">
							{this.renderShortestPath()}
						</div>
					</div>
					<OverlayPrompt
						message={this.props.overlayMessage}
						onCancel={this.props.onDoneWithlOverlayPrompt}
					/>
				</div>
			</MuiThemeProvider>
		);
	}

	renderIcebergPanel() {
		return (
			<div className="iceberg-list">
				<IconButton
					iconClassName="material-icons"
					title="Add icebergs using clicks on the map"
					className="create-on-map-button"
					onClick={this.props.onCreateIcebergOnMap}
				>
					add_location
				</IconButton>
				<div className="header-label">Icebergs</div>
				<IconButton
					iconClassName="material-icons"
					title="Clear all icebergs"
					className="clear-all-button"
					disabled={
						this.props == null ||
						this.props.icebergs == null ||
						this.props.icebergs.length === 0
					}
					onClick={this.handleClearAllIcebergClick}
				>
					clear_all
				</IconButton>
				<div className="inner-list">{this.renderIcebergList()}</div>
				<div className="points-list">{this.renderPointsList()}</div>
			</div>
		);
	}

	renderIcebergList() {
		if (this.props != null && this.props.icebergs != null) {
			return this.props.icebergs.map((item, idx) => {
				let isSelected = this.props.selectedIceberg === item;
				let strClass = `iceberg-entry ${isSelected ? "selected" : ""}`;
				return (
					<div
						onClick={this.handleIcebergClick.bind(this, item)}
						key={idx}
						className={strClass}
					>
						<span className="iceberg-label">
							{`Iceberg #${idx + 1}`}
						</span>
						<span className="point-buttons">
							<IconButton
								onClick={() => {
									this.props.onIcebergModified(null, item);
									this.props.onSelectedIcebergChange(null);
								}}
							>
								<i className="material-icons">clear</i>
							</IconButton>
						</span>
					</div>
				);
			});
		} else {
			return null;
		}
	}

	handleIcebergClick(iceberg) {
		this.props.onSelectedIcebergChange(iceberg);
	}

	handleDemoButtonClick() {
		this.props.onDemoButtonClick();
	}

	renderPointsList() {
		if (
			this.props.selectedIceberg != null &&
			this.props.selectedIceberg.points != null
		) {
			return this.props.selectedIceberg.points.map((pItem, pIdx) => {
				return (
					<PointEditor
						key={pIdx}
						onClearClick={this.handlePointCleared.bind(this, pItem)}
						point={pItem}
						onChange={this.handleVertexChange.bind(this, pItem)}
					/>
				);
			});
		} else {
			return null;
		}
	}

	handleVertexChange(oldPoint, newPoint) {
		let selIceberg = this.props.selectedIceberg;
		if (selIceberg != null && selIceberg.points != null) {
			// find the point in the points array:
			let idxOfPoint = selIceberg.points.findIndex(item => {
				return item.x === oldPoint.x && item.y === oldPoint.y;
			});
			if (idxOfPoint >= 0) {
				let newPointsArr = selIceberg.points.slice();
				newPointsArr[idxOfPoint] = newPoint;
				let newIceberg = { points: newPointsArr };
				if (
					this.props != null &&
					this.props.onIcebergModified != null
				) {
					this.props.onIcebergModified(newIceberg, selIceberg);
					this.props.onSelectedIcebergChange(newIceberg);
				}
			}
		}
	}

	handlePointCleared = removedPoint => {
		let selIceberg = this.props.selectedIceberg;
		if (selIceberg != null && selIceberg.points != null) {
			if (selIceberg.points.length === 3) {
				// cannot remove a point from a 3-pointed polygon
				// alert  the user and ask if he wants to remove the iceberg as a whole:
				this.setState({
					alertApproveRemoveIcebergWhenRemovingOneOfOnlyThreePoints: true
				});
			} else {
				// find the point in the points array:
				let idxOfPoint = selIceberg.points.findIndex(item => {
					return item === removedPoint;
				});
				if (idxOfPoint >= 0) {
					let newPointsArr = selIceberg.points.slice();
					newPointsArr.splice(idxOfPoint, 1);
					let newIceberg = {
						points: newPointsArr
					};
					if (
						this.props != null &&
						this.props.onIcebergModified != null
					) {
						this.props.onIcebergModified(newIceberg, selIceberg);
						this.props.onSelectedIcebergChange(newIceberg);
					}
				}
			}
		}
	};

	renderShortestPath() {
		if (this.props != null && this.props.shortestPath != null) {
			return this.props.shortestPath.map((myPoint, myIdx) => {
				return (
					<span key={myIdx}>
						[{myPoint.x}, {myPoint.y}]{myIdx <
						this.props.shortestPath.length - 1
							? ", "
							: ""}
					</span>
				);
			});
		}
	}
}

export default ControlPanel;
