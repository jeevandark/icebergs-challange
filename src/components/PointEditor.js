import React, { Component } from "react";
import IconButton from "material-ui/IconButton";

class PointEditor extends Component {
	state = {
		isInEdit: false
	};

	localx;
	localy;

	componentDidMount() {
		if (this.props.point != null) {
			this.localx = this.props.point.x;
			this.localy = this.props.point.y;
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.point != null) {
			this.localx = nextProps.point.x;
			this.localy = nextProps.point.y;
		}
	}

	render() {
		let strClass = `point-editor ${
			this.props.point == null ? "is-null" : ""
		}`;
		return (
			<div className={strClass} onBlur={this.handleOnBlur.bind(this)}>
				{this.renderLabel()}{" "}
				{this.state.isInEdit &&
				this.localx != null &&
				this.localy != null
					? this.renderEditableCoordinates()
					: this.renderCoordinates()}{" "}
				{this.renderButtons()}
			</div>
		);
	}

	handleOnBlur() {
		window.setTimeout(() => {
			if (
				document.activeElement !== this.xInput &&
				document.activeElement !== this.yInput
			) {
				if (this.props != null) {
					if (this.xInput != null && this.yInput != null) {
						let areEqual = false;
						if (this.props.point != null) {
							areEqual =
								this.props.point.x.toString() ===
									this.xInput.value.toString() &&
								this.props.point.y.toString() ===
									this.yInput.value.toString();
						}
						if (!areEqual && this.props.onChange != null) {
							this.props.onChange(
								{
									x: parseFloat(this.xInput.value),
									y: parseFloat(this.yInput.value)
								},
								this.props.point
							);
						}
					}
				}
				this.setState({
					isInEdit: false
				});
			}
		}, 80);
	}

	handleEnterEditMode(isClickOnY, evt) {
		this.setState({
			isInEdit: true
		});
		window.setTimeout(() => {
			let myElem = isClickOnY ? this.yInput : this.xInput;
			if (myElem != null) {
				myElem.focus();
				myElem.select();
			}
		}, 100);
	}

	renderLabel() {
		if (this.props.label != null) {
			return (
				<span
					onClick={e => this.handleEnterEditMode(false, e)}
					className="point-editor-label"
				>
					{this.props.label}
				</span>
			);
		} else {
			return null;
		}
	}

	renderCoordinates() {
		return (
			<span className="point-coordinates">
				<span onClick={e => this.handleEnterEditMode(false, e)}>
					({" "}
					{this.props.point != null && this.props.point.x != null
						? this.props.point.x.toString()
						: " \u00A0\u00A0"}{" "}
				</span>
				,{" "}
				<span onClick={e => this.handleEnterEditMode(true, e)}>
					{this.props.point != null && this.props.point.y != null
						? this.props.point.y.toString()
						: " \u00A0\u00A0"}{" "}
				</span>
				)
			</span>
		);
	}

	renderEditableCoordinates() {
		return (
			<span className="point-coordinates">
				({" "}
				<input
					ref={input => {
						this.xInput = input;
					}}
					onClick={e => this.handleClickOnInput(e.target)}
					type="text"
					className="editable-coordinate"
					defaultValue={this.localx}
					onKeyDown={e => this.handleKeyDownOnInput(e)}
				/>{" "}
				,{" "}
				<input
					ref={input => {
						this.yInput = input;
					}}
					type="text"
					onClick={e => this.handleClickOnInput(e.target)}
					className="editable-coordinate"
					defaultValue={this.localy}
					onKeyDown={e => this.handleKeyDownOnInput(e)}
				/>{" "}
				)
			</span>
		);
	}

	renderButtons() {
		return (
			<span className="point-buttons">
				{this.props.point != null && !this.state.isInEdit ? (
					<IconButton onClick={this.props.onClearClick}>
						<i className="material-icons">clear</i>
					</IconButton>
				) : null}
			</span>
		);
	}

	handleClickOnInput(myElem) {
		myElem.select();
	}

	handleKeyDownOnInput(evt) {
		if (evt.keyCode === 13) {
			// enter
			evt.target.blur();
		} else if (evt.keyCode === 27) {
			// esc
			this.setState({
				isInEdit: false
			});
		}
	}
}

export default PointEditor;
