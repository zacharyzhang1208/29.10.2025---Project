import React, { useState } from 'react';

function Content() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // 这里可以添加搜索逻辑
  };

  return (
    <main className="content">
      <section>
        <h2>普惠农业 Project 智能 Agent</h2>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="请输入您的问题..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <button className="search-button">问Agent</button>
        </div>
        
        {searchTerm && (
          <div className="search-results">
            <p>搜索结果: "{searchTerm}"</p>
            {/* 这里可以显示搜索结果 */}
          </div>
        )}
      </section>
    </main>
  );
}

export default Content;