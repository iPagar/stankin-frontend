import React, { Component } from "react";
import { Cell, Tooltip, FixedLayout, List } from "@vkontakte/vkui";
import MaterialTable from "material-table";

import Icon16Cancel from "@vkontakte/icons/dist/16/cancel";
import Icon24Info from "@vkontakte/icons/dist/24/info";
import InputCell from "./InputCell";

class Table extends Component {
	state = {
		tooltip: false,
		marks: [],
		semester: "",
		hasRating: false,
		isEdited: false,
	};

	calcRating() {
		const { marks } = this.state;

		let sum = 0;
		let sumFactor = 0;

		marks.forEach((subject) => {
			let sumFactorSubject = 0;
			let sumSubject = 0;

			const factor = parseFloat(subject.factor);

			Object.keys(subject.marks).forEach((module) => {
				const value =
					subject.marks[module] === 0 ? 25 : subject.marks[module];

				if (module === "М1") {
					sumFactorSubject += 3;
					sumSubject += value * 3;
				} else if (module === "М2") {
					sumFactorSubject += 2;
					sumSubject += value * 2;
				} else if (module === "З") {
					sumFactorSubject += 5;
					sumSubject += value * 5;
				} else if (module === "К") {
					sumFactorSubject += 5;
					sumSubject += value * 5;
				} else if (module === "Э") {
					sumFactorSubject += 7;
					sumSubject += value * 7;
				}
			});

			sumFactor += factor;
			sum += (sumSubject / sumFactorSubject) * factor;
		});

		const rating = (sum /= sumFactor);

		return Math.round(rating);
	}

	static getDerivedStateFromProps(props, state) {
		if (props.semester !== state.semester) {
			const hasRating = props.marks.every((mark) => {
				const modules = Object.keys(mark.marks);

				return modules.every((module) => mark.marks[module] !== 0);
			});

			return {
				marks: props.marks,
				semester: props.semester,
				hasRating,
			};
		}
		return null;
	}

	componentDidMount() {
		this.init();
	}

	init = () => {
		this.setState({
			marks: this.props.marks,
			semester: this.props.semester,
			isEdited: false,
		});
	};

	handleChange = (event) => {
		const { value } = event.target;
		const { mark, subject } = event.target.dataset;
		const { marks } = this.state;

		const i = marks.findIndex((mark) => mark.subject === subject);
		const newMarks = JSON.parse(JSON.stringify(marks));
		newMarks[i].marks[mark] = value;

		this.setState({ marks: newMarks, isEdited: this.isEdited(newMarks) });
	};

	handleFocus = (event) => {
		event.target.value = null;
	};

	handleBlur = (event) => {
		const { mark, subject } = event.target.dataset;
		const { marks } = this.props;
		const newValue = event.target.value;
		const i = marks.findIndex((mark) => mark.subject === subject);
		const oldValue = marks[i].marks[mark];
		const nowValue = this.state.marks[i].marks[mark];
		const newMarks = JSON.parse(JSON.stringify(this.state.marks));

		if (newValue >= 25 && newValue <= 54)
			newMarks[i].marks[mark] = newValue;
		else if (nowValue >= 25 && nowValue <= 54)
			newMarks[i].marks[mark] = nowValue;
		else newMarks[i].marks[mark] = oldValue;

		this.setState({ marks: newMarks });
	};

	renderCell = (rowData, markTitle) => {
		const mark = rowData.marks[markTitle];
		const { hasRating } = this.state;

		return mark >= 0 ? (
			<InputCell
				value={mark}
				disabled={hasRating}
				mark={markTitle}
				subject={rowData.subject}
				onChange={this.handleChange}
				onFocus={this.handleFocus}
				onBlur={this.handleBlur}
			/>
		) : (
			<Icon16Cancel />
		);
	};

	isEdited(newMarks) {
		const oldMarks = JSON.stringify(this.props.marks);

		return newMarks !== oldMarks;
	}

	render() {
		const { tooltip, marks, hasRating } = this.state;

		return (
			<div
				style={{
					maxWidth: "100%",
					marginTop: 120,
					marginBottom: "calc(var(--tabbar_height) + 48px)",
				}}
			>
				<MaterialTable
					style={{
						boxShadow: "none",
						borderRadius: 0,
						backgroundColor: "var(--header_background)",
						color: "var(--header_text)",
					}}
					columns={[
						{
							title: "Предмет",
							field: "subject",
							minWidth: 200,
							width: "100%",
							maxWidth: 400,
							customSort: (a, b) => a.factor - b.factor,
						},
						{
							title: "М1",
							sorting: false,
							maxWidth: 50,
							render: (rowData) => this.renderCell(rowData, "М1"),
						},
						{
							title: "М2",
							sorting: false,
							maxWidth: 50,
							render: (rowData) => this.renderCell(rowData, "М2"),
						},
						{
							title: "К",
							sorting: false,
							maxWidth: 50,
							render: (rowData) => this.renderCell(rowData, "К"),
						},
						{
							title: "З",
							sorting: false,
							maxWidth: 18,
							render: (rowData) => this.renderCell(rowData, "З"),
						},
						{
							title: "Э",
							sorting: false,
							maxWidth: 50,
							render: (rowData) => this.renderCell(rowData, "Э"),
						},
						{
							title: "Ф",
							field: "factor",
							hidden: true,
							defaultSort: "desc",
						},
					]}
					data={marks}
					options={{
						showTitle: false,
						toolbar: false,
						paging: false,
						sorting: true,
						search: false,
						draggable: false,
						cellStyle: {
							padding: 4,
						},
						headerStyle: {
							zIndex: 0,
							top: 0,
							padding: 4,
							backgroundColor: "var(--header_background)",
							color: "var(--header_text)",
						},
					}}
				/>
				<Tooltip
					text="Модули без оценки считаются минимальными"
					isShown={tooltip}
					onClose={() => this.setState({ tooltip: false })}
					alignY={"top"}
					alignX={"right"}
				>
					<FixedLayout vertical="bottom">
						<List>
							<Cell
								style={{
									backgroundColor: "var(--header_background)",
								}}
								indicator={
									this.state.isEdited ? (
										<div onClick={this.init}>
											{"Сбросить"}
										</div>
									) : null
								}
								asideContent={
									<div>
										{hasRating || (
											<div style={{ float: "right" }}>
												<Icon24Info
													fill={"#5181b8"}
													onClick={() =>
														this.setState({
															tooltip: true,
														})
													}
												/>
											</div>
										)}
									</div>
								}
							>
								{!hasRating && `Ожидаемый`} {`Рейтинг: `}
								{this.calcRating()}
							</Cell>
						</List>
					</FixedLayout>
				</Tooltip>
			</div>
		);
	}
}

export default Table;
