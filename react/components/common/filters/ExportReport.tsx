import React from "react";

const ExportReport = ({ onChange }: any) => {
  return (
    <div className="input-wrap select-outer icon-ip position-relative select-drop">
      <i className="fa-solid fa-download icon-before z-6"></i>
      <select name="report" className="form-control theme-ip" onChange={onChange}>
        <option value="">Export Report</option>
        <option value="5">Last 5 Years</option>
        <option value="10">Last 10 Years</option>
        <option value="15">Last 15 Years</option>
      </select>
     
    </div>
  )
}

export default ExportReport;