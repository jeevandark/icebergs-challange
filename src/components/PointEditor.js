import React from "react";

const PointEditor = props => {
	return (
		<div>
			{renderLabel(props)} {renderCoordinates(props)}
		</div>
	);
};

function renderLabel(props) {
	if (props.label != null) {
		return <span>{props.label}</span>;
	} else {
		return null;
	}
}

function renderCoordinates(props) {
	if (props.point != null) {
		return (
			<span>
				( {props.point.x != null ? props.point.x.toString() : "_"},{" "}
				{props.point.y != null ? props.point.y.toString() : "_"} )
			</span>
		);
	} else {
		return null;
	}
}

export default PointEditor;
