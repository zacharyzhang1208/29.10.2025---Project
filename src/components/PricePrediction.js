import React, { useState, useMemo, useRef } from 'react';

const PRODUCT_OPTIONS = ['水稻','小麦','玉米','大豆','生猪','蔬菜','水果'];
const REGION_OPTIONS = ['全国','华北','华东','华南','西南','东北','西北'];
const HORIZON_OPTIONS = [
  { label: '一周内', value: '1w' },
  { label: '一个月', value: '1m' },
  { label: '三个月', value: '3m' },
  { label: '半年', value: '6m' },
  { label: '一年', value: '12m' },
];

const BASE_PRICES = { 水稻:3.2, 小麦:2.6, 玉米:2.4, 大豆:5.2, 生猪:18.6, 蔬菜:3.5, 水果:6.8 };
const REGION_MULT = { 全国:1.0, 华北:0.98, 华东:1.03, 华南:1.06, 西南:1.04, 东北:0.96, 西北:0.97 };

function makeMockPrices(category, region){
  const r = REGION_MULT[region] ? region : '全国';
  const mult = REGION_MULT[r];
  const pool = Object.keys(BASE_PRICES);
  return pool.map(name => {
    const base = BASE_PRICES[name] * mult;
    const jitter = (Math.random()*0.06)-0.03; // ±3%
    const price = +(base*(1+jitter)).toFixed(2);
    const change = +(((Math.random()*1.6)-0.8)).toFixed(2); // ±0.8%
    return { name, price, change, highlight: category===name };
  });
}

function makeMockSeries(category, region, horizon){
  if (!category) return [];
  const r = REGION_MULT[region] ? region : '全国';
  const mult = REGION_MULT[r];
  const base = BASE_PRICES[category] * mult;
  const cfg = {
    '1w': { points: 7, label: i => `D${i+1}` , drift: 0.006 },
    '1m': { points: 30, label: i => `D${i+1}`, drift: 0.004 },
    '3m': { points: 12, label: i => `W${i+1}`, drift: 0.003 },
    '6m': { points: 24, label: i => `W${i+1}`, drift: 0.002 },
    '12m': { points: 12, label: i => `M${i+1}`, drift: 0.002 }
  };
  const c = cfg[horizon] || cfg['1m'];
  let p = base;
  const out = [];
  for (let i = 0; i < c.points; i++) {
    const shock = (Math.random()*0.02 - 0.01); // ±1%
    const trend = (Math.random()*c.drift - c.drift/2); // small drift
    p = p * (1 + shock + trend);
    const clamped = Math.max(base*0.85, Math.min(base*1.15, p));
    out.push({ idx: i, label: c.label(i), value: +clamped.toFixed(2) });
    p = clamped;
  }
  return out;
}

function makeRegionCompare(category, region){
  if (!category) return [];
  const regions = REGION_OPTIONS;
  const current = REGION_MULT[region] ? region : '全国';
  return regions.map(r => {
    const base = BASE_PRICES[category] * (REGION_MULT[r] || 1);
    const jitter = (Math.random()*0.04)-0.02;
    const price = +(base*(1+jitter)).toFixed(2);
    return { region: r, price, highlight: r===current };
  });
}

function PricePrediction(){
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [horizon, setHorizon] = useState('');

  const chartData = useMemo(()=>makeMockPrices(category, region),[category,region]);
  const maxPrice = Math.max(...chartData.map(d=>d.price));
  const chartRef = useRef(null);
  const effectiveHorizon = horizon || '1m';
  const series = useMemo(()=>makeMockSeries(category, region, effectiveHorizon),[category,region,effectiveHorizon]);
  const regionCompare = useMemo(()=>makeRegionCompare(category, region),[category,region]);

  const handleRowClick = (name) => {
    setCategory(name);
    if (!horizon) setHorizon('1m');
    const el = chartRef.current;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  

  return (
    <main className="content pred-page">
      <h2>价格预测</h2>

      <div className="pred-filter-bar" aria-label="价格预测筛选" style={{ marginTop: '14px' }}>
        <div className="filter-group">
          <label htmlFor="pred-category">农产品类型</label>
          <select id="pred-category" className="pred-select" value={category} onChange={e=>setCategory(e.target.value)}>
            <option value="" disabled>选择类型</option>
            {PRODUCT_OPTIONS.map(opt=> <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="pred-region">地区</label>
          <select id="pred-region" className="pred-select" value={region} onChange={e=>setRegion(e.target.value)}>
            <option value="" disabled>选择地区</option>
            {REGION_OPTIONS.map(opt=> <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="pred-horizon">预测时间</label>
          <select id="pred-horizon" className="pred-select" value={horizon} onChange={e=>setHorizon(e.target.value)}>
            <option value="" disabled>选择时间</option>
            {HORIZON_OPTIONS.map(opt=> <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        
      </div>

      {/* 当前市场价格表格 */}
      <section className="pred-table" aria-label="当前市场价格表格">
        <div className="pred-table-header">
          <h3>当前市场价格（{region || '全国'}）</h3>
          <span className="pred-chart-note">单位：元/公斤</span>
        </div>
        <div className="table-wrapper">
          <table className="market-table">
            <thead>
              <tr>
                <th>品类</th>
                <th>价格</th>
                <th>涨跌幅</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((d) => (
                <tr
                  key={d.name}
                  className={d.highlight ? 'is-highlight' : ''}
                  onClick={() => handleRowClick(d.name)}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleRowClick(d.name); }}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{d.name}</td>
                  <td>{d.price}</td>
                  <td className={d.change > 0 ? 'up' : d.change < 0 ? 'down' : ''}>
                    {d.change > 0 ? '+' : ''}{d.change}%
                  </td>
                  <td>{d.highlight ? '已选类型' : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="pred-charts-row">
        <section ref={chartRef} className="pred-chart" aria-label="价格预测趋势图">
          <div className="pred-chart-header">
            <h3>{category || '请选择品类'}价格趋势</h3>
            <span className="pred-chart-note">地区：{region || '全国'}｜时间：{HORIZON_OPTIONS.find(o=>o.value===effectiveHorizon)?.label}</span>
          </div>
          {category ? (
            <div style={{ position: 'relative', width: '100%', paddingBottom: '56%' }}>
              <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet" role="img" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <rect x="0" y="0" width="800" height="400" fill="#ffffff" stroke="#e6e6e6" />
                {(() => {
                  if (!series.length) return null;
                  const values = series.map(s => s.value);
                  const minV = Math.min(...values);
                  const maxV = Math.max(...values);
                  const pad = 40;
                  const w = 800 - pad*2;
                  const h = 320;
                  const toX = (i) => pad + (i/(series.length-1))*w;
                  const toY = (v) => pad + (1 - (v - minV)/(maxV - minV || 1)) * h;
                  const d = series.map((s,i)=>`${i===0?'M':'L'}${toX(i)},${toY(s.value)}`).join(' ');
                  return (
                    <g>
                      <g stroke="#f0f0f0">
                        {[0,1,2,3,4].map(i=> <line key={i} x1={pad} x2={pad+w} y1={pad + (h/4)*i} y2={pad + (h/4)*i} />)}
                      </g>
                      <path d={d} fill="none" stroke="#4873ff" strokeWidth="2.5" />
                      {series.map((s,i)=> (
                        <g key={i}>
                          <circle cx={toX(i)} cy={toY(s.value)} r="3.5" fill="#4873ff" />
                          {i%Math.ceil(series.length/6)===0 && (
                            <text x={toX(i)} y={pad + h + 20} fontSize="10" textAnchor="middle" fill="#777">{s.label}</text>
                          )}
                        </g>
                      ))}
                      <text x={pad} y={22} fontSize="12" fill="#555">价格区间：{minV.toFixed(2)}~{maxV.toFixed(2)} 元/公斤</text>
                    </g>
                  );
                })()}
              </svg>
            </div>
          ) : (
            <div className="search-results" style={{ marginTop: '8px' }}>
              <p style={{ color: '#666' }}>点击上方表格中的品类，或在筛选栏选择一个产品与时间范围，显示该产品的价格趋势。</p>
            </div>
          )}
        </section>

        <section className="pred-chart" aria-label="地区价格差异对比图">
          <div className="pred-chart-header">
            <h3>地区价格差异</h3>
            <span className="pred-chart-note">品类：{category || '未选择'}</span>
          </div>
          {category ? (
            <div style={{ position: 'relative', width: '100%', paddingBottom: '56%' }}>
              <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet" role="img" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <rect x="0" y="0" width="800" height="400" fill="#ffffff" stroke="#e6e6e6" />
                {(() => {
                  if (!regionCompare.length) return null;
                  const values = regionCompare.map(s => s.price);
                  const minV = Math.min(...values);
                  const maxV = Math.max(...values);
                  const pad = 40;
                  const w = 800 - pad*2;
                  const h = 320;
                  const gap = 10;
                  const bw = (w / regionCompare.length) - gap;
                  return (
                    <g>
                      <g stroke="#f0f0f0">
                        {[0,1,2,3,4].map(i=> <line key={i} x1={pad} x2={pad+w} y1={pad + (h/4)*i} y2={pad + (h/4)*i} />)}
                      </g>
                      {regionCompare.map((s,i)=>{
                        const x = pad + i*(bw+gap);
                        const ratio = (s.price - minV)/(maxV - minV || 1);
                        const bh = ratio * h;
                        const y = pad + (h - bh);
                        const fill = s.highlight ? '#e74c3c' : '#4873ff';
                        const stroke = s.highlight ? '#222' : 'none';
                        return (
                          <g key={i}>
                            <rect x={x} y={y} width={bw} height={bh} fill={fill} stroke={stroke} />
                            <text x={x + bw/2} y={pad + h + 20} fontSize="10" textAnchor="middle" fill="#777">{s.region}</text>
                            <text x={x + bw/2} y={y - 6} fontSize="10" textAnchor="middle" fill="#555">{s.price}</text>
                          </g>
                        );
                      })}
                      <text x={pad} y={22} fontSize="12" fill="#555">区间：{minV.toFixed(2)}~{maxV.toFixed(2)} 元/公斤</text>
                    </g>
                  );
                })()}
              </svg>
            </div>
          ) : (
            <div className="search-results" style={{ marginTop: '8px' }}>
              <p style={{ color: '#666' }}>选择一个品类后，查看不同地区的价格差异。</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default PricePrediction;