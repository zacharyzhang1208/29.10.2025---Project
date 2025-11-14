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
  { id: 'p7', title: '畜牧业绿色养殖标准完善', crop: '畜牧业', type: '监管', date: '2025-10-25', source: '生态环境部', summary: '完善养殖排放标准与监测机制，推进粪污资源化利用。' },
  { id: 'p8', title: '经济作物保供稳价工作通知', crop: '经济作物', type: '价格支持', date: '2025-10-18', source: '国家发改委', summary: '完善保供机制，提升应急调度能力，稳定价格预期。' },
  { id: 'p9', title: '农机购置补贴目录更新', crop: '全部', type: '补贴', date: '2025-10-08', source: '农业农村部', summary: '新增高效低耗农机设备目录，提升补贴覆盖面与便利度。' },
];

function PolicyAdvice() {
  const [category, setCategory] = useState(POLICY_CATEGORIES[0]);
  const [date, setDate] = useState('');
  const [crop, setCrop] = useState('');
  const [ptype, setPtype] = useState('');
  const [keyword, setKeyword] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const recommended = useMemo(() => {
    let list = MOCK_POLICIES.filter(p => FARMER_HISTORY.includes(p.crop));
    if (crop) list = list.filter(p => p.crop === crop);
    if (ptype) list = list.filter(p => p.type === ptype);
    if (keyword) list = list.filter(p => (p.title + p.summary + p.source).includes(keyword));
    return list.slice(0, 6);
  }, [crop, ptype, keyword]);

  const latest = useMemo(() => {
    return [...MOCK_POLICIES]
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, 6);
  }, []);

  const openDetail = (item) => { setSelectedPolicy(item); setDetailOpen(true); };
  const closeDetail = () => { setDetailOpen(false); setSelectedPolicy(null); };

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
                  <div className="policy-card-actions">
                    <button className="policy-btn" onClick={() => openDetail(item)}>显示详情</button>
                  </div>
                </article>
              ))}
              {recommended.length === 0 && (
                <div className="search-results" style={{ marginTop: '8px' }}>
                  <p style={{ color: '#666' }}>暂无推荐，调整筛选条件试试看。</p>
                </div>
              )}
            </div>
          </section>

          <section className="policy-latest" aria-label="最新政策">
            <div className="policy-latest-header">
              <h3>最新政策</h3>
              <span className="policy-latest-note">实时更新</span>
            </div>
            <div className="policy-latest-list">
              {latest.map(item => (
                <div key={item.id} className="latest-item">
                  <div className="latest-title">{item.title}</div>
                  <div className="latest-meta">{item.crop}｜{item.type}｜{item.date}｜{item.source}</div>
                  <div className="latest-summary">{item.summary}</div>
                  <div className="latest-actions">
                    <button className="policy-btn policy-btn-outline" onClick={() => openDetail(item)}>显示详情</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
        {detailOpen && (
          <div className="policy-modal-overlay" onClick={closeDetail}>
            <div className="policy-modal" role="dialog" aria-modal="true" onClick={(e)=>e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">{selectedPolicy?.title}</div>
                <button className="modal-close" onClick={closeDetail}>×</button>
              </div>
              <div className="modal-meta">{selectedPolicy?.crop}｜{selectedPolicy?.type}｜{selectedPolicy?.date}｜{selectedPolicy?.source}</div>
              <div className="modal-content">
                <div className="modal-section section-points">
                  <ul className="points-list">
                    <li>标题：{selectedPolicy?.title}</li>
                    <li>类型与作物：{selectedPolicy?.crop}、{selectedPolicy?.type}</li>
                    <li>发布与时间：{selectedPolicy?.source}（{selectedPolicy?.date}）</li>
                    <li>摘要：{selectedPolicy?.summary}</li>
                  </ul>
                </div>
                <div className="modal-divider" />
                <div className="modal-section">
                  <div className="section-title">政策全文</div>
                  <p>正文示例：本政策围绕目标任务、适用对象、支持标准与资金来源进行明确，对申报流程、监督检查与绩效评估提出要求，确保政策精准落地与公开透明。</p>
                  <p>申请人应按属地管理原则提交材料，包括主体资格、项目方案、资金测算与风险控制等，主管部门将依据评审规则与时限安排组织审核与公示。</p>
                  <p>本条为占位文本，用于展示布局效果。实际接入时可替换为抓取或录入的政策原文。</p>
                </div>
                <div className="modal-divider" />
                <div className="modal-section">
                  <div className="section-title">政策解读</div>
                  <p>解读示例：该政策旨在兼顾市场运行与农业收益，通过优化支持工具组合提升稳定性与抗风险能力，建议相关主体关注申报时点与配套要求。</p>
                  <p>对种植结构调整与成本控制有积极作用，短期内建议结合地方细则明确标准与口径，避免材料不完整导致退回。</p>
                </div>
              </div>
              <div className="modal-footer">
                <button className="policy-btn">立即查看原文</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default PolicyAdvice;