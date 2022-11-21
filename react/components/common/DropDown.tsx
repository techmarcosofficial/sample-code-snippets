import React from "react";
import { DropDownProps } from "../../utils/elements";

const DropDown = ({ name, selectedItem, options, onChangeEvent }: DropDownProps) => {
  return (
    <>
      <div className="input-wrap select-outer">
        <select
          name={name}
          value={selectedItem}
          className="form-control theme-ip sm"
          onChange={onChangeEvent}
        >
          {
            options.map((option, index: number) => (
              <option key={index} value={option.value}>{option.title}</option>
          ))}
        </select>
      </div>
    </>
  );
};

export default DropDown;
