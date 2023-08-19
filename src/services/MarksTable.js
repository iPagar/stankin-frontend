import React from "react";
import { Footer } from "@vkontakte/vkui";
import MarkCell from "./MarkCell";
import ClassicTable from "./ClassicTable";

const MarksTable = ({ marks, style, is_classic }) => (
  <div>
    {/* {!is_classic ? (
			<div style={style}>
				{marks
					.filter(
						mark =>
							mark.subject !== "Рейтинг" &&
							mark.subject !== "Накопленный Рейтинг"
					)
					.map((mark, i) => (
						<MarkCell key={i} mark={mark} />
					))}
				<Footer>
					{marks
						.filter(
							mark =>
								mark.subject === "Рейтинг" ||
								mark.subject === "Накопленный Рейтинг"
						)
						.map((mark, i) => (
							<div key={i}>
								{`${mark.subject}: ${
									mark[`М1`] === 0 ? "Нет оценки" : mark[`М1`]
								}`}
							</div>
						))}
				</Footer>
			</div>
		) : (
			<ClassicTable marks={marks} />
		)} */}
  </div>
);

export default MarksTable;
