"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Activity, ShieldAlert, Globe as GlobeIcon, Cpu, TrendingUp, Zap, AlertTriangle, ChevronRight, CheckCircle2, LineChart, ChevronDown, ExternalLink, MessageSquare } from 'lucide-react';

// 动态导入 echarts-for-react 避免 Turbopack 兼容性问题
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

// 动态导入 3D 地球组件
const GlobeViewer = dynamic(() => import('./Globe'), { ssr: false });

// 导入提问框组件
import QuestionBox from './QuestionBox';

export default function DashboardV4() {
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [echartsReady, setEchartsReady] = useState(false);

  // 展开/收起状态 - 控制每个板块显示多少条
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    domestic: false,
    crisis: false,
    finance: false,
    github: false
  });

  // 板块整体显示/隐藏状态
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({
    domestic: true,
    crisis: true,
    finance: true,
    github: true
  });

  // 每条新闻的展开状态
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // 左侧面板 Tab 状态: 'analysis' | 'query' | 'globe'
  const [activeTab, setActiveTab] = useState<'analysis' | 'query' | 'globe'>('analysis');

  // 显示的Tab
  const displayTab = activeTab;

  // 客户端加载后启用 ECharts
  useEffect(() => {
    setEchartsReady(true);
  }, []);

  const startAnalysis = async () => {
    setLoading(true);
    try {
      const [resCurrent, resHistory] = await Promise.all([
        fetch('http://localhost:3005/api/intelligence'),
        fetch('http://localhost:3005/api/history')
      ]);

      const currentResult = await resCurrent.json();
      const historyResult = await resHistory.json();

      if(currentResult.status === 'success') setData(currentResult.data);
      if(historyResult.status === 'success') setHistory(historyResult.data);

    } catch (e) {
      console.error("数据链路连接失败");
    } finally {
      setLoading(false);
    }
  };

  // 切换板块展开/收起（显示更多/更少）
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // 切换板块整体显示/隐藏
  const toggleSectionVisibility = (section: string) => {
    setSectionVisibility(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // 切换单条新闻展开/收起
  const toggleItem = (key: string) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 获取情感标签颜色
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400 bg-green-500/10';
      case 'negative': return 'text-red-400 bg-red-500/10';
      default: return 'text-yellow-400 bg-yellow-500/10';
    }
  };

  // 获取情感标签文字
  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '积极';
      case 'negative': return '负面';
      default: return '中性';
    }
  };

  // 渲染情报卡片
  const renderNewsCard = (item: any, index: number, section: string) => {
    const itemKey = `${section}-${index}`;
    const isExpanded = expandedItems[itemKey] || false;

    return (
      <div key={index} className="border-b border-zinc-800/50 last:border-0">
        <div
          className="flex gap-3 py-3 group cursor-pointer hover:bg-zinc-800/30 -mx-2 px-2 rounded transition-colors"
          onClick={() => toggleItem(itemKey)}
        >
          <span className="text-zinc-600 font-mono text-xs flex-shrink-0 mt-0.5">{item.time}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-zinc-300 leading-snug group-hover:text-white transition-colors">
              {item.title}
            </div>
            {/* 简短来源和情感显示 */}
            <div className="flex items-center gap-2 mt-1">
              {item.source && (
                <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  {item.source}
                </span>
              )}
              {item.sentiment && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${getSentimentColor(item.sentiment)}`}>
                  {getSentimentLabel(item.sentiment)}
                </span>
              )}
              <ChevronDown className={`w-3 h-3 text-zinc-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>

        {/* 展开后的详细信息 */}
        {isExpanded && (
          <div className="ml-8 mb-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
            {/* 分析结果 */}
            {item.analysis && (
              <div className="flex items-start gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-zinc-500 mb-0.5">智能分析</div>
                  <div className="text-xs text-zinc-300">{item.analysis}</div>
                </div>
              </div>
            )}

            {/* 简介/摘要 */}
            {item.intro && (
              <div className="text-xs text-zinc-500 mb-2 pl-6 border-l-2 border-zinc-700">
                {item.intro}
              </div>
            )}

            {/* 原文链接 */}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 ml-6"
                onClick={(e) => e.stopPropagation()}
              >
                查看原文 <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  // 渲染 GitHub 卡片
  const renderGithubCard = (item: any, index: number) => {
    const itemKey = `github-${index}`;
    const isExpanded = expandedItems[itemKey] || false;

    return (
      <div key={index} className="border-b border-zinc-800/50 last:border-0">
        <div
          className="py-3 group cursor-pointer hover:bg-zinc-800/30 -mx-2 px-2 rounded transition-colors"
          onClick={() => toggleItem(itemKey)}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-blue-400 truncate">{item.name}</span>
            <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded flex-shrink-0">{item.lang}</span>
            <ChevronDown className={`w-3 h-3 text-zinc-600 transition-transform ml-auto ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
          <div className="text-xs text-zinc-500 line-clamp-1">{item.desc}</div>
        </div>

        {isExpanded && item.url && (
          <div className="ml-2 mb-2">
            <a
              href={`https://github.com/${item.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
              onClick={(e) => e.stopPropagation()}
            >
              查看项目 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    );
  };

  // 📊 ECharts 发光折线图配置
  const getChartOption = () => {
    const xAxisData = history.map(item => {
      const d = new Date(item.timestamp);
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    });
    const seriesData = history.map(item => item.risk_index);

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#3b82f6',
        textStyle: { color: '#fff', fontFamily: 'monospace' }
      },
      grid: { left: '3%', right: '4%', bottom: '5%', top: '10%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
        axisLine: { lineStyle: { color: '#333' } },
        axisLabel: { color: '#666', fontFamily: 'monospace', fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        max: 100,
        splitLine: { lineStyle: { color: '#111', type: 'dashed' } },
        axisLabel: { color: '#666', fontFamily: 'monospace' }
      },
      series: [
        {
          name: 'RISK INDEX',
          type: 'line',
          data: seriesData,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            color: '#3b82f6',
            width: 3,
            shadowColor: 'rgba(59, 130, 246, 0.8)',
            shadowBlur: 10
          },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0)' }
              ]
            }
          }
        }
      ]
    };
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center text-blue-500 font-mono tracking-widest">
      <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-6"></div>
      <p className="animate-pulse">INITIALIZING SECURE DATA STREAMS...</p>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6 text-center">
      <Activity className="w-20 h-20 text-blue-500/80 mb-6" />
      <h1 className="text-4xl font-black text-white tracking-tighter mb-2">TACTICAL COMMAND CENTER</h1>
      <p className="text-zinc-500 font-mono text-sm mb-10">V4.1 INTELLIGENCE GRID | STANDBY</p>
      <button onClick={startAnalysis} className="group relative px-8 py-4 bg-blue-600 text-white font-bold tracking-widest uppercase overflow-hidden rounded">
        <div className="absolute inset-0 w-full h-full bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        <span className="relative flex items-center gap-2">EXECUTE SCAN <ChevronRight className="w-4 h-4" /></span>
      </button>
    </div>
  );

  const riskColor = data.ai.risk_index > 75 ? 'text-red-500' : data.ai.risk_index > 45 ? 'text-yellow-500' : 'text-green-500';
  const riskBorder = data.ai.risk_index > 75 ? 'border-red-500/30' : data.ai.risk_index > 45 ? 'border-yellow-500/30' : 'border-green-500/30';

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-6 xl:p-10 font-sans">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <header className="flex justify-between items-end mb-8 pb-4 border-b border-zinc-800">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
              <Zap className="text-blue-500 w-6 h-6 fill-blue-500" />
              TACTICAL COMMAND CENTER
            </h1>
            <div className="text-xs text-zinc-500 font-mono mt-1 ml-9">SYSTEM V4.1 | LIVE SENSOR FEED</div>
          </div>
          <button onClick={startAnalysis} className="text-xs font-mono font-bold text-blue-400 border border-blue-900 px-4 py-2 hover:bg-blue-900/30 transition-colors">
            REFRESH DATA
          </button>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* 左侧：AI 战略核 + 历史趋势图 (跨度 4 列) */}
          <div className={`col-span-1 lg:col-span-4 bg-[#0a0a0a] border ${riskBorder} rounded-xl flex flex-col relative overflow-hidden`}>
            <div className={`absolute top-0 left-0 w-full h-1 ${data.ai.risk_index > 75 ? 'bg-red-500' : 'bg-blue-500'}`}></div>

            {/* Tab 切换按钮 */}
            <div className="flex border-b border-zinc-800 relative">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`flex-1 py-3 text-xs font-bold tracking-wider transition-colors ${
                  displayTab === 'analysis'
                    ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                情报分析
              </button>
              <button
                onClick={() => setActiveTab('query')}
                className={`flex-1 py-3 text-xs font-bold tracking-wider transition-colors ${
                  displayTab === 'query'
                    ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                智能问答
              </button>
              <button
                onClick={() => setActiveTab('globe')}
                className={`flex-1 py-3 text-xs font-bold tracking-wider transition-colors ${
                  displayTab === 'globe'
                    ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                3D 地球
              </button>
            </div>

            {/* Tab 内容区域 */}
            <div className="flex-1 overflow-hidden">
              {displayTab === 'analysis' && (
                <>
                  <div className="p-6 pb-2">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-zinc-500 text-xs font-black tracking-widest mb-1">GLOBAL RISK INDEX</h2>
                        <div className={`text-6xl font-black ${riskColor} tracking-tighter`}>{data.ai.risk_index}</div>
                      </div>
                      <div className="text-right">
                        <h2 className="text-zinc-500 text-xs font-black tracking-widest mb-1">THREAT LEVEL</h2>
                        <div className={`text-xl font-black ${riskColor}`}>{data.ai.risk_level}</div>
                      </div>
                    </div>
                  </div>

                  {/* 📈 动态趋势图表区 */}
                  {history.length > 1 && echartsReady ? (
                    <div className="h-32 w-full px-2 border-b border-zinc-800/50">
                      <ReactECharts option={getChartOption()} style={{ height: '100%', width: '100%' }} />
                    </div>
                  ) : (
                    <div className="h-32 w-full flex items-center justify-center border-b border-zinc-800/50 text-zinc-700 text-xs font-mono">
                      <LineChart className="w-4 h-4 mr-2" /> ACCUMULATING TREND DATA...
                    </div>
                  )}

                  <div className="p-6 pt-4 flex-grow flex flex-col overflow-y-auto">
                    <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-blue-500" /> DEEPSEEK 推演简报
                    </h3>
                    <div className="text-zinc-400 text-sm leading-relaxed mb-6 flex-grow">
                      {data.ai.summary}
                    </div>

                    <h3 className="text-white text-sm font-bold mb-3 border-b border-zinc-800 pb-2">战术决策建议</h3>
                    <ul className="space-y-3">
                      {data.ai.actions?.map((action: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-blue-300/80">
                          <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {displayTab === 'query' && (
                <div className="h-full overflow-y-auto p-3">
                  <QuestionBox
                    domesticData={data.domestic || []}
                    crisisData={data.crisis || []}
                    financeData={data.finance || []}
                    githubData={data.github || []}
                  />
                </div>
              )}

              {displayTab === 'globe' && (
                <div className="h-full" style={{ zIndex: 1, position: 'relative' }}>
                  <GlobeViewer crisisData={data.crisis || []} />
                </div>
              )}
            </div>
          </div>

          {/* 右侧：四大情报矩阵 (跨度 8 列) */}
          <div className="col-span-1 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* 1. 国内政务 */}
            <div className={`bg-[#0a0a0a] border border-zinc-800/80 rounded-xl p-5 flex flex-col transition-all duration-300 ${sectionVisibility.domestic ? 'max-h-[500px]' : 'h-auto min-h-[60px]'} ${!sectionVisibility.domestic ? 'opacity-50' : ''}`}>
              <div className={`flex items-center justify-between ${sectionVisibility.domestic ? 'mb-4' : 'mb-0'}`}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSectionVisibility('domestic')}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-800 transition-colors"
                    title={sectionVisibility.domestic ? '收起板块' : '展开板块'}
                  >
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${sectionVisibility.domestic ? '' : '-rotate-90'}`} />
                  </button>
                  <h3 className="text-white font-bold flex items-center gap-2 text-sm">
                    <ShieldAlert className="w-4 h-4 text-red-500" /> 国内高层政务与政策
                  </h3>
                </div>
                <button
                  onClick={() => toggleSection('domestic')}
                  className="text-xs text-zinc-500 hover:text-white flex items-center gap-1"
                >
                  {expandedSections.domestic ? '收起' : `展开全部(${data.domestic.length})`}
                  <ChevronDown className={`w-3 h-3 transition-transform ${expandedSections.domestic ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {sectionVisibility.domestic && (
                <div className="flex-1 overflow-y-auto space-y-0">
                  {data.domestic.slice(0, expandedSections.domestic ? data.domestic.length : 6).map((item: any, i: number) =>
                    renderNewsCard(item, i, 'domestic')
                  )}
                  {data.domestic.length > 6 && !expandedSections.domestic && (
                    <button
                      onClick={() => toggleSection('domestic')}
                      className="w-full text-center text-xs text-blue-400 py-2 hover:text-blue-300"
                    >
                      点击展开更多 ({data.domestic.length - 6} 条)
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 2. 国际冲突 */}
            <div className={`bg-[#0a0a0a] border border-zinc-800/80 rounded-xl p-5 flex flex-col relative overflow-hidden transition-all duration-300 ${sectionVisibility.crisis ? 'max-h-[500px]' : 'h-auto min-h-[60px]'} ${!sectionVisibility.crisis ? 'opacity-50' : ''}`}>
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-bl-full"></div>
              <div className={`flex items-center justify-between ${sectionVisibility.crisis ? 'mb-4' : 'mb-0'}`}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSectionVisibility('crisis')}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-800 transition-colors"
                    title={sectionVisibility.crisis ? '收起板块' : '展开板块'}
                  >
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${sectionVisibility.crisis ? '' : '-rotate-90'}`} />
                  </button>
                  <h3 className="text-white font-bold flex items-center gap-2 text-sm">
                    <GlobeIcon className="w-4 h-4 text-red-500 animate-pulse" /> 地缘高危与军事动态
                  </h3>
                </div>
                <button
                  onClick={() => toggleSection('crisis')}
                  className="text-xs text-zinc-500 hover:text-white flex items-center gap-1"
                >
                  {expandedSections.crisis ? '收起' : `展开全部(${data.crisis.length})`}
                  <ChevronDown className={`w-3 h-3 transition-transform ${expandedSections.crisis ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {sectionVisibility.crisis && (
                <div className="flex-1 overflow-y-auto space-y-0">
                  {data.crisis.slice(0, expandedSections.crisis ? data.crisis.length : 6).map((item: any, i: number) =>
                    renderNewsCard(item, i, 'crisis')
                  )}
                  {data.crisis.length > 6 && !expandedSections.crisis && (
                    <button
                      onClick={() => toggleSection('crisis')}
                      className="w-full text-center text-xs text-blue-400 py-2 hover:text-blue-300"
                    >
                      点击展开更多 ({data.crisis.length - 6} 条)
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 3. 金融宏观 */}
            <div className={`bg-[#0a0a0a] border border-zinc-800/80 rounded-xl p-5 flex flex-col transition-all duration-300 ${sectionVisibility.finance ? 'max-h-[500px]' : 'h-auto min-h-[60px]'} ${!sectionVisibility.finance ? 'opacity-50' : ''}`}>
              <div className={`flex items-center justify-between ${sectionVisibility.finance ? 'mb-4' : 'mb-0'}`}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSectionVisibility('finance')}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-800 transition-colors"
                    title={sectionVisibility.finance ? '收起板块' : '展开板块'}
                  >
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${sectionVisibility.finance ? '' : '-rotate-90'}`} />
                  </button>
                  <h3 className="text-white font-bold flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" /> 宏观经济与市场焦点
                  </h3>
                </div>
                {sectionVisibility.finance && (
                <button
                  onClick={() => toggleSection('finance')}
                  className="text-xs text-zinc-500 hover:text-white flex items-center gap-1"
                >
                  {expandedSections.finance ? '收起' : `展开全部(${data.finance.length})`}
                  <ChevronDown className={`w-3 h-3 transition-transform ${expandedSections.finance ? 'rotate-180' : ''}`} />
                </button>
                )}
              </div>
              {sectionVisibility.finance && (
                <div className="flex-1 overflow-y-auto space-y-0">
                  {data.finance.slice(0, expandedSections.finance ? data.finance.length : 6).map((item: any, i: number) =>
                    renderNewsCard(item, i, 'finance')
                  )}
                  {data.finance.length > 6 && !expandedSections.finance && (
                    <button
                      onClick={() => toggleSection('finance')}
                      className="w-full text-center text-xs text-blue-400 py-2 hover:text-blue-300"
                    >
                      点击展开更多 ({data.finance.length - 6} 条)
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 4. GitHub 热门 */}
            <div className={`bg-[#0a0a0a] border border-zinc-800/80 rounded-xl p-5 flex flex-col transition-all duration-300 ${sectionVisibility.github ? 'max-h-[500px]' : 'h-auto min-h-[60px]'} ${!sectionVisibility.github ? 'opacity-50' : ''}`}>
              <div className={`flex items-center justify-between ${sectionVisibility.github ? 'mb-4' : 'mb-0'}`}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSectionVisibility('github')}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-800 transition-colors"
                    title={sectionVisibility.github ? '收起板块' : '展开板块'}
                  >
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${sectionVisibility.github ? '' : '-rotate-90'}`} />
                  </button>
                  <h3 className="text-white font-bold flex items-center gap-2 text-sm">
                    <Cpu className="w-4 h-4 text-purple-500" /> GitHub 活跃硬核项目
                  </h3>
                </div>
                {sectionVisibility.github && (
                <button
                  onClick={() => toggleSection('github')}
                  className="text-xs text-zinc-500 hover:text-white flex items-center gap-1"
                >
                  {expandedSections.github ? '收起' : `展开全部(${data.github.length})`}
                  <ChevronDown className={`w-3 h-3 transition-transform ${expandedSections.github ? 'rotate-180' : ''}`} />
                </button>
                )}
              </div>
              {sectionVisibility.github && (
                <div className="flex-1 overflow-y-auto space-y-0">
                  {data.github.slice(0, expandedSections.github ? data.github.length : 5).map((item: any, i: number) =>
                    renderGithubCard(item, i)
                  )}
                  {data.github.length > 5 && !expandedSections.github && (
                    <button
                      onClick={() => toggleSection('github')}
                      className="w-full text-center text-xs text-blue-400 py-2 hover:text-blue-300"
                    >
                      点击展开更多 ({data.github.length - 5} 条)
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}