import React, { Component } from "react";
import SeaMap from "./components/SeaMap";
import "./App.css";
import ControlPanel from "./components/ControlPanel";
import { demoData } from "./demoData";

class App extends Component {
	static kMapHeight = 600;
	static kMapAndControlPanelWidth = 600;

	static pathToApiFSPEndpoint = "http://localhost:4000/fsp/";

	constructor() {
		super();
		this.state = {};
	}

	onDemoButtonClick = () => {
		this.setState({ ...demoData, shortestPath: null });
	};

	onCalcShortestPath = () => {
		// let myHeaders = new Headers();
		// myHeaders.append("Content-Type", "application/json");
		// myHeaders.append("Accept", "application/json, text/plain, */*");
		let myInit = {
			body: JSON.stringify(this.state), // cache: "no-cache", // body: this.state,
			// credentials: "same-origin",
			// headers: myHeaders,
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
				<SeaMap
					width={App.kMapAndControlPanelWidth}
					height={App.kMapHeight}
					icebergs={this.state.icebergs}
					sourcePoint={this.state.sourcePoint}
					destinationPoint={this.state.destinationPoint}
					shortestPath={this.state.shortestPath}
				/>
				<ControlPanel
					width={App.kMapAndControlPanelWidth}
					icebergs={this.state.icebergs}
					sourcePoint={this.state.sourcePoint}
					destinationPoint={this.state.destinationPoint}
					onDemoButtonClick={this.onDemoButtonClick}
					onFromPointCleared={this.handleFromPointCleared.bind(this)}
					onToPointCleared={this.handleToPointCleared.bind(this)}
					onIcebergModified={this.handleIcebergChange.bind(this)}
					onCalcShortestPath={this.onCalcShortestPath.bind(this)}
				/>
			</div>
		);
	}

	handleFromPointCleared() {
		this.setState({ sourcePoint: null, shortestPath: null });
	}

	handleToPointCleared() {
		this.setState({ destinationPoint: null, shortestPath: null });
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
