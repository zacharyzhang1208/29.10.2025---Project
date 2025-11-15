import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <ul>
          <li><Link to="/qna">智能问答</Link></li>
          <li><Link to="/prediction">价格预测</Link></li>
          <li><Link to="/policy">政策建议</Link></li>
        </ul>
        <div className="nav-title">农研智析</div>
      </nav>
    </header>
  );
}

export default Header;