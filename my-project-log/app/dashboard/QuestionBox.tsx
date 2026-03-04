"use client";

import { useState, useRef } from 'react';
import { MessageSquare, X, Loader2, Send, Filter, Plus, Trash2, Sparkles, GripVertical } from 'lucide-react';

interface SelectedItem {
  id: string;
  title: string;
  category: string;
  time: string;
  intro?: string;
}

interface QueryResult {
  question: string;
  scope: string;
  matchedCount: number;
  results: any[];
  analysis: string | null;
  sources: { title: string; category: string; time: string }[];
}

interface QuestionBoxProps {
  domesticData?: any[];
  crisisData?: any[];
  financeData?: any[];
  githubData?: any[];
}

export default function QuestionBox({
  domesticData = [],
  crisisData = [],
  financeData = [],
  githubData = []
}: QuestionBoxProps) {
  const [question, setQuestion] = useState('');
  const [scope, setScope] = useState('all');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const [selectorTab, setSelectorTab] = useState<'domestic' | 'crisis' | 'finance' | 'github'>('domestic');
  const [isDragOver, setIsDragOver] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const scopeOptions = [
    { value: 'all', label: '全部', color: 'blue' },
    { value: 'domestic', label: '国内政务', color: 'red' },
    { value: 'crisis', label: '地缘冲突', color: 'orange' },
    { value: 'finance', label: '金融宏观', color: 'green' },
    { value: 'github', label: 'GitHub', color: 'purple' },
  ];

  const getCurrentTabData = () => {
    switch (selectorTab) {
      case 'domestic': return domesticData;
      case 'crisis': return crisisData;
      case 'finance': return financeData;
      case 'github': return githubData;
      default: return [];
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'domestic': return '国内政务';
      case 'crisis': return '地缘冲突';
      case 'finance': return '金融宏观';
      case 'github': return 'GitHub';
      default: return tab;
    }
  };

  const addSelectedItem = (item: any, category: string) => {
    const title = item.title || item.name || '';
    if (!title) return;

    const newItem: SelectedItem = {
      id: `${category}-${Date.now()}`,
      title,
      category,
      time: item.time || '',
      intro: item.intro || item.desc || ''
    };

    if (!selectedItems.find(i => i.title === newItem.title)) {
      setSelectedItems([...selectedItems, newItem]);
    }
    setShowSelector(false);
  };

  const removeSelectedItem = (id: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  const clearAllItems = () => {
    setSelectedItems([]);
  };

  // 拖放处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const dragData = e.dataTransfer.getData('application/json');
      if (dragData) {
        const item = JSON.parse(dragData);
        addSelectedItem(item, item.category);
      }
    } catch (err) {
      console.error('拖放数据解析失败:', err);
    }
  };

  // 使用button点击提交，而不是form
  const handleSubmit = () => {
    if ((!question.trim() && selectedItems.length === 0) || loading) return;

    setLoading(true);
    setError('');

    const queryText = question.trim();

    // 如果有选中的情报，直接发送详情给后端分析
    if (selectedItems.length > 0) {
      const selectedContext = selectedItems.map(item =>
        `${item.title}${item.intro ? '：' + item.intro : ''}`
      ).join('\n');

      const finalQuestion = queryText || '请分析这些情报';

      console.log('Submitting selected items for analysis:', finalQuestion);

      fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: finalQuestion,
          scope: 'all',
          selectedContext: selectedContext,
          selectedItems: selectedItems.map(item => ({
            title: item.title,
            category: item.category,
            time: item.time
          }))
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log('Response data:', data);
        if (data.status === 'success') {
          setResult(data.data);
        } else {
          setError(data.message || '查询失败');
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('网络连接错误: ' + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      // 没有选中情报，使用关键词搜索
      const finalQuestion = queryText || '分析当前情报';

      console.log('Submitting query:', finalQuestion);

      fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: finalQuestion,
          scope: scope
        })
      })
      .then(res => {
        console.log('Response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('Response data:', data);
        if (data.status === 'success') {
          setResult(data.data);
        } else {
          setError(data.message || '查询失败');
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('网络连接错误: ' + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  };

  const currentTabData = getCurrentTabData();

  return (
    <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-full">
      {/* 头部 */}
      <div className="p-3 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
        <h3 className="text-white font-bold flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          智能情报问答
        </h3>
      </div>

      {/* 内容 */}
      <div className="p-3 flex-1 overflow-y-auto">
        {/* 选中内容区域 */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              已选情报 ({selectedItems.length})
            </span>
            {selectedItems.length > 0 && (
              <button onClick={clearAllItems} className="text-xs text-red-400 flex items-center gap-1">
                <Trash2 className="w-3 h-3" /> 清空
              </button>
            )}
          </div>

          {selectedItems.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex items-center gap-1 px-2 py-1 bg-zinc-800/50 border border-zinc-700 rounded text-xs">
                  <GripVertical className="w-3 h-3 text-zinc-600 cursor-grab" />
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    item.category === 'domestic' ? 'bg-red-500' :
                    item.category === 'crisis' ? 'bg-orange-500' :
                    item.category === 'finance' ? 'bg-green-500' : 'bg-purple-500'
                  }`} />
                  <span className="text-zinc-300 max-w-[100px] truncate">{item.title}</span>
                  <button onClick={() => removeSelectedItem(item.id)} className="text-zinc-500 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 拖放区域 */}
          <div
            ref={dropRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => setShowSelector(!showSelector)}
            className={`w-full py-3 border border-dashed rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer transition-all ${
              isDragOver
                ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                : 'border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600'
            }`}
          >
            {isDragOver ? (
              <>
                <Plus className="w-3 h-3" />
                松开添加到问答
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" />
                拖拽情报到此处或点击添加
              </>
            )}
          </div>

          {showSelector && (
            <div className="mt-2 border border-zinc-700 rounded-lg overflow-hidden">
              <div className="flex border-b border-zinc-800">
                {(['domestic', 'crisis', 'finance', 'github'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectorTab(tab)}
                    className={`flex-1 py-2 text-[10px] font-medium ${
                      selectorTab === tab
                        ? 'bg-blue-600/20 text-blue-400 border-b-2 border-blue-500'
                        : 'text-zinc-500'
                    }`}
                  >
                    {getTabLabel(tab)}
                  </button>
                ))}
              </div>
              <div className="max-h-48 overflow-y-auto p-2 space-y-1">
                {currentTabData.length === 0 ? (
                  <div className="text-xs text-zinc-600 text-center py-2">暂无数据</div>
                ) : (
                  currentTabData.map((item: any, idx: number) => {
                    const title = item.title || item.name || '';
                    const isSelected = selectedItems.some(s => s.title === title);
                    return (
                      <button
                        key={idx}
                        onClick={() => addSelectedItem(item, selectorTab)}
                        disabled={isSelected}
                        className={`w-full text-left px-2 py-1.5 text-xs rounded truncate ${
                          isSelected
                            ? 'bg-blue-500/20 text-blue-400 opacity-50'
                            : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                        {title}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* 输入框区域 */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={selectedItems.length > 0 ? "对选中内容提问" : "输入问题..."}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 pr-10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 bg-blue-600 rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
            </button>
          </div>

          {selectedItems.length === 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-zinc-500">查询范围:</span>
              <div className="flex gap-1">
                {scopeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setScope(opt.value)}
                    className={`px-2 py-1 text-xs rounded ${
                      scope === opt.value
                        ? opt.color === 'blue' ? 'bg-blue-600 text-white' :
                          opt.color === 'red' ? 'bg-red-600 text-white' :
                          opt.color === 'orange' ? 'bg-orange-600 text-white' :
                          opt.color === 'green' ? 'bg-green-600 text-white' : 'bg-purple-600 text-white'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        {/* 结果展示 */}
        {result && (
          <div className="space-y-4">
            {result.analysis && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-bold text-blue-400">智能分析</span>
                </div>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{result.analysis}</p>
              </div>
            )}

            {result.results && result.results.length > 0 && (
              <div>
                <div className="text-xs font-mono text-zinc-500 mb-2">相关情报 ({result.matchedCount})</div>
                <div className="space-y-2">
                  {result.results.slice(0, 8).map((item, idx) => (
                    <div key={idx} className="p-3 bg-zinc-900/30 border border-zinc-800 rounded-lg">
                      <div className="text-sm text-zinc-300">{item.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
