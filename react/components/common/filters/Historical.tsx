import React from "react";

const Historical = ({ onChange }: any) => {
  return (
    <div className="input-wrap select-outer icon-ip position-relative select-drop">
      <i className="fa-regular fa-calendar icon-before z-6"></i>
      <select name="year" className="form-control theme-ip" onChange={onChange}>
        <option value="">Select...</option>
        <option value="5">Last 5 Years</option>
        <option value="10">Last 10 Years</option>
        <option value="15">Last 15 Years</option>
      </select>
    </div>
  );
};

export default Historical;
