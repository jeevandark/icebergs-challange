import React, { Component } from "react";
import SeaMap from "./components/SeaMap";
import "./App.css";
import ControlPanel from "./components/ControlPanel";
import { demoData } from "./demoData";
// import pointInPolygon from "point-in-polygon";
import doLineSegmentsCross from "do-line-segments-cross";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Snackbar } from "material-ui";

class App extends Component {
	static kMapHeight = 600;
	static kMapAndControlPanelWidth = 600;
	static keyForStateInSessionStorage = "keyState";
	static pathToApiFSPEndpoint = "http://localhost:4000/fsp/";
	static defaultSnackbarDelay = 1500;

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
			this.state = {
				snackbarVisible: false,
				snackbarMessage: "",
				snackbarDelay: App.defaultSnackbarDelay
			};
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

	componentDidMount() {
		document.addEventListener("keydown", this.handleKeyDown.bind(this));
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.handleKeyDown.bind(this));
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
					console.log("stage 1");
					return null;
				}
			})
			.then(result => {
				if (result == null) {
					// todo: prompt the user that en error had occurred
				}
				this.setState({ shortestPath: result });
			})
			.catch(e => {
				this.setState({
					snackbarVisible: true,
					snackbarMessage:
						"Network error. Make sure the server is up and running",
					snackbarDelay: 3000
				});
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
					onCancelMouseOperation={this.handleCancelMouseOperation.bind(
						this
					)}
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
					onDoneWithlOverlayPrompt={this.handleDoneWithlOverlayPrompt.bind(
						this
					)}
				/>
				<MuiThemeProvider>
					<Snackbar
						open={this.state.snackbarVisible}
						message={this.state.snackbarMessage}
						autoHideDuration={this.state.snackbarDelay}
						className="snackbar-general"
						onRequestClose={this.handleSnackbarCloseRequest.bind(
							this
						)}
					/>
				</MuiThemeProvider>
			</div>
		);
	}

	handleKeyDown(evt) {
		if (evt.keyCode === 27) {
			// esc
			this.setState({
				overlayMessage: null,
				createIcebergMode: false,
				pathForNewIceberg: []
			});
		}
	}

	handleSnackbarCloseRequest() {
		this.setState({
			snackbarVisible: false,
			snackbarDelay: App.defaultSnackbarDelay
		});
	}

	handleDoneWithlOverlayPrompt() {
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
				icebergs: newListOfIcebergs
			});
			setTimeout(() => {
				this.setState({
					selectedIceberg: null,
					shortestPath: null
				});
			}, 200);
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

	handleCancelMouseOperation() {
		this.setState({
			overlayMessage: null,
			createIcebergMode: false,
			pathForNewIceberg: []
		});
	}

	handleClickOnMap(evt, coords) {
		if (this.state.createIcebergMode) {
			// in create-icebergs mode
			// check if the line to the newly clicked point crosses any edge in the map:
			let doesCrossAnyIcebergEdgeInTheMap = false;
			let isPathForNewIcebergHasAtleastOneEdge =
				this.state.pathForNewIceberg != null &&
				this.state.pathForNewIceberg.length > 0;
			if (
				this.state.icebergs != null &&
				this.state.icebergs.length > 0 &&
				isPathForNewIcebergHasAtleastOneEdge
			) {
				let lastPointInPath = this.state.pathForNewIceberg[
					this.state.pathForNewIceberg.length - 1
				];
				doesCrossAnyIcebergEdgeInTheMap = this.doesCrossAnyEdge(
					coords,
					lastPointInPath,
					this.state.icebergs
				);
			}
			if (doesCrossAnyIcebergEdgeInTheMap) {
				this.setState({
					snackbarVisible: true,
					snackbarMessage:
						"Point cannot be set there... Please try again"
				});
			} else {
				// see if the click was "on" any point in the iceberg (that is being created):
				const gapXThreshold = 10; // proximity threshold for X
				const gapYThreshold = 12; // proximity threshold for Y
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
					// the click was "on" a point in the path:
					let distanceFromEnd =
						this.state.pathForNewIceberg.length -
						idxOfExistingPoint;
					if (distanceFromEnd >= 2) {
						// remove redundant points at the beginning:
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
						let newIceberg = { points: closedPath };
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
					let breaksConvexLimitation = this.doesPointBreakTheAllowOnlyConvexLimitation(
						coords
					);
					// also check the current ghost path is not crossed, and that no edge of any other iceberg is crossed
					if (breaksConvexLimitation) {
						// snackbar the user that non-convex iceberg polygons are not supported!
						this.setState({
							snackbarVisible: true,
							snackbarMessage:
								"Non-convex or complex iceberg polygons are not supported",
							snackbarDelay: 2000
						});
					} else {
						let doesIntersectSelf = this.doesIntersectSelf(coords);
						if (doesIntersectSelf) {
							// self-intersecting polygons are not allowed!
							this.setState({
								snackbarVisible: true,
								snackbarMessage:
									"Self-intersecting iceberg polygons are not allowed",
								snackbarDelay: 2000
							});
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
			}
		} else {
			// no special mode - process normally:
			let isInsideAnIceberg = evt.target.tagName === "polygon";
			if (isInsideAnIceberg) {
				let pntStr = evt.target.getAttribute("points");
				// try to find the clicked iceberg in the model:
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
						// found it - so set it as selected:
						this.setState({
							selectedIceberg: ice
						});
						break;
					}
				}
			}
		}
	}

	doesIntersectSelf(coords) {
		var doesIntersectSelf = false;
		if (
			this.state.pathForNewIceberg != null &&
			this.state.pathForNewIceberg.length > 2
		) {
			for (
				var x = 0;
				x < this.state.pathForNewIceberg.length - 2 &&
				!doesIntersectSelf;
				x++
			) {
				let pt1 = this.state.pathForNewIceberg[x];
				let pt2 = this.state.pathForNewIceberg[x + 1];
				let pt3 = this.state.pathForNewIceberg[
					this.state.pathForNewIceberg.length - 1
				];
				let pt4 = coords;
				doesIntersectSelf = doLineSegmentsCross(pt1, pt2, pt3, pt4);
			}
		}
		return doesIntersectSelf;
	}

	doesPointBreakTheAllowOnlyConvexLimitation(coords) {
		let breaksTheAllowOnlyConvexLimitation;
		let numOfPointsInPath = 0;
		if (this.state.pathForNewIceberg != null) {
			numOfPointsInPath = this.state.pathForNewIceberg.length;
		}
		if (numOfPointsInPath < 3) {
			breaksTheAllowOnlyConvexLimitation = false;
		} else {
			let fullPolygon = this.state.pathForNewIceberg.slice();
			fullPolygon.push(coords);
			breaksTheAllowOnlyConvexLimitation = !this.isConvex(fullPolygon);
		}
		return breaksTheAllowOnlyConvexLimitation;
	}

	isConvex(polygonToCheck) {
		let retVal = true;
		let firstResult = 0;
		for (let z = 0; z < polygonToCheck.length && retVal; z++) {
			let p = polygonToCheck[z];
			let tmp = polygonToCheck[(z + 1) % polygonToCheck.length];
			let v = {
				x: tmp.x - p.x,
				y: tmp.y - p.y
			};
			let u = polygonToCheck[(z + 2) % polygonToCheck.length];
			if (z === 0) {
				firstResult = u.x * v.y - u.y * v.x + v.x * p.y - v.y * p.x;
			} else {
				let newResult = u.x * v.y - u.y * v.x + v.x * p.y - v.y * p.x;
				if (
					(newResult > 0 && firstResult < 0) ||
					(newResult < 0 && firstResult > 0)
				) {
					retVal = false;
				}
			}
		}
		return retVal;
	}

	// determines if the line between the given points crosses any existing iceberg edge in the map:
	doesCrossAnyEdge(pt1, pt2, icebergList) {
		var retVal = false;
		for (const iceberg of icebergList) {
			for (var v = 0; v < iceberg.points.length && !retVal; v++) {
				var vtx1 = iceberg.points[v];
				var vtx2 =
					v === iceberg.points.length - 1
						? iceberg.points[0]
						: iceberg.points[v + 1];
				if (
					!this.isSamePoint(pt1, vtx1) &&
					!this.isSamePoint(pt1, vtx2) &&
					!this.isSamePoint(pt2, vtx1) &&
					!this.isSamePoint(pt2, vtx2)
				) {
					retVal = doLineSegmentsCross(pt1, pt2, vtx1, vtx2);
				}
			}
			if (retVal) {
				break;
			}
		}
		return retVal;
	}

	isSamePoint(pt1, pt2) {
		return pt1.x === pt2.x && pt1.y === pt2.y;
	}
}

export default App;
