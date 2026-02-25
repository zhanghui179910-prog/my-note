"use client";

import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// 【修改点 1】定义你的博客内容（静态内容）
const STATIC_BLOG_POSTS: DayLog[] = [
  {
    date: "Note",
    logs: [
      {
        id: "static-1",
        time: "Final Version",
        title: "🚀 Next.js + Vercel 部署",
        content: `# 1. 环境准备与项目初始化

安装 Node.js 后，在终端输入以下命令确认环境：
\`\`\`bash
node -v
npm -v
\`\`\`

运行初始化指令创建项目模板：
\`\`\`bash
npx create-next-app@latest
\`\`\`
注：过程中弹出的选项全部直接按回车（选择 Yes）。

进入项目文件夹（必须执行，否则后续命令会报错）：
\`\`\`bash
cd my-project-log
\`\`\`

# 2. 核心开发与逻辑实现

在当前文件夹启动 VS Code：
\`\`\`bash
code .
\`\`\`

安装笔记高亮和图标组件：
\`\`\`bash
npm install react-syntax-highlighter lucide-react
\`\`\`

修改文件 app/page.tsx 写入你的逻辑代码后，启动本地预览：
\`\`\`bash
npm run dev
\`\`\`
预览地址：http://localhost:3000

# 3. 本地 Git 存档

初始化本地仓库：
\`\`\`bash
git init
\`\`\`

将修改存入本地暂存区：
\`\`\`bash
git add .
\`\`\`

提交存盘并添加备注：
\`\`\`bash
git commit -m "完成笔记系统首版"
\`\`\`

# 4. 代码同步至 GitHub

在 GitHub 网页新建仓库后，关联远程地址：
\`\`\`bash
git remote add origin https://github.com/你的用户名/my-note.git
\`\`\`

将代码推送到云端：
\`\`\`bash
git push -u origin main
\`\`\`

# 5. Vercel 自动化部署上线

1. 登录 Vercel 官网，选择 Import 你的 GitHub 仓库。
2. 授权时勾选对应的项目文件夹。
3. 关键配置：在 Root Directory 选项中，点击 Edit 并选择 my-project-log。
4. 点击 Deploy 等待上线。

# 6. 日常更新维护（三板斧）

以后修改完代码，依次执行这三行即可自动同步到线上网站：
\`\`\`bash
git add .
git commit -m "更新备注"
git push
\`\`\`
`
      }
    ]
  }
];

interface LogEntry { id: string; time: string; title: string; content: string; }
interface DayLog { date: string; logs: LogEntry[]; }

export default function Home() {
  // 【修改点 2】初始数据直接使用上面的静态内容
  const [data, setData] = useState<DayLog[]>(STATIC_BLOG_POSTS);
  const [selectedDate, setSelectedDate] = useState(STATIC_BLOG_POSTS[0].date);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [expandedIds, setExpandedIds] = useState<string[]>(["static-1"]); // 默认展开第一篇

  // 我们不再需要编辑和删除的状态，也不再需要从 localStorage 读取
  
  const toggleExpand = (id: string) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
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
        <div className="text-xl font-black italic mb-10 text-blue-400 tracking-tighter uppercase">ZHANG HUI BLOG</div>
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
            <input type="text" placeholder="🔍 搜索内容..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-5 py-3 bg-white border border-zinc-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-50 w-64 shadow-sm" />
          </div>

          {/* 【修改点 3】删掉了之前的“输入区域” div */}

          {/* 列表区域 */}
          <div className="space-y-12">
            {filteredLogs.map((log) => {
              const isExpanded = expandedIds.includes(log.id);
              return (
                <div key={log.id} className="relative pl-14 group">
                  <div className="absolute left-0 top-2 w-5 h-5 bg-white border-4 border-blue-500 rounded-full z-10 shadow-sm" />
                  <div className="absolute left-[9px] top-8 bottom-[-48px] w-[2px] bg-zinc-200 group-last:hidden" />
                  
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-mono font-black text-zinc-400">{log.time}</span>
                    {/* 【修改点 4】删掉了“编辑”和“删除”按钮 */}
                  </div>

                  <div className={`bg-white rounded-[32px] border border-zinc-100 p-8 shadow-sm relative transition-all duration-500 ${isExpanded ? 'ring-2 ring-blue-50 shadow-2xl' : 'max-h-60 overflow-hidden shadow-md'}`}>
                    <h3 className="text-2xl font-black text-zinc-800 mb-4">{log.title}</h3>
                    <div className="text-lg">
                      {renderFormattedContent(log.content)}
                    </div>
                    
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