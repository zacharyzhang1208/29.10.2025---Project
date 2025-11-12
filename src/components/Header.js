import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <h1>普惠农业 Project</h1>
      <nav>
        <ul>
          <li><Link to="/">首页</Link></li>
          <li><Link to="/about">关于</Link></li>
          <li><a href="#">联系我们</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;