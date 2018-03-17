import React, { Component } from "react";
import SeaMap from "./components/SeaMap";
import "./App.css";
import ControlPanel from "./components/ControlPanel";
import { demoData } from "./demoData";

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
		} else {
			this.state = {};
		}
	}

	onDemoButtonClick = () => {
		this.setState({ ...demoData, shortestPath: null });
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
					onSelectedIcebergChange={this.onSelectedIcebergChange.bind(
						this
					)}
				/>
			</div>
		);
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
				// newIceberg is null - meaning we want to remove the other iceberg:
				newListOfIcebergs.splice(idxOfModified, 1);
			}
			this.setState({
				icebergs: newListOfIcebergs,
				shortestPath: null
			});
		}
	}
}

export default App;
