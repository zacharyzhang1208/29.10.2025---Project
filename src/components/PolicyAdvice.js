import React, { useState, useMemo } from 'react';

const POLICY_CATEGORIES = ['全部政策','粮食作物','经济作物','特色农产品','畜牧业'];
const CROP_OPTIONS = ['小麦','玉米','水稻','大豆','油菜','棉花','蔬菜','水果'];
const POLICY_TYPES = ['补贴','收储','价格支持','保险','税费','用地','监管','其他'];
const DATE_OPTIONS = [
  { label: '近一个月', value: '1m' },
  { label: '近三个月', value: '3m' },
  { label: '近半年', value: '6m' },
  { label: '近一年', value: '12m' },
  { label: '一年以上', value: 'gt12m' },
];

const FARMER_HISTORY = ['小麦','玉米','蔬菜'];
const MOCK_POLICIES = [
  { id: 'p1', title: '2025年小麦种植补贴细则发布', crop: '小麦', type: '补贴', date: '2025-10-12', source: '农业农村部', summary: '针对主产区提高单亩补贴标准，明确申领流程与监督机制。' },
  { id: 'p2', title: '玉米最低收购价政策调整', crop: '玉米', type: '收储', date: '2025-09-28', source: '国家发改委', summary: '兼顾市场价格与农民收益，优化收储节奏与仓储管理。' },
  { id: 'p3', title: '蔬菜价格支持及保险试点扩大', crop: '蔬菜', type: '保险', date: '2025-08-05', source: '银保监会', summary: '扩大政策性农业保险覆盖面，降低自然灾害风险，提升抗风险能力。' },
  { id: 'p4', title: '水稻高标准农田建设补助方案', crop: '水稻', type: '用地', date: '2025-07-19', source: '自然资源部', summary: '聚焦水利及土壤改良投入，明确项目验收标准与绩效评估。' },
  { id: 'p5', title: '特色农产品品牌建设与税费优惠', crop: '水果', type: '税费', date: '2025-06-22', source: '财政部', summary: '鼓励地理标志品牌打造，对符合条件的主体提供税费减免。' },
  { id: 'p6', title: '大豆生产支持与轮作补贴', crop: '大豆', type: '价格支持', date: '2025-08-30', source: '农业农村部', summary: '推广大豆轮作与耕地质量提升计划，适度提高支持强度。' },
];

function PolicyAdvice() {
  const [category, setCategory] = useState(POLICY_CATEGORIES[0]);
  const [date, setDate] = useState('');
  const [crop, setCrop] = useState('');
  const [ptype, setPtype] = useState('');
  const [keyword, setKeyword] = useState('');

  const recommended = useMemo(() => {
    let list = MOCK_POLICIES.filter(p => FARMER_HISTORY.includes(p.crop));
    if (crop) list = list.filter(p => p.crop === crop);
    if (ptype) list = list.filter(p => p.type === ptype);
    if (keyword) list = list.filter(p => (p.title + p.summary + p.source).includes(keyword));
    return list.slice(0, 6);
  }, [crop, ptype, keyword]);

  return (
    <main className="content policy-page">
      <h2>政策建议</h2>

      <div className="policy-grid" style={{ marginTop: '12px' }}>
        <aside className="policy-sidebar" aria-label="政策分类筛选">
          <div className="policy-sidebar-header">政策分类</div>
          <ul className="policy-list">
            {POLICY_CATEGORIES.map((c) => (
              <li
                key={c}
                className={c === category ? 'active' : ''}
                onClick={() => setCategory(c)}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setCategory(c); }}
              >
                {c}
              </li>
            ))}
          </ul>
        </aside>

        <section className="policy-content" aria-label="政策建议内容">
          <div className="policy-panel">
            <div className="policy-filter-bar" style={{ marginTop: '4px' }}>
              <div className="policy-filter-left">
                <div className="filter-group">
                  <label htmlFor="policy-date">日期</label>
                  <select id="policy-date" className="policy-select" value={date} onChange={(e)=>setDate(e.target.value)}>
                    <option value="" disabled>选择日期范围</option>
                    {DATE_OPTIONS.map(opt=> <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="filter-group">
                  <label htmlFor="policy-crop">作物种类</label>
                  <select id="policy-crop" className="policy-select" value={crop} onChange={(e)=>setCrop(e.target.value)}>
                    <option value="" disabled>选择作物</option>
                    {CROP_OPTIONS.map(opt=> <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="filter-group">
                  <label htmlFor="policy-type">政策类型</label>
                  <select id="policy-type" className="policy-select" value={ptype} onChange={(e)=>setPtype(e.target.value)}>
                    <option value="" disabled>选择类型</option>
                    {POLICY_TYPES.map(opt=> <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              <div className="policy-filter-right" style={{ flex: 1 }}>
                <div className="input-with-icon" style={{ flex: 1 }}>
                  <input id="policy-keyword" type="text" className="policy-select" placeholder="输入关键词" value={keyword} onChange={(e)=>setKeyword(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="search-results" style={{ marginTop: '12px' }}>
              <h3>当前分类：{category}</h3>
              <p>日期：{date ? (DATE_OPTIONS.find(o=>o.value===date)?.label) : '未选择'}；作物：{crop || '未选择'}；政策类型：{ptype || '未选择'}；关键词：{keyword || '未填写'}</p>
              <p style={{ color: '#666' }}>后续将根据以上筛选条件展示政策建议列表。</p>
            </div>
          </div>

          <section className="policy-reco" aria-label="为您推荐">
            <div className="policy-reco-header">
              <h3>为您推荐</h3>
              <span className="policy-reco-note">基于种植历史：{FARMER_HISTORY.join('、')}</span>
            </div>
            <div className="policy-reco-strip">
              {recommended.map(item => (
                <article key={item.id} className="policy-card">
                  <div className="policy-card-title">{item.title}</div>
                  <div className="policy-card-meta">{item.crop}｜{item.type}｜{item.date}｜{item.source}</div>
                  <div className="policy-card-summary">{item.summary}</div>
                  {FARMER_HISTORY.includes(item.crop) && (
                    <div className="policy-card-tags"><span className="tag">推荐</span></div>
                  )}
                </article>
              ))}
              {recommended.length === 0 && (
                <div className="search-results" style={{ marginTop: '8px' }}>
                  <p style={{ color: '#666' }}>暂无推荐，调整筛选条件试试看。</p>
                </div>
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

export default PolicyAdvice;