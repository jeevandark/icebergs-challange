import React from "react";
import IconButton from "material-ui/IconButton";

const PointEditor = props => {
	let strClass = `point-editor ${props.point == null ? "is-null" : ""}`;
	return (
		<div className={strClass}>
			{renderLabel(props)} {renderCoordinates(props)}{" "}
			{renderButtons(props)}
		</div>
	);
};

function renderLabel(props) {
	if (props.label != null) {
		return <span className="point-editor-label">{props.label}</span>;
	} else {
		return null;
	}
}

function renderCoordinates(props) {
	return (
		<span className="point-coordinates">
			({" "}
			{props.point != null && props.point.x != null
				? props.point.x.toString()
				: "__"}{" "}
			,{" "}
			{props.point != null && props.point.y != null
				? props.point.y.toString()
				: "__"}{" "}
			)
		</span>
	);
}

function renderButtons(props) {
	return (
		<span className="point-buttons">
			{props.point != null ? (
				<IconButton onClick={props.onClearClick}>
					<i className="material-icons">clear</i>
				</IconButton>
			) : null}
		</span>
	);
}

export default PointEditor;
