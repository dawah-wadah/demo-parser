import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <header id="header">
    <h1>
      <Link to="/">Counter-Stats: GO</Link>
    </h1>
  </header>
);

export default Header;
