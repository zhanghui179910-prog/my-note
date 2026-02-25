"use client";

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// 【核心逻辑】保持静态数据不变
const STATIC_BLOG_POSTS = [
  {
    date: " Next.js + Vercel 部署",
    logs: [
      {
        id: "deployment-guide",
        time: "12:00",
        title: " Next.js + Vercel 部署",
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

进入项目文件夹（关键步，否则会报错找不到 package.json）：
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

将修改存入本地暂存区（注意空格）：
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

export default function Home() {
  const [data] = useState(STATIC_BLOG_POSTS);
  const [selectedDate, setSelectedDate] = useState(STATIC_BLOG_POSTS[0].date);
  const [expandedIds, setExpandedIds] = useState<string[]>(["deployment-guide"]);

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
        parts.push(<div key={`text-${match.index}`} className="mb-2 whitespace-pre-wrap text-zinc-600 leading-relaxed text-base">{text.substring(lastIndex, match.index)}</div>);
      }
      parts.push(
        <div key={`code-${match.index}`} className="my-4 rounded-xl overflow-hidden shadow-sm border border-zinc-200 bg-[#1e1e1e]">
          <SyntaxHighlighter 
            language={match[1] || 'javascript'} 
            style={vscDarkPlus} 
            customStyle={{ margin: 0, padding: '16px', fontSize: '13px', overflowX: 'auto' }}
          >
            {match[2]}
          </SyntaxHighlighter>
        </div>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(<div key="text-end" className="whitespace-pre-wrap text-zinc-600 leading-relaxed text-base">{text.substring(lastIndex)}</div>);
    return parts;
  };

  const currentLogs = data.find(d => d.date === selectedDate)?.logs || [];

  return (
    // 修改点：使用 flex-col (手机) 和 flex-row (桌面) 适配
    <main className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
      
      {/* 侧边栏修改：手机端变为顶部水平滑动，桌面端维持左侧 */}
      <nav className="w-full md:w-60 bg-[#1A1C1E] p-4 md:p-6 text-white shrink-0 shadow-xl z-30">
        <div className="text-lg font-black text-blue-400 mb-4 md:mb-8 tracking-wider uppercase">ZH BLOG</div>
        <div className="flex md:block space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {data.map(day => (
            <button 
              key={day.date} 
              onClick={() => setSelectedDate(day.date)} 
              className={`whitespace-nowrap md:whitespace-normal w-auto md:w-full text-left px-4 py-2.5 md:py-3 rounded-xl text-xs font-bold transition-all ${selectedDate === day.date ? 'bg-blue-600 shadow-md' : 'text-zinc-500 hover:bg-zinc-800'}`}
            >
              {day.date}
            </button>
          ))}
        </div>
      </nav>

      {/* 内容区修改：调整 padding 适配手机端 */}
      <section className="flex-grow p-4 md:p-10 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 mb-6 md:mb-10 tracking-tight">{selectedDate}</h1>

          <div className="space-y-8 md:space-y-10">
            {currentLogs.map((log) => {
              const isExpanded = expandedIds.includes(log.id);
              return (
                <div key={log.id} className="relative pl-6 md:pl-10">
                  <div className="absolute left-0 top-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full" />
                  <div className="absolute left-[4px] md:left-[5px] top-6 bottom-[-32px] md:bottom-[-40px] w-[1px] bg-zinc-200 last:hidden" />
                  
                  <div className="mb-3">
                    <span className="text-[10px] md:text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">{log.time}</span>
                  </div>

                  <div className={`bg-white rounded-2xl md:rounded-3xl border border-zinc-100 p-5 md:p-8 shadow-sm transition-all duration-300 ${isExpanded ? 'ring-1 ring-zinc-200 shadow-xl' : 'max-h-48 overflow-hidden shadow-sm'}`}>
                    <h3 className="text-lg md:text-xl font-bold text-zinc-800 mb-4 md:mb-6">{log.title}</h3>
                    <div className="content-render">
                      {renderFormattedContent(log.content)}
                    </div>
                    
                    {/* 修改点：优化展开按钮，并增加收回按钮 */}
                    {!isExpanded ? (
                      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent flex items-end justify-center pb-4">
                        <button onClick={() => toggleExpand(log.id)} className="px-6 py-2 bg-zinc-900 text-white rounded-full text-[10px] md:text-xs font-bold hover:bg-blue-600 transition-colors shadow-lg">
                          展开内容 ↓
                        </button>
                      </div>
                    ) : (
                      <div className="mt-6 flex justify-center border-t border-zinc-50 pt-4">
                        <button onClick={() => toggleExpand(log.id)} className="text-[10px] md:text-xs font-bold text-zinc-400 hover:text-blue-500 transition-colors">
                          收起内容 ↑
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