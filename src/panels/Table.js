import React, { Component } from "react";
import { Cell, Tooltip, FixedLayout, List } from "@vkontakte/vkui";
import MaterialTable from "material-table";

import Icon16Cancel from "@vkontakte/icons/dist/16/cancel";
import Icon24Info from "@vkontakte/icons/dist/24/info";

class Table extends Component {
	state = { tooltip: false };

	calcRating() {
		const subjects = this.props.marks.filter(
			mark =>
				mark.subject !== "ФК" &&
				mark.subject !== "Физическая культура" &&
				mark.subject !== "Прикладная физическая культура"
		);

		let sum = 0;
		let sumFactor = 0;

		subjects.forEach(subject => {
			let sumFactorSubject = 0;
			let sumSubject = 0;

			const factor = parseFloat(subject.factor);

			Object.keys(subject.marks).forEach(module => {
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

	render() {
		const { tooltip } = this.state;
		const { marks } = this.props;
		const hasRating = marks.every(mark => {
			const modules = Object.keys(mark.marks);

			return modules.every(module => mark.marks[module] !== 0);
		});

		return (
			<div
				style={{
					maxWidth: "100%",
					marginTop: 46,
					marginBottom: 46
				}}
			>
				<MaterialTable
					style={{ boxShadow: "none", borderRadius: 0 }}
					columns={[
						{
							title: "Предмет",
							field: "subject"
						},
						{
							title: "М1",
							sorting: false,
							render: rowData => {
								const mark = rowData.marks["М1"];
								return mark >= 0 ? (
									mark > 0 ? (
										<div>{mark}</div>
									) : null
								) : (
									<Icon16Cancel />
								);
							}
						},
						{
							title: "М2",
							sorting: false,
							render: rowData => {
								const mark = rowData.marks["М2"];
								return mark >= 0 ? (
									mark > 0 ? (
										<div>{mark}</div>
									) : null
								) : (
									<Icon16Cancel />
								);
							}
						},
						{
							title: "К",
							sorting: false,
							render: rowData => {
								const mark = rowData.marks["К"];
								return mark >= 0 ? (
									mark > 0 ? (
										<div>{mark}</div>
									) : null
								) : (
									<Icon16Cancel />
								);
							}
						},
						{
							title: "З",
							sorting: false,
							render: rowData => {
								const mark = rowData.marks["З"];
								return mark >= 0 ? (
									mark > 0 ? (
										<div>{mark}</div>
									) : null
								) : (
									<Icon16Cancel />
								);
							}
						},
						{
							title: "Э",
							sorting: false,
							render: rowData => {
								const mark = rowData.marks["Э"];
								return mark >= 0 ? (
									mark > 0 ? (
										<div>{mark}</div>
									) : null
								) : (
									<Icon16Cancel />
								);
							}
						},
						{
							title: "Ф",
							field: "factor",
							hidden: true,
							defaultSort: "desc"
						}
					]}
					data={marks}
					options={{
						showTitle: false,
						toolbar: false,
						paging: false,
						sorting: true,
						search: false,
						draggable: false,
						cellStyle: { padding: 4 },
						headerStyle: {
							zIndex: 0,
							top: 0,
							padding: 4
						}
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
								indicator={
									<div>
										{hasRating || (
											<Icon24Info
												fill={"#5181b8"}
												onClick={() =>
													this.setState({
														tooltip: true
													})
												}
											/>
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
