import React from "react";
import { Link } from "react-router-dom";
import { DropdownMenuOptions } from "../../utils/elements";

const DropDownMenu = ({ items }: DropdownMenuOptions) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="dropdown ham-drop">
      <button
        title="Menu"
        className="dropdown-toggle"
        data-toggle="dropdown"
        onClick={() => setOpen(!open)}
      >
        <i className="fa-solid fa-bars"></i>
      </button>
      {open && (
        <div
          className="dropdown-menu dropdown-menu-right theme-drop"
          style={{ display: "block" }}
        >
          {items.length
            ? items.map((item, index) => (
                <Link
                  key={index}
                  to={item.url}
                  title={item.title}
                  className="link"
                >
                  {item.title}
                </Link>
              ))
            : null}
        </div>
      )}
    </div>
  );
};

export default DropDownMenu;
