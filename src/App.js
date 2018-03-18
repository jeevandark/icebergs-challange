import React, { Component } from "react";
import SeaMap from "./components/SeaMap";
import "./App.css";
import ControlPanel from "./components/ControlPanel";
import { demoData } from "./demoData";
import pointInPolygon from "point-in-polygon";

class App extends Component {
	static kMapHeight = 600;
	static kMapAndControlPanelWidth = 600;
	static keyForStateInSessionStorage = "keyState";
	static pathToApiFSPEndpoint = "http://localhost:4000/fsp/";

	constructor() {
		super();
		// load state from session storage - to prevent a reset upon page refresh:
		let tmpStr = sessionStorage.getItem(App.keyForStateInSessionStorage);
		if (tmpStr != null) {
			this.state = JSON.parse(tmpStr);
			if (this.state.selectedIceberg != null) {
				// properly set the reference to the selected iceberg:
				let selAsStr = JSON.stringify(this.state.selectedIceberg);
				for (const ice of this.state.icebergs) {
					let curAsStr = JSON.stringify(ice);
					let areEqual = selAsStr === curAsStr;
					if (areEqual) {
						this.state.selectedIceberg = ice;
					}
				}
			}
		} else {
			this.state = {};
		}
	}

	onDemoButtonClick = () => {
		let chkStr = null;
		if (this.state.selectedIceberg != null) {
			chkStr = JSON.stringify(this.state.selectedIceberg);
		}
		this.setState({
			...demoData,
			shortestPath: null,
			selectedIceberg: null
		});
		setTimeout(() => {
			this.onCalcShortestPath();
			if (chkStr != null) {
				// try to find the previously selected iceberg in the new state:
				for (const ice of this.state.icebergs) {
					let curStr = JSON.stringify(ice);
					if (curStr === chkStr) {
						this.setState({ selectedIceberg: ice });
					}
				}
			}
		}, 50);
	};

	onSelectedIcebergChange = newlySelectedIceberg => {
		this.setState({
			selectedIceberg: newlySelectedIceberg
		});
	};

	componentWillUpdate(nextProps, nextState) {
		// save state to session storage - to prevent reset upon page refresh:
		sessionStorage.setItem(
			App.keyForStateInSessionStorage,
			JSON.stringify(nextState)
		);
	}

	onCalcShortestPath = () => {
		let myInit = {
			body: JSON.stringify(this.state),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json, text/plain, */*"
			},
			method: "POST",
			mode: "cors"
		};
		fetch(App.pathToApiFSPEndpoint, myInit)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					return null;
				}
			})
			.then(result => {
				if (result == null) {
					// todo: prompt the user that en error had occurred
				}
				this.setState({ shortestPath: result });
			});
	};

	render() {
		return (
			<div className="App">
				<h3 style={{ margin: "3px 0" }}>The Icebergs Challange</h3>
				<SeaMap
					width={App.kMapAndControlPanelWidth}
					height={App.kMapHeight}
					icebergs={this.state.icebergs}
					sourcePoint={this.state.sourcePoint}
					destinationPoint={this.state.destinationPoint}
					shortestPath={this.state.shortestPath}
					selectedIceberg={this.state.selectedIceberg}
					onClickOnMap={this.handleClickOnMap.bind(this)}
					pathForNewIceberg={this.state.pathForNewIceberg}
				/>
				<ControlPanel
					width={App.kMapAndControlPanelWidth}
					icebergs={this.state.icebergs}
					sourcePoint={this.state.sourcePoint}
					destinationPoint={this.state.destinationPoint}
					onDemoButtonClick={this.onDemoButtonClick}
					onFromPointChange={this.handleFromPointChange.bind(this)}
					onToPointChange={this.handleToPointChange.bind(this)}
					onIcebergModified={this.handleIcebergChange.bind(this)}
					onCalcShortestPath={this.onCalcShortestPath.bind(this)}
					shortestPath={this.state.shortestPath}
					selectedIceberg={this.state.selectedIceberg}
					onSelectedIcebergChange={this.onSelectedIcebergChange.bind(
						this
					)}
					onClearAllIcebergs={this.handleClearAllIcebergs.bind(this)}
					onCreateIcebergOnMap={this.handleCreateIcebergOnMap.bind(
						this
					)}
					overlayMessage={this.state.overlayMessage}
					onCancelOverlayPrompt={this.handleCancelOverlayPrompt.bind(
						this
					)}
				/>
			</div>
		);
	}

	handleCancelOverlayPrompt() {
		this.setState({
			overlayMessage: null,
			createIcebergMode: false,
			pathForNewIceberg: []
		});
	}

	handleFromPointChange(newVal) {
		this.setState({ sourcePoint: newVal, shortestPath: null });
	}

	handleToPointChange(newVal) {
		this.setState({ destinationPoint: newVal, shortestPath: null });
	}

	handleIcebergChange(newIceberg, icebergToModify) {
		let idxOfModified = this.state.icebergs.findIndex(ice => {
			return ice === icebergToModify;
		});
		if (idxOfModified >= 0) {
			let newListOfIcebergs = this.state.icebergs.slice();
			if (newIceberg != null) {
				newListOfIcebergs[idxOfModified] = newIceberg;
			} else {
				// newIceberg is null - meaning we want a removal:
				newListOfIcebergs.splice(idxOfModified, 1);
			}
			this.setState({
				icebergs: newListOfIcebergs,
				shortestPath: null,
				selectedIceberg: newIceberg
			});
		}
	}

	handleClearAllIcebergs() {
		this.setState({
			icebergs: null,
			selectedIceberg: null,
			shortestPath: null
		});
	}

	handleCreateIcebergOnMap() {
		this.setState({
			overlayMessage: "Click the map to create new icebergs",
			createIcebergMode: true
		});
	}

	handleClickOnMap(evt, coords) {
		let isInsideAnIceberg = evt.target.tagName === "polygon";
		let isInSourceOrDestinationPoints = evt.target.tagName === "circle";
		if (this.state.createIcebergMode) {
			if (isInsideAnIceberg || isInSourceOrDestinationPoints) {
				alert("Point cannot be set there. Please try again");
			} else {
				const gapXThreshold = 5;
				const gapYThreshold = 6;
				let idxOfExistingPoint = -1;
				if (this.state.pathForNewIceberg != null) {
					idxOfExistingPoint = this.state.pathForNewIceberg.findIndex(
						myPoint => {
							let gapX = Math.abs(myPoint.x - coords.x);
							let gapY = Math.abs(myPoint.y - coords.y);
							return gapX < gapXThreshold && gapY < gapYThreshold;
						}
					);
				}
				if (idxOfExistingPoint >= 0) {
					// if the click is "at" a point of the ghost-path:
					let distanceFromEnd =
						this.state.pathForNewIceberg.length -
						idxOfExistingPoint;
					if (distanceFromEnd >= 2) {
						// remove redundant points at the beggining:
						let closedPath = this.state.pathForNewIceberg.slice(
							idxOfExistingPoint
						);
						// close the path:
						let newIceList = [];
						if (
							this.state.icebergs != null &&
							this.state.icebergs.length > 0
						) {
							newIceList = this.state.icebergs.slice();
						}
						let newIceberg = {
							points: closedPath
						};
						newIceList.push(newIceberg);
						this.setState({
							pathForNewIceberg: null,
							icebergs: newIceList,
							selectedIceberg: newIceberg,
							shortestPath: null
						});
					}
				} else {
					// not on the path - make sure that it does not break the convex-only limitation:
					let breaksNoConvexLimitation = this.doesPointBreaksNoConvexLimitation(
						coords
					);
					// also check the current ghost path is not crossed, and that no edge of any other iceberg is crossed
					if (breaksNoConvexLimitation) {
						// snackbar the user that non-convex iceberg polygons are not supported
						alert(
							"Non-convex iceberg polygons are not supported. Please try again"
						);
					} else {
						// otherwise add the point to the ghost path:
						let newPath =
							this.state.pathForNewIceberg == null
								? []
								: this.state.pathForNewIceberg.slice();
						newPath.push(coords);
						this.setState({
							pathForNewIceberg: newPath
						});
					}
				}
			}
		} else {
			// no special mode - process normally:
			if (isInsideAnIceberg) {
				let pntStr = evt.target.getAttribute("points");
				for (const ice of this.state.icebergs) {
					let chkStr = ice.points.reduce(
						(prevVal, curVal, curIdx) => {
							return `${prevVal}${curIdx > 0 ? " " : ""}${
								curVal.x
							},${curVal.y}`;
						},
						""
					);
					let isTheSame = pntStr === chkStr;
					if (isTheSame) {
						this.setState({
							selectedIceberg: ice
						});
						break;
					}
				}
			}
		}
	}

	doesPointBreaksNoConvexLimitation(coords) {
		let breaksNoConvexLimitation;
		let numOfPointsInPath = 0;
		if (this.state.pathForNewIceberg != null) {
			numOfPointsInPath = this.state.pathForNewIceberg.length;
		}
		if (numOfPointsInPath < 3) {
			breaksNoConvexLimitation = false;
		} else {
			let chkPoint = [coords.x, coords.y];
			let chkPolygon = this.state.pathForNewIceberg.reduce(
				(prevArr, curPoint) => {
					prevArr.push([curPoint.x, curPoint.y]);
					return prevArr;
				},
				[]
			);
			breaksNoConvexLimitation = pointInPolygon(chkPoint, chkPolygon);
		}
		return breaksNoConvexLimitation;
	}
}

export default App;
