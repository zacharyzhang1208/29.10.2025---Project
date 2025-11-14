import React, { useState } from 'react';

function PolicyAdvice() {
  const [region, setRegion] = useState('');
  const [advice, setAdvice] = useState('');

  const handleGenerate = () => {
    // 这里后续可接入政策建议生成API
    setAdvice(`示例建议：针对 ${region} 地区，建议完善补贴发放流程与信息公开机制。`);
  };

  return (
    <main className="content">
      <h2>政策建议</h2>
      <div className="search-container" style={{ marginTop: '16px' }}>
        <input
          type="text"
          placeholder="输入地区或主题..."
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="search-input"
        />
        <button className="search-button" onClick={handleGenerate}>生成建议</button>
      </div>
      {advice && (
        <div className="search-results" style={{ marginTop: '16px' }}>
          <h3>建议内容</h3>
          <p>{advice}</p>
        </div>
      )}
    </main>
  );
}

export default PolicyAdvice;