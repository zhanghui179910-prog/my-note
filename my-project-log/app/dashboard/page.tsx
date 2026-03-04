"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Activity, ShieldAlert, Globe as GlobeIcon, Cpu, TrendingUp, Zap, AlertTriangle, ChevronRight, CheckCircle2, LineChart, ChevronDown, ExternalLink, MessageSquare, Coins, Maximize2, Minimize2, X, BarChart3 } from 'lucide-react';

// 动态导入 echarts-for-react 避免 Turbopack 兼容性问题
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

// 动态导入 3D 地球组件
const GlobeViewer = dynamic(() => import('./Globe'), { ssr: false });

// 动态导入提问框组件
const QuestionBox = dynamic(() => import('./QuestionBox'), { ssr: false });

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

  // 左侧面板折叠状态（每个卡片独立控制）
  const [leftPanelExpanded, setLeftPanelExpanded] = useState<Record<string, boolean>>({
    analysis: true,    // 情报分析默认展开
    metals: false      // 贵金属默认收起
  });

  // 情报分析内部 Tab 状态
  const [analysisTab, setAnalysisTab] = useState<'analysis' | 'query' | 'globe'>('analysis');

  // 地球全屏状态
  const [globeFullscreen, setGlobeFullscreen] = useState(false);

  // 统计卡片溯源展开状态
  const [expandedStatCard, setExpandedStatCard] = useState<string | null>(null);

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

  // 切换左侧面板卡片展开/收起
  const toggleLeftPanel = (panel: string) => {
    setLeftPanelExpanded(prev => ({ ...prev, [panel]: !prev[panel] }));
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

    const handleDragStart = (e: React.DragEvent) => {
      const dragData = {
        title: item.title,
        category: section,
        time: item.time,
        intro: item.intro,
        source: item.source,
        url: item.url
      };
      e.dataTransfer.setData('application/json', JSON.stringify(dragData));
      e.dataTransfer.effectAllowed = 'copy';
    };

    return (
      <div key={index} className="border-b border-zinc-800/50 last:border-0">
        <div
          draggable
          onDragStart={handleDragStart}
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

    const handleDragStart = (e: React.DragEvent) => {
      const dragData = {
        title: item.name,
        category: 'github',
        time: '',
        intro: item.desc,
        lang: item.lang
      };
      e.dataTransfer.setData('application/json', JSON.stringify(dragData));
      e.dataTransfer.effectAllowed = 'copy';
    };

    return (
      <div key={index} className="border-b border-zinc-800/50 last:border-0">
        <div
          draggable
          onDragStart={handleDragStart}
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
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-4 md:p-6 xl:p-10 font-sans">
      <div className="max-w-[1600px] mx-auto">

        {/* Header */}
        <header className="flex justify-between items-end mb-4 md:mb-8 pb-2 md:pb-4 border-b border-zinc-800">
          <div>
            <h1 className="text-lg md:text-2xl font-black text-white flex items-center gap-2 md:gap-3 tracking-tight">
              <Zap className="text-blue-500 w-5 h-5 md:w-6 md:h-6 fill-blue-500" />
              <span className="hidden sm:inline">TACTICAL COMMAND CENTER</span>
              <span className="sm:hidden">CMD CENTER</span>
            </h1>
            <div className="text-[10px] md:text-xs text-zinc-500 font-mono mt-1 ml-7 md:ml-9">SYSTEM V4.1 | LIVE FEED</div>
          </div>
          <button onClick={startAnalysis} className="text-[10px] md:text-xs font-mono font-bold text-blue-400 border border-blue-900 px-2 md:px-4 py-1.5 md:py-2 hover:bg-blue-900/30 transition-colors">
            <span className="hidden sm:inline">REFRESH DATA</span>
            <span className="sm:hidden">刷新</span>
          </button>
        </header>

        {/* 顶部概览统计栏 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4 md:mb-6">
          {/* 国内政务 */}
          <div
            onClick={() => setExpandedStatCard(expandedStatCard === 'domestic' ? null : 'domestic')}
            className={`bg-zinc-900/50 rounded-lg p-3 border transition-colors group cursor-pointer ${
              expandedStatCard === 'domestic' ? 'border-red-500' : 'border-zinc-800 hover:border-red-500/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-red-500" />
                  国内政务
                </div>
                <div className="text-xl md:text-2xl font-bold text-red-400 mt-1">{data.domestic?.length || 0}</div>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 md:w-5 md:h-5 text-red-500/60 group-hover:text-red-500 transition-colors" />
              </div>
            </div>
            {/* 迷你趋势图 */}
            <div className="mt-2 h-6 flex items-end gap-0.5">
              {history.slice(-8).map((h, i) => {
                const height = Math.max(4, (h.risk_index / 100) * 24);
                return (
                  <div
                    key={i}
                    className="flex-1 bg-red-500/40 rounded-sm transition-all duration-300 group-hover:bg-red-500/60"
                    style={{ height: `${height}px` }}
                  />
                );
              })}
            </div>
            <div className="text-[10px] text-zinc-600 mt-1.5 flex justify-between items-center">
              <span>{data.domestic?.filter((item: any) => item.sentiment === 'negative').length || 0} 条负面</span>
              <span className="text-red-400 flex items-center gap-0.5">
                {expandedStatCard === 'domestic' ? '收起' : '溯源'}
                <ChevronDown className={`w-3 h-3 transition-transform ${expandedStatCard === 'domestic' ? 'rotate-180' : ''}`} />
              </span>
            </div>
            {/* 溯源展开内容 */}
            {expandedStatCard === 'domestic' && (
              <div className="mt-2 pt-2 border-t border-zinc-800 space-y-1 max-h-24 overflow-y-auto">
                {data.domestic?.filter((item: any) => item.sentiment === 'negative').slice(0, 5).map((item: any, i: number) => (
                  <div key={i} className="text-[10px] text-zinc-400 truncate flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                    {item.title}
                  </div>
                )) || <div className="text-[10px] text-zinc-600">暂无负面情报</div>}
              </div>
            )}
          </div>

          {/* 地缘冲突 */}
          <div
            onClick={() => setExpandedStatCard(expandedStatCard === 'crisis' ? null : 'crisis')}
            className={`bg-zinc-900/50 rounded-lg p-3 border transition-colors group cursor-pointer ${
              expandedStatCard === 'crisis' ? 'border-orange-500' : 'border-zinc-800 hover:border-orange-500/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                  <GlobeIcon className="w-3 h-3 text-orange-500" />
                  地缘冲突
                </div>
                <div className="text-xl md:text-2xl font-bold text-orange-400 mt-1">{data.crisis?.length || 0}</div>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <GlobeIcon className="w-4 h-4 md:w-5 md:h-5 text-orange-500/60 group-hover:text-orange-500 transition-colors" />
              </div>
            </div>
            {/* 迷你趋势图 - SVG 折线 */}
            <div className="mt-2 h-6">
              <svg viewBox="0 0 80 24" className="w-full h-full">
                <polyline
                  fill="none"
                  stroke="rgba(249, 115, 22, 0.5)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={history.slice(-8).map((h, i) => {
                    const x = i * 10 + 5;
                    const y = 24 - (h.risk_index / 100) * 20;
                    return `${x},${y}`;
                  }).join(' ')}
                />
                {history.length > 0 && (
                  <circle
                    cx={Math.min(history.length - 1, 7) * 10 + 5}
                    cy={24 - (history[history.length - 1]?.risk_index || 50) / 100 * 20}
                    r="3"
                    fill="#f97316"
                  />
                )}
              </svg>
            </div>
            <div className="text-[10px] text-zinc-600 mt-1.5 flex justify-between items-center">
              <span>{data.crisis?.filter((item: any) => item.sentiment === 'negative').length || 0} 条高危</span>
              <span className="text-orange-400 flex items-center gap-0.5">
                {expandedStatCard === 'crisis' ? '收起' : '溯源'}
                <ChevronDown className={`w-3 h-3 transition-transform ${expandedStatCard === 'crisis' ? 'rotate-180' : ''}`} />
              </span>
            </div>
            {/* 溯源展开内容 */}
            {expandedStatCard === 'crisis' && (
              <div className="mt-2 pt-2 border-t border-zinc-800 space-y-1 max-h-24 overflow-y-auto">
                {data.crisis?.filter((item: any) => item.sentiment === 'negative').slice(0, 5).map((item: any, i: number) => (
                  <div key={i} className="text-[10px] text-zinc-400 truncate flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-orange-500 flex-shrink-0" />
                    {item.title}
                  </div>
                )) || <div className="text-[10px] text-zinc-600">暂无高危情报</div>}
              </div>
            )}
          </div>

          {/* 金融宏观 */}
          <div
            onClick={() => setExpandedStatCard(expandedStatCard === 'finance' ? null : 'finance')}
            className={`bg-zinc-900/50 rounded-lg p-3 border transition-colors group cursor-pointer ${
              expandedStatCard === 'finance' ? 'border-green-500' : 'border-zinc-800 hover:border-green-500/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  金融宏观
                </div>
                <div className="text-xl md:text-2xl font-bold text-green-400 mt-1">{data.finance?.length || 0}</div>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-500/60 group-hover:text-green-500 transition-colors" />
              </div>
            </div>
            {/* 迷你趋势图 - 面积图 */}
            <div className="mt-2 h-6">
              <svg viewBox="0 0 80 24" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(34, 197, 94, 0.4)" />
                    <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
                  </linearGradient>
                </defs>
                <polygon
                  fill="url(#greenGradient)"
                  points={`0,24 ${history.slice(-8).map((h, i) => {
                    const x = i * 10 + 5;
                    const y = 24 - (h.risk_index / 100) * 18;
                    return `${x},${y}`;
                  }).join(' ')} 75,24`}
                />
                <polyline
                  fill="none"
                  stroke="rgba(34, 197, 94, 0.8)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  points={history.slice(-8).map((h, i) => {
                    const x = i * 10 + 5;
                    const y = 24 - (h.risk_index / 100) * 18;
                    return `${x},${y}`;
                  }).join(' ')}
                />
              </svg>
            </div>
            <div className="text-[10px] text-zinc-600 mt-1.5 flex justify-between items-center">
              <span>{data.finance?.filter((item: any) => item.sentiment === 'positive').length || 0} 条积极</span>
              <span className="text-green-400 flex items-center gap-0.5">
                {expandedStatCard === 'finance' ? '收起' : '溯源'}
                <ChevronDown className={`w-3 h-3 transition-transform ${expandedStatCard === 'finance' ? 'rotate-180' : ''}`} />
              </span>
            </div>
            {/* 溯源展开内容 */}
            {expandedStatCard === 'finance' && (
              <div className="mt-2 pt-2 border-t border-zinc-800 space-y-1 max-h-24 overflow-y-auto">
                {data.finance?.slice(0, 5).map((item: any, i: number) => (
                  <div key={i} className="text-[10px] text-zinc-400 truncate flex items-center gap-1">
                    <span className={`w-1 h-1 rounded-full flex-shrink-0 ${item.sentiment === 'positive' ? 'bg-green-500' : item.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                    {item.title}
                  </div>
                )) || <div className="text-[10px] text-zinc-600">暂无情报</div>}
              </div>
            )}
          </div>

          {/* GitHub 热门 */}
          <div
            onClick={() => setExpandedStatCard(expandedStatCard === 'github' ? null : 'github')}
            className={`bg-zinc-900/50 rounded-lg p-3 border transition-colors group cursor-pointer ${
              expandedStatCard === 'github' ? 'border-purple-500' : 'border-zinc-800 hover:border-purple-500/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-purple-500" />
                  GitHub
                </div>
                <div className="text-xl md:text-2xl font-bold text-purple-400 mt-1">{data.github?.length || 0}</div>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Cpu className="w-4 h-4 md:w-5 md:h-5 text-purple-500/60 group-hover:text-purple-500 transition-colors" />
              </div>
            </div>
            {/* 迷你趋势图 - 点状图 */}
            <div className="mt-2 h-6 flex items-center justify-between px-1">
              {history.slice(-8).map((h, i) => {
                const size = 2 + (h.risk_index / 100) * 4;
                return (
                  <div
                    key={i}
                    className="rounded-full bg-purple-500/50 group-hover:bg-purple-500/70 transition-all"
                    style={{ width: `${size}px`, height: `${size}px` }}
                  />
                );
              })}
            </div>
            <div className="text-[10px] text-zinc-600 mt-1.5 flex justify-between items-center">
              <span>热门项目监控</span>
              <span className="text-purple-400 flex items-center gap-0.5">
                {expandedStatCard === 'github' ? '收起' : '溯源'}
                <ChevronDown className={`w-3 h-3 transition-transform ${expandedStatCard === 'github' ? 'rotate-180' : ''}`} />
              </span>
            </div>
            {/* 溯源展开内容 */}
            {expandedStatCard === 'github' && (
              <div className="mt-2 pt-2 border-t border-zinc-800 space-y-1 max-h-24 overflow-y-auto">
                {data.github?.slice(0, 5).map((item: any, i: number) => (
                  <div key={i} className="text-[10px] text-zinc-400 truncate flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-purple-500 flex-shrink-0" />
                    {item.name} - <span className="text-zinc-600">{item.lang}</span>
                  </div>
                )) || <div className="text-[10px] text-zinc-600">暂无项目</div>}
              </div>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

          {/* 左侧：折叠卡片面板 (跨度 4 列) */}
          <div className="col-span-1 lg:col-span-4 space-y-4">

            {/* 1. 情报分析卡片（含内部 Tab：分析/问答/地球） */}
            <div className={`bg-[#0a0a0a] border ${analysisTab === 'analysis' ? riskBorder : 'border-zinc-800'} rounded-xl flex flex-col relative overflow-hidden transition-all duration-300`}>
              <div className={`absolute top-0 left-0 w-full h-1 ${data.ai.risk_index > 75 ? 'bg-red-500' : 'bg-blue-500'}`}></div>
              {/* 标题栏 + 折叠按钮 */}
              <div
                className="flex items-center justify-between px-3 py-2 md:px-4 md:py-2.5 cursor-pointer border-b border-zinc-800/50"
                onClick={() => toggleLeftPanel('analysis')}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-blue-500" />
                  <h3 className="text-white font-bold text-xs">情报分析</h3>
                </div>
                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${leftPanelExpanded.analysis ? 'rotate-180' : ''}`} />
              </div>

              {leftPanelExpanded.analysis && (
                <div className="flex-1 overflow-hidden flex flex-col" style={{ maxHeight: analysisTab === 'globe' ? '650px' : '420px' }}>
                  {/* 内部 Tab 切换 - 紧凑型 */}
                  <div className="flex border-b border-zinc-800 flex-shrink-0">
                    <button
                      onClick={() => setAnalysisTab('analysis')}
                      className={`flex-1 py-1.5 text-[10px] font-medium transition-colors flex items-center justify-center gap-1 ${
                        analysisTab === 'analysis'
                          ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      分析
                    </button>
                    <button
                      onClick={() => setAnalysisTab('query')}
                      className={`flex-1 py-1.5 text-[10px] font-medium transition-colors flex items-center justify-center gap-1 ${
                        analysisTab === 'query'
                          ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-500/5'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <MessageSquare className="w-3 h-3" />
                      问答
                    </button>
                    <button
                      onClick={() => setAnalysisTab('globe')}
                      className={`flex-1 py-1.5 text-[10px] font-medium transition-colors flex items-center justify-center gap-1 ${
                        analysisTab === 'globe'
                          ? 'text-orange-400 border-b-2 border-orange-500 bg-orange-500/5'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <GlobeIcon className="w-3 h-3" />
                      地球
                    </button>
                  </div>

                  {/* Tab 内容区域 - 可滚动 */}
                  <div className="flex-1 overflow-y-auto">
                    {analysisTab === 'analysis' && (
                      <div className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h2 className="text-zinc-500 text-[9px] font-black tracking-widest mb-0.5">RISK INDEX</h2>
                            <div className={`text-2xl md:text-3xl font-black ${riskColor} tracking-tighter`}>{data.ai.risk_index}</div>
                          </div>
                          <div className="text-right">
                            <h2 className="text-zinc-500 text-[9px] font-black tracking-widest mb-0.5">LEVEL</h2>
                            <div className={`text-xs font-black ${riskColor}`}>{data.ai.risk_level}</div>
                          </div>
                        </div>

                        {/* 趋势图 - 压缩高度 */}
                        {history.length > 1 && echartsReady ? (
                          <div className="h-12 w-full px-1 border-b border-zinc-800/50 mb-2">
                            <ReactECharts option={getChartOption()} style={{ height: '100%', width: '100%' }} />
                          </div>
                        ) : (
                          <div className="h-12 w-full flex items-center justify-center border-b border-zinc-800/50 text-zinc-700 text-[9px] font-mono mb-2">
                            <LineChart className="w-3 h-3 mr-1" /> ACCUMULATING...
                          </div>
                        )}

                        <h3 className="text-white text-[10px] font-bold mb-1 flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5 text-blue-500" /> 推演简报
                        </h3>
                        <div className="text-zinc-400 text-[10px] leading-relaxed mb-2 line-clamp-3">
                          {data.ai.summary}
                        </div>
                        <h3 className="text-white text-[10px] font-bold mb-1 border-b border-zinc-800 pb-0.5">决策建议</h3>
                        <ul className="space-y-1">
                          {data.ai.actions?.slice(0, 2).map((action: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-1.5 text-[9px] text-blue-300/80">
                              <CheckCircle2 className="w-2.5 h-2.5 text-blue-500 flex-shrink-0 mt-0.5" />
                              <span className="leading-snug">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysisTab === 'query' && (
                      <div className="min-h-[350px] max-h-[400px]">
                        <QuestionBox
                          domesticData={data.domestic || []}
                          crisisData={data.crisis || []}
                          financeData={data.finance || []}
                          githubData={data.github || []}
                        />
                      </div>
                    )}

                    {analysisTab === 'globe' && (
                      <div className="relative">
                        {/* 展开/收缩按钮 */}
                        <button
                          onClick={() => setGlobeFullscreen(true)}
                          className="absolute top-2 right-2 z-20 p-1.5 bg-zinc-800/80 hover:bg-zinc-700 rounded-lg border border-zinc-700 transition-colors group"
                          title="全屏显示"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
                        </button>
                        <div className="h-[500px] w-full" style={{ zIndex: 1, position: 'relative' }}>
                          <GlobeViewer crisisData={data.crisis || []} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. 贵金属价格卡片 - 紧凑型 */}
            <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl flex flex-col relative overflow-hidden transition-all duration-300">
              <div
                className="flex items-center justify-between px-3 py-2 md:px-4 md:py-2.5 cursor-pointer border-b border-zinc-800/50"
                onClick={() => toggleLeftPanel('metals')}
              >
                <div className="flex items-center gap-2">
                  <Coins className="w-3.5 h-3.5 text-yellow-500" />
                  <h3 className="text-white font-bold text-xs">贵金属价格</h3>
                </div>
                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${leftPanelExpanded.metals ? 'rotate-180' : ''}`} />
              </div>
              {leftPanelExpanded.metals && (
                <div className="flex-1 overflow-hidden p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {data.metals?.map((metal: any, idx: number) => (
                      <div key={idx} className="bg-zinc-900/50 rounded-lg p-2 border border-zinc-800 hover:border-yellow-500/30 transition-colors">
                        <div className="text-[9px] text-zinc-500 mb-0.5">{metal.name}</div>
                        <div className="text-base font-bold text-yellow-400">¥{metal.price?.toFixed(2)}</div>
                        <div className={`text-[9px] mt-0.5 ${metal.change > 0 ? 'text-green-400' : metal.change < 0 ? 'text-red-400' : 'text-zinc-500'}`}>
                          {metal.change > 0 ? '+' : ''}{metal.change?.toFixed(2)}%
                        </div>
                      </div>
                    )) || (
                      <div className="col-span-2 text-center text-zinc-600 text-[10px] py-3">暂无贵金属数据</div>
                    )}
                  </div>
                  <div className="text-[9px] text-zinc-600 mt-2 text-right">
                    更新: {data.metals?.[0]?.time || '--:--'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：四大情报矩阵 (跨度 8 列) */}
          <div className="col-span-1 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

            {/* 1. 国内政务 */}
            <div className={`bg-[#0a0a0a] border border-zinc-800/80 rounded-xl p-4 md:p-5 flex flex-col transition-all duration-300 ${sectionVisibility.domestic ? 'max-h-[450px] md:max-h-[550px]' : 'h-auto min-h-[50px]'} ${!sectionVisibility.domestic ? 'opacity-50' : ''}`}>
              <div className={`flex items-center justify-between ${sectionVisibility.domestic ? 'mb-2 md:mb-4' : 'mb-0'}`}>
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() => toggleSectionVisibility('domestic')}
                    className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded hover:bg-zinc-800 transition-colors"
                    title={sectionVisibility.domestic ? '收起板块' : '展开板块'}
                  >
                    <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 text-zinc-500 transition-transform ${sectionVisibility.domestic ? '' : '-rotate-90'}`} />
                  </button>
                  <h3 className="text-white font-bold flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                    <ShieldAlert className="w-3 h-3 md:w-4 md:h-4 text-red-500" /> <span className="hidden sm:inline">国内高层政务与政策</span>
                    <span className="sm:hidden">国内政务</span>
                  </h3>
                </div>
                <button
                  onClick={() => toggleSection('domestic')}
                  className="text-[10px] md:text-xs text-zinc-500 hover:text-white flex items-center gap-1"
                >
                  {expandedSections.domestic ? '收起' : `${data.domestic.length}条`}
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
                      className="w-full text-center text-[10px] md:text-xs text-blue-400 py-2 hover:text-blue-300"
                    >
                      点击展开更多 ({data.domestic.length - 6} 条)
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 2. 国际冲突 */}
            <div className={`bg-[#0a0a0a] border border-zinc-800/80 rounded-xl p-4 md:p-5 flex flex-col relative overflow-hidden transition-all duration-300 ${sectionVisibility.crisis ? 'max-h-[450px] md:max-h-[550px]' : 'h-auto min-h-[50px]'} ${!sectionVisibility.crisis ? 'opacity-50' : ''}`}>
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-bl-full"></div>
              <div className={`flex items-center justify-between ${sectionVisibility.crisis ? 'mb-2 md:mb-4' : 'mb-0'}`}>
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() => toggleSectionVisibility('crisis')}
                    className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded hover:bg-zinc-800 transition-colors"
                    title={sectionVisibility.crisis ? '收起板块' : '展开板块'}
                  >
                    <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 text-zinc-500 transition-transform ${sectionVisibility.crisis ? '' : '-rotate-90'}`} />
                  </button>
                  <h3 className="text-white font-bold flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                    <GlobeIcon className="w-3 h-3 md:w-4 md:h-4 text-red-500 animate-pulse" /> <span className="hidden sm:inline">地缘高危与军事动态</span>
                    <span className="sm:hidden">地缘冲突</span>
                  </h3>
                </div>
                <button
                  onClick={() => toggleSection('crisis')}
                  className="text-[10px] md:text-xs text-zinc-500 hover:text-white flex items-center gap-1"
                >
                  {expandedSections.crisis ? '收起' : `${data.crisis.length}条`}
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
            <div className={`bg-[#0a0a0a] border border-zinc-800/80 rounded-xl p-4 md:p-5 flex flex-col transition-all duration-300 ${sectionVisibility.finance ? 'max-h-[450px] md:max-h-[550px]' : 'h-auto min-h-[50px]'} ${!sectionVisibility.finance ? 'opacity-50' : ''}`}>
              <div className={`flex items-center justify-between ${sectionVisibility.finance ? 'mb-2 md:mb-4' : 'mb-0'}`}>
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() => toggleSectionVisibility('finance')}
                    className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded hover:bg-zinc-800 transition-colors"
                    title={sectionVisibility.finance ? '收起板块' : '展开板块'}
                  >
                    <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 text-zinc-500 transition-transform ${sectionVisibility.finance ? '' : '-rotate-90'}`} />
                  </button>
                  <h3 className="text-white font-bold flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                    <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-500" /> <span className="hidden sm:inline">宏观经济与市场焦点</span>
                    <span className="sm:hidden">金融宏观</span>
                  </h3>
                </div>
                {sectionVisibility.finance && (
                <button
                  onClick={() => toggleSection('finance')}
                  className="text-[10px] md:text-xs text-zinc-500 hover:text-white flex items-center gap-1"
                >
                  {expandedSections.finance ? '收起' : `${data.finance.length}条`}
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
            <div className={`bg-[#0a0a0a] border border-zinc-800/80 rounded-xl p-4 md:p-5 flex flex-col transition-all duration-300 ${sectionVisibility.github ? 'max-h-[450px] md:max-h-[550px]' : 'h-auto min-h-[50px]'} ${!sectionVisibility.github ? 'opacity-50' : ''}`}>
              <div className={`flex items-center justify-between ${sectionVisibility.github ? 'mb-2 md:mb-4' : 'mb-0'}`}>
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() => toggleSectionVisibility('github')}
                    className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded hover:bg-zinc-800 transition-colors"
                    title={sectionVisibility.github ? '收起板块' : '展开板块'}
                  >
                    <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 text-zinc-500 transition-transform ${sectionVisibility.github ? '' : '-rotate-90'}`} />
                  </button>
                  <h3 className="text-white font-bold flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                    <Cpu className="w-3 h-3 md:w-4 md:h-4 text-purple-500" /> <span className="hidden sm:inline">GitHub 活跃硬核项目</span>
                    <span className="sm:hidden">GitHub</span>
                  </h3>
                </div>
                {sectionVisibility.github && (
                <button
                  onClick={() => toggleSection('github')}
                  className="text-[10px] md:text-xs text-zinc-500 hover:text-white flex items-center gap-1"
                >
                  {expandedSections.github ? '收起' : `${data.github.length}条`}
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

      {/* 地球全屏模态框 */}
      {globeFullscreen && (
        <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col">
          {/* 模态框头部 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-[#0a0a0a]">
            <div className="flex items-center gap-2">
              <GlobeIcon className="w-4 h-4 text-orange-500" />
              <h3 className="text-white font-bold text-sm">3D 地球 - 全球冲突热点</h3>
            </div>
            <button
              onClick={() => setGlobeFullscreen(false)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group"
              title="关闭全屏"
            >
              <Minimize2 className="w-4 h-4 text-zinc-400 group-hover:text-white" />
            </button>
          </div>
          {/* 地球内容 */}
          <div className="flex-1 w-full h-full relative">
            <GlobeViewer crisisData={data.crisis || []} />
          </div>
          {/* 底部统计面板 */}
          <div className="bg-[#0a0a0a] border-t border-zinc-800 px-6 py-4">
            <div className="flex items-center justify-between gap-6">
              {/* 左侧：地区分布统计 */}
              <div className="flex-1">
                <div className="text-xs text-zinc-500 mb-3 font-medium flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  地区分布统计
                </div>
                <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                  {(() => {
                    const regionCounts = (data.crisis || []).reduce((acc: Record<string, number>, item: any) => {
                      const regions = ['中东', '乌克兰', '俄罗斯', '美国', '朝鲜', '韩国', '台湾', '南海', '日本', '印度', '欧洲', '北约'];
                      regions.forEach(r => {
                        if (item.title?.includes(r)) {
                          acc[r] = (acc[r] || 0) + 1;
                        }
                      });
                      return acc;
                    }, {});
                    return Object.entries(regionCounts)
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .slice(0, 6)
                      .map(([region, count], idx) => {
                        const total = (data.crisis || []).length || 1;
                        const percentage = (((count as number) / total) * 100).toFixed(0);
                        const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'];
                        return (
                          <div key={region} className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${colors[idx % colors.length]}`} />
                            <span className="text-xs text-zinc-400 w-12">{region}</span>
                            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${colors[idx % colors.length]}`}
                                style={{ width: `${Math.max(10, Number(percentage))}%` }}
                              />
                            </div>
                            <span className="text-xs text-zinc-500 w-12 text-right">{count as number} ({percentage}%)</span>
                          </div>
                        );
                      });
                  })()}
                </div>
              </div>

              {/* 中间：关键指标 */}
              <div className="flex items-center gap-6 px-6 border-x border-zinc-800">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{data.crisis?.length || 0}</div>
                  <div className="text-[10px] text-zinc-500">热点事件</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {data.crisis?.filter((item: any) => item.sentiment === 'negative').length || 0}
                  </div>
                  <div className="text-[10px] text-zinc-500">高危地区</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {new Set(
                      (data.crisis || [])
                        .map((item: any) => {
                          const regions = ['中东', '乌克兰', '俄罗斯', '美国', '朝鲜', '韩国', '台湾', '南海'];
                          return regions.find((r: string) => item.title?.includes(r)) || '其他';
                        })
                        .filter((r: string) => r !== '其他')
                    ).size}
                  </div>
                  <div className="text-[10px] text-zinc-500">涉及地区</div>
                </div>
              </div>

              {/* 右侧：图例 */}
              <div className="w-48">
                <div className="text-xs text-zinc-500 mb-2 font-medium">风险等级</div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-xs text-zinc-400">负面</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-xs text-zinc-400">中性</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-zinc-400">积极</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-zinc-800">
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-0.5 bg-red-500" />
                    <span className="text-xs text-zinc-400">冲突关联线</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部操作提示 */}
            <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-center gap-6 text-[10px] text-zinc-600 font-mono">
              <span>🖱️ 拖拽旋转</span>
              <span>🔍 滚轮缩放</span>
              <span>👆 点击热点查看详情</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}