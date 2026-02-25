"use client";

import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const APP_VERSION = "4.0"; 

interface LogEntry {
  id: string;
  time: string;
  title: string;
  content: string;
}

interface DayLog {
  date: string;
  logs: LogEntry[];
}

export default function Home() {
  const [data, setData] = useState<DayLog[]>([]);
  const [inputTitle, setInputTitle] = useState("");
  const [inputText, setInputText] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [expandedIds, setExpandedIds] = useState<string[]>([]); // 支持多选展开
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const lastVersion = localStorage.getItem('app_version');
    const saved = localStorage.getItem('my_ultimate_logs');

    if (lastVersion !== APP_VERSION || !saved) {
      const initialNotes: LogEntry[] = [
        { id: "1", time: "10:00", title: "🚀 欢迎使用笔记系统", content: "你可以点击右下角的箭头来展开或收起长内容。\n\n```javascript\nconsole.log('Hello World');\n```" }
      ];
      const welcomeData = [{ date: today, logs: initialNotes }];
      setData(welcomeData);
      setSelectedDate(today);
      localStorage.setItem('my_ultimate_logs', JSON.stringify(welcomeData));
      localStorage.setItem('app_version', APP_VERSION);
    } else {
      const parsed = JSON.parse(saved);
      setData(parsed);
      setSelectedDate(parsed[0]?.date || today);
    }
  }, []);

  useEffect(() => {
    if (data.length > 0) localStorage.setItem('my_ultimate_logs', JSON.stringify(data));
  }, [data]);

  const addLog = () => {
    if (!inputText.trim()) return;
    const now = new Date();
    const today = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEntry: LogEntry = { 
      id: Date.now().toString(), 
      time: timeString, 
      title: inputTitle || "未命名笔记", 
      content: inputText 
    };
    const newData = [...data];
    let dayIndex = newData.findIndex(d => d.date === today);
    if (dayIndex > -1) newData[dayIndex].logs.unshift(newEntry);
    else newData.unshift({ date: today, logs: [newEntry] });
    setData(newData);
    setInputText("");
    setInputTitle("");
    setSelectedDate(today);
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const renderFormattedContent = (text: string) => {
    const regex = /```(\w+)?\n([\s\S]*?)\n```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<div key={`text-${match.index}`} className="mb-2 whitespace-pre-wrap text-zinc-600 leading-relaxed">{text.substring(lastIndex, match.index)}</div>);
      }
      parts.push(
        <div key={`code-${match.index}`} className="my-4 rounded-2xl overflow-hidden shadow-sm border border-zinc-200 bg-[#1e1e1e]">
          <SyntaxHighlighter language={match[1] || 'javascript'} style={vscDarkPlus} customStyle={{ margin: 0, padding: '20px', fontSize: '14px' }}>
            {match[2]}
          </SyntaxHighlighter>
        </div>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(<div key="text-end" className="whitespace-pre-wrap text-zinc-600 leading-relaxed">{text.substring(lastIndex)}</div>);
    return parts;
  };

  const currentDayLogs = data.find(d => d.date === selectedDate)?.logs || [];
  const filteredLogs = currentDayLogs.filter(log => 
    log.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex min-h-screen bg-[#F0F2F5]">
      {/* 侧边栏 */}
      <nav className="w-64 bg-[#1E2023] p-6 text-white shrink-0 shadow-2xl z-20">
        <div className="text-xl font-black italic mb-10 text-blue-400 tracking-tighter uppercase">我的日志</div>
        <div className="space-y-2">
          {data.map(day => (
            <button key={day.date} onClick={() => setSelectedDate(day.date)} className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${selectedDate === day.date ? 'bg-blue-600 shadow-lg scale-105' : 'text-zinc-500 hover:bg-zinc-800'}`}>
              {day.date}
            </button>
          ))}
        </div>
      </nav>

      {/* 主界面 */}
      <section className="flex-grow p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h1 className="text-5xl font-black text-zinc-900 tracking-tighter">{selectedDate}</h1>
            <input type="text" placeholder="🔍 搜索笔记..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-5 py-3 bg-white border border-zinc-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-50 w-64 shadow-sm" />
          </div>

          {/* 输入区域 */}
          <div className="bg-white rounded-[32px] shadow-2xl p-8 mb-12 border border-zinc-100 ring-1 ring-black/[0.02]">
            <input type="text" placeholder="给今天一个标题..." value={inputTitle} onChange={(e) => setInputTitle(e.target.value)} className="w-full mb-4 p-4 bg-zinc-50 border-none rounded-2xl text-xl font-black focus:ring-2 focus:ring-blue-100 outline-none" />
            <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="输入笔记内容，代码用 ``` 包裹..." className="w-full h-40 p-4 bg-zinc-50 border-none rounded-2xl resize-none mb-4 text-zinc-600 outline-none leading-relaxed" />
            <div className="flex justify-end">
              <button onClick={addLog} className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-100">插入日志</button>
            </div>
          </div>

          {/* 列表区域 */}
          <div className="space-y-12">
            {filteredLogs.map((log) => {
              const isExpanded = expandedIds.includes(log.id) || editingId === log.id;
              return (
                <div key={log.id} className="relative pl-14 group">
                  <div className="absolute left-0 top-2 w-5 h-5 bg-white border-4 border-blue-500 rounded-full z-10 shadow-sm" />
                  <div className="absolute left-[9px] top-8 bottom-[-48px] w-[2px] bg-zinc-200 group-last:hidden" />
                  
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-mono font-black text-zinc-400">{log.time}</span>
                    <div className="opacity-0 group-hover:opacity-100 transition-all flex gap-4">
                      <button onClick={() => { setEditingId(log.id); setEditTitle(log.title); setEditText(log.content); }} className="text-xs font-bold text-blue-500">编辑</button>
                      <button onClick={() => setData(data.map(d => ({ ...d, logs: d.logs.filter(l => l.id !== log.id) })))} className="text-xs font-bold text-red-400">删除</button>
                    </div>
                  </div>

                  <div className={`bg-white rounded-[32px] border border-zinc-100 p-8 shadow-sm relative transition-all duration-500 ${isExpanded ? 'ring-2 ring-blue-50 shadow-2xl' : 'max-h-60 overflow-hidden shadow-md'}`}>
                    {editingId === log.id ? (
                      <div className="space-y-4">
                        <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full p-3 bg-zinc-50 font-bold border rounded-xl" />
                        <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full h-64 p-3 bg-zinc-50 border rounded-xl text-sm font-mono leading-relaxed" />
                        <div className="flex justify-end gap-3">
                          <button onClick={() => setEditingId(null)} className="text-sm text-zinc-400 font-bold">取消</button>
                          <button onClick={() => {
                            setData(data.map(d => ({ ...d, logs: d.logs.map(l => l.id === editingId ? { ...l, title: editTitle, content: editText } : l) })));
                            setEditingId(null);
                          }} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg">确认保存</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-2xl font-black text-zinc-800 mb-4">{log.title}</h3>
                        <div className="text-lg">
                          {renderFormattedContent(log.content)}
                        </div>
                        
                        {/* 折叠/展开 遮罩与按钮 */}
                        {!isExpanded && (
                          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-4">
                            <button onClick={() => toggleExpand(log.id)} className="flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-black hover:bg-blue-100 transition-colors">
                              展开全文 <span className="text-lg">↓</span>
                            </button>
                          </div>
                        )}
                        
                        {isExpanded && log.content.length > 200 && (
                          <div className="mt-8 flex justify-center border-t border-zinc-50 pt-4">
                            <button onClick={() => toggleExpand(log.id)} className="flex items-center gap-2 px-6 py-2 text-zinc-400 text-sm font-bold hover:text-blue-500 transition-colors">
                              收起内容 <span>↑</span>
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}