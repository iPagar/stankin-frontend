import React from "react";
import { FixedLayout } from "@vkontakte/vkui";
import Icon16Cancel from "@vkontakte/icons/dist/16/cancel";
import "./table.css";

const MarksTable = ({ marks }) => (
  <React.Fragment>
   { <FixedLayout style={{ width: "100%", zIndex: 2 }}>
         <div className="tableRow">
           <div className="tableCellTitle">Предмет</div>
           <div className="tableCell">М1</div>
           <div className="tableCell">М2</div>
           <div className="tableCell">К</div>
           <div className="tableCell">З</div>
           <div className="tableCell">Э</div>
         </div>
       </FixedLayout>
       <div className="marksTable">
         <div className="tableContent">
           {marks.map((mark, i) => (
             <div className="tableRow" key={i}>
               <div className="tableCellTitle">{mark.subject}</div>
               {["М1", "М2", "К", "З", "Э"].map((tableCell, i) => {
                 let cell = (
                   <div className="tableCell" key={i}>
                     <Icon16Cancel />
                   </div>
                 );
                 for (let key in mark) {
                   if (key === tableCell)
                     cell = (
                       <div className="tableCell" key={i}>
                         {mark[`${key}`] !== 0 ? mark[`${key}`] : ""}
                       </div>
                     );
                 }
                 return cell;
               })}
             </div>
           ))}
         </div>
       </div>}
  </React.Fragment>
);

export default MarksTable;
