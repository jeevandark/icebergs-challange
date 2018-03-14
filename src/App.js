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
				/>
			</div>
		);
	}
}

export default App;
