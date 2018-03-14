import React, { Component } from "react";
import SeaMap from "./components/SeaMap";
import "./App.css";
import ControlPanel from "./components/ControlPanel";

class App extends Component {
	static kMapHeight = 600;
	static kMapAndControlPanelWidth = 600;

	constructor() {
		super();
		this.state = {
			polygons: [
				{
					points: [
						{
							x: 220.5,
							y: 10
						},
						{
							x: 300,
							y: 210
						},
						{
							x: 170,
							y: 250
						},
						{
							x: 123,
							y: 234
						}
					]
				},
				{
					points: [
						{
							x: 100,
							y: 30
						},
						{
							x: 150,
							y: 90
						},
						{
							x: 120,
							y: 110
						}
					]
				}
			]
		};
	}

	render() {
		return (
			<div className="App">
				<SeaMap
					width={App.kMapAndControlPanelWidth}
					height={App.kMapHeight}
					polygons={this.state.polygons}
				/>
				<ControlPanel width={App.kMapAndControlPanelWidth} />
			</div>
		);
	}
}

export default App;
