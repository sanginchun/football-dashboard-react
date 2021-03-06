import React from "react";
import PropTypes from "prop-types";

const propTypes = { editMode: PropTypes.bool.isRequired };

function Sidebar(props) {
  return (
    <aside
      className="sidebar"
      style={props.editMode ? { opacity: "0.7", pointerEvents: "none" } : null}
    >
      {props.children}
    </aside>
  );
}

Sidebar.propTypes = propTypes;

export default Sidebar;
