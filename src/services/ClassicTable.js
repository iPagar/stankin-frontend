import React from "react";
import { FixedLayout, Footer } from "@vkontakte/vkui";
import Icon16Cancel from "@vkontakte/icons/dist/16/cancel";
import "./table.css";
import MaterialTable from "material-table";

class ClassicTable extends React.Component {
  render() {
    const { marks } = this.props;

    return (
      <div>
        <div style={{ maxWidth: "100%" }}>
          <MaterialTable
            columns={[
              {
                title: "Предмет",
                field: "subject",
                cellStyle: {
                  width: "50px",
                  maxWidth: "150px",
                  padding: "0 8px"
                }
              },
              {
                title: "М1",
                field: "М1",
                type: "numeric"
                // editComponent: props => (
                //   <input
                //     type="text"
                //     value={props.value}
                //     onChange={e => props.onChange(e.target.value)}
                //   />
                // ),
              },
              {
                title: "М2",
                field: "М2",
                type: "numeric"
              },
              {
                title: "К",
                field: "К",
                type: "numeric",
                render: rowData =>
                  rowData["К"] >= 0 ? (
                    rowData["К"]
                  ) : (
                    <Icon16Cancel style={{ display: "inline-flex" }} />
                  )
              },
              {
                title: "З",
                field: "З",
                type: "numeric",
                render: rowData =>
                  rowData["З"] >= 0 ? (
                    rowData["З"]
                  ) : (
                    <Icon16Cancel style={{ display: "inline-flex" }} />
                  )
              },
              {
                title: "Э",
                field: "Э",
                type: "numeric",
                render: rowData =>
                  rowData["Э"] >= 0 ? (
                    rowData["Э"]
                  ) : (
                    <Icon16Cancel style={{ display: "inline-flex" }} />
                  )
              }
            ]}
            data={marks.filter(
              mark =>
                mark.subject !== "Рейтинг" &&
                mark.subject !== "Накопленный Рейтинг"
            )}
            options={{
              cellStyle: {
                textAlign: "left",
                width: "20px",
                maxWidth: "20px",
                padding: "0 8px"
              },
              headerStyle: {
                flexDirection: "row",
                zIndex: 0,
                width: "20px",
                maxWidth: "20px",
                padding: "0 8px"
              },
              toolbar: false,
              paging: false,
              padding: 0,
              draggable: false
            }}
            // editable={{
            //   onRowUpdate: (newData, oldData) =>
            //     new Promise((resolve, reject) => {
            //       setTimeout(() => {
            //         {
            //           const data = this.state.data;
            //           const index = data.indexOf(oldData);
            //           data[index] = newData;
            //           this.setState({ data }, () => resolve());
            //         }
            //         resolve();
            //       }, 1000);
            //     })
            // }}
          />
        </div>
        <Footer>
          {marks
            .filter(mark => mark.subject === "Рейтинг")
            .map((mark, i) => (
              <div key={i}>
                {`${mark.subject}: ${
                  mark[`М1`] === 0 ? "Нет оценки" : mark[`М1`]
                }`}
              </div>
            ))}
          {marks
            .filter(mark => mark.subject === "Накопленный Рейтинг")
            .map((mark, i) => (
              <div key={i}>
                {`${mark.subject}: ${
                  mark[`М1`] === 0 ? "Нет оценки" : mark[`М1`]
                }`}
              </div>
            ))}
        </Footer>
      </div>
    );
  }
}

// const ClassicTable = ({ marks }) => (
//   <React.Fragment>
//     <FixedLayout
//       vertical="top"
//       style={{ width: "100%", zIndex: -2, paddingTop: 48 }}
//     >
//       <div className="tableRow">
//         <div className="tableCellTitle">Предмет</div>
//         <div className="tableCell">М1</div>
//         <div className="tableCell">М2</div>
//         <div className="tableCell">К</div>
//         <div className="tableCell">З</div>
//         <div className="tableCell">Э</div>
//       </div>
//     </FixedLayout>

//     <div className="marksTable">
//       <div className="tableContent">
//         {marks
//           .filter(
//             mark =>
//               mark.subject !== "Рейтинг" &&
//               mark.subject !== "Накопленный Рейтинг"
//           )
//           .map((mark, i) => (
//             <div className="tableRow" key={i}>
//               <div className="tableCellTitle">{mark.subject}</div>
//               {["М1", "М2", "К", "З", "Э"].map((tableCell, i) => {
//                 let cell = (
//                   <div className="tableCell" key={i}>
//                     <Icon16Cancel />
//                   </div>
//                 );
//                 for (let key in mark) {
//                   if (key === tableCell)
//                     cell = (
//                       <div className="tableCell" key={i}>
//                         {mark[`${key}`] !== 0 ? mark[`${key}`] : ""}
//                       </div>
//                     );
//                 }
//                 return cell;
//               })}
//             </div>
//           ))}
//         {marks
//           .filter(
//             mark =>
//               mark.subject === "Рейтинг" ||
//               mark.subject === "Накопленный Рейтинг"
//           )
//           .reverse()
//           .map((mark, i) => (
//             <div className="tableRow" key={i}>
//               <div className="tableCellTitle">{mark.subject}</div>
//               {["М1", "М2", "К", "З", "Э"].map((tableCell, i) => {
//                 let cell = (
//                   <div className="tableCell" key={i}>
//                     <Icon16Cancel />
//                   </div>
//                 );
//                 for (let key in mark) {
//                   if (key === tableCell)
//                     cell = (
//                       <div className="tableCell" key={i}>
//                         {mark[`${key}`] !== 0 ? mark[`${key}`] : ""}
//                       </div>
//                     );
//                 }
//                 return cell;
//               })}
//             </div>
//           ))}
//       </div>
//     </div>
//   </React.Fragment>
// );

export default ClassicTable;
