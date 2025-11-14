import React, { useState, useMemo } from 'react';

function QnA() {
  const [question, setQuestion] = useState('');
  const [answerBlocks, setAnswerBlocks] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [history, setHistory] = useState([]);
  const [voiceDemo, setVoiceDemo] = useState({ show: false, step: 'idle' });
  const baseSuggestions = [
    '今年小麦补贴政策是什么？',
    '玉米价格趋势如何？',
    '蔬菜近期市场价格有没有波动？',
    '水稻收购价与成本的关系？',
    '生猪价格未来一个月走势预测？'
  ];
  const suggestions = useMemo(() => {
    const uniq = [];
    [...history.slice(0, 5), ...baseSuggestions].forEach(s => { if (!uniq.includes(s)) uniq.push(s); });
    return uniq.slice(0, 8);
  }, [history]);

  const makeFakeAnswer = (q) => {
    const topic = (q || '').trim() || '示例问题';
    return [
      `摘要：针对「${topic}」的综合分析与答复（模拟数据）。`,
      '要点：\n1) 市场供需结构与季节性因素显著\n2) 成本端投入与政策变化可能导致价格波动\n3) 区域差异与运输半径影响终端报价',
      '数据示例：\n- 2025Q3 环比增长：3.2%\n- 主要产区：A省/B市\n- 参考成交区间：X~Y 元/公斤',
      '解读：以上数据为示例，旨在展示布局效果与信息层级。',
      '建议：保持关注实时行情与官方公告，结合本地渠道做决策。',
      '更多说明：若接入真实API，将在此处渲染结构化答案与图表。',
    ];
  };

  const handleAsk = () => {
    const q = question.trim();
    if (!q) return;
    const blocks = makeFakeAnswer(q);
    setAnswerBlocks(blocks);
    setExpanded(true);
    setHistory((prev) => [q, ...prev].slice(0, 10));
  };

  const handleVoiceDemo = () => {
    setVoiceDemo({ show: true, step: 'listening' });
    setTimeout(() => setVoiceDemo({ show: true, step: 'processing' }), 1200);
    setTimeout(() => {
      const sample = '请问近期玉米价格趋势如何？';
      setQuestion(sample);
      setVoiceDemo({ show: false, step: 'done' });
      setTimeout(handleAsk, 50);
    }, 2200);
  };

  const useFromHistory = (q) => {
    setQuestion(q);
    const blocks = makeFakeAnswer(q);
    setAnswerBlocks(blocks);
    setExpanded(true);
  };

  const clearHistory = () => setHistory([]);

  const hasAnswer = answerBlocks.length > 0;

  return (
    <main className="content qna-page">
      <div className="qna-grid">
        {/* 左侧：提问历史卡片（1/5） */}
        <section className="qna-card qna-history-card" aria-label="提问历史">
          <div className="qna-card-header">
            <h3>提问历史</h3>
          </div>
          {history.length === 0 ? (
            <div className="qna-history-empty">暂无历史记录</div>
          ) : (
            <ul className="qna-history-list">
              {history.map((q, i) => (
                <li key={i}>
                  <button className="qna-history-item" onClick={() => useFromHistory(q)}>{q}</button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 右侧：搜索与回答卡片（4/5） */}
        <section className="qna-card qna-main-card" aria-label="智能问答卡片">
          <h2 className="qna-title">智能问答</h2>
          <div className="qna-input-row" style={{ marginTop: '8px' }}>
            <input
              type="text"
              placeholder="请输入问题..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="search-input"
            />
            <button className="search-button" onClick={handleAsk}>提问</button>
            <button className="voice-button" onClick={handleVoiceDemo} aria-label="语音提问" title="语音提问"><span className="voice-icon" /></button>
          </div>
          {voiceDemo.show && (
            <div className="voice-demo" aria-live="polite" style={{ marginTop: '8px' }}>
              <span className="voice-dot" />{voiceDemo.step === 'listening' ? '语音识别中…' : '处理中…'}
            </div>
          )}
          <div className="qna-suggestions" aria-label="提问建议" style={{ marginTop: '10px' }}>
            {suggestions.map((s, i) => (
              <button key={i} className="qna-chip" onClick={() => useFromHistory(s)}>{s}</button>
            ))}
          </div>

          <div className={`qna-answer ${hasAnswer && expanded ? 'expanded' : ''}`}>
            {hasAnswer && (
              <div className="answer-content">
                <div className="answer-title">回答</div>
                {answerBlocks.map((t, i) => (
                  <p
                    key={i}
                    className="answer-section"
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    {t}
                  </p>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default QnA;