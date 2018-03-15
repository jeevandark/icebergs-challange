import React, { Component } from "react";
import SeaMap from "./components/SeaMap";
import "./App.css";
import ControlPanel from "./components/ControlPanel";
import { demoData } from "./demoData";

class App extends Component {
	static kMapHeight = 600;
	static kMapAndControlPanelWidth = 600;

	constructor() {
		super();
		this.state = {};
	}

	onDemoButtonClick = () => {
		this.setState(demoData);
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
				/>
			</div>
		);
	}

	handleFromPointCleared() {
		this.setState({ sourcePoint: null });
	}

	handleToPointCleared() {
		this.setState({ destinationPoint: null });
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
				icebergs: newListOfIcebergs
			});
		}
	}
}

export default App;
