import React from "react";
import { Link } from "react-router-dom";
import Uploader from './upload.jsx'

const Header = () => (
  <header id="header">
    <h1>
      <Link to="/">CS:GO Stats</Link>
      <Uploader />
    </h1>
  </header>
);

export default Header;
