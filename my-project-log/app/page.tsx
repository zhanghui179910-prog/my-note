"use client";

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChevronRight, ChevronDown, FileText, Calendar } from 'lucide-react';

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

const STATIC_BLOG_POSTS: DayLog[] = [
  {
    date: "2026年2月26日",
    logs: [
      {
        id: "decoding-black-box",
        time: "12:30",
        title: "📂 Next.js 引入",
        content: `

 Next.js 核心运作机制：

### 🏗️ 一、 项目的“物理沙盘” (核心文件夹)
就像造房子一样，代码世界也有它的功能分区。在左侧的文件树里，它们各司其职：

\`\`\`bash
📦 my-project-log (你的项目根目录)
 ┣ 📂 app/              # 📍 绝对核心区：99% 的网页逻辑都在这里
 ┃ ┣ 📜 page.tsx        # 🚪 门面担当：用户打开网址看到的第一眼画面
 ┃ ┗ 🎨 globals.css     # 🖌️ 全局画笔：控制整个网站的底色、字体等基础审美
 ┣ 📂 node_modules/     # ⚙️ 零件黑洞：(灰色) 存放 npm 下载的所有第三方工具。因太庞大，被 Git 拉黑，不上云端。
 ┣ 📂 public/           # 🖼️ 静态仓库：存放本地图片、favicon 小图标。
 ┗ 📝 package.json      # 🧾 进货清单：记录了项目叫啥名，以及你“买”（安装）了哪些依赖包。
\`\`\`

### 🧬 二、 语言的“DNA 鉴定” (文件后缀名)
不同的后缀代表了不同的语言能力，弄懂它们，你就知道该往哪里加代码了：

\`\`\`typescript
.tsx   // 👑 王者融合：(TypeScript + XML) 允许把“逻辑控制”和“网页排版(HTML)”写在一起。
.ts    // 🛡️ 严谨护卫：(TypeScript) 严谨版 JS，自带防错机制，专门写纯逻辑。
.css   // 👗 纯粹美学：(Cascading Style Sheets) 纯粹的化妆品，只控制颜色、排版、动画。
.json  // 🗄️ 档案管理：(JS Object Notation) 死板但规矩，专职存放配置数据，必用双引号。
\`\`\`

### 🪄 三、 施法咒语 (核心关键字)
每次看代码觉得眼花缭乱？其实核心的动作只有这几个：

\`\`\`javascript
import            // 🚚 进货：从零件仓库搬工具出来 (比如拿到 useState)。
export default    // 🏪 开店：把写好的页面暴露出去，让外界浏览器能访问到。
const             // 📦 铁箱：造一个常量，一旦封装好，里面的东西不可轻易变动。
useState          // 🧠 记忆体：赋予网页记忆力，记住用户的点击、展开、输入状态。
return ( ... )    // 📺 显像管：不管上面逻辑多复杂，只有 return 里的标签才能被用户看见。
className="..."   // 💄 化妆术：配合 Tailwind，直接写 bg-blue-500 就能瞬间上色。
\`\`\`

> 💡 **今日开发者感悟**
> 面对未知的黑盒，不要害怕。把代码当成可以组装的零件，我就是那个绘制图纸的架构师。`
      },
      {
        id: "deployment-guide",
        time: "12:00",
        title: "🚀 Next.js + Vercel 部署通关全记录",
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
git remote add origin [https://github.com/你的用户名/my-note.git](https://github.com/你的用户名/my-note.git)
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
  
  const [expandedDates, setExpandedDates] = useState<string[]>([STATIC_BLOG_POSTS[0].date]); 
  const [activeLogId, setActiveLogId] = useState<string>(STATIC_BLOG_POSTS[0].logs[0].id); 

  const toggleDateExpand = (date: string) => {
    setExpandedDates(prev => 
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const getActiveLog = () => {
    for (const day of data) {
      const found = day.logs.find(log => log.id === activeLogId);
      if (found) return { log: found, date: day.date };
    }
    return null;
  };

  const activeData = getActiveLog();

  const renderFormattedContent = (text: string) => {
    const regex = /```(\w+)?\n([\s\S]*?)\n```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<div key={`text-${match.index}`} className="mb-4 whitespace-pre-wrap text-zinc-700 leading-7 text-[15px]">{text.substring(lastIndex, match.index)}</div>);
      }
      parts.push(
        <div key={`code-${match.index}`} className="my-6 rounded-xl overflow-hidden shadow-sm border border-zinc-200 bg-[#1e1e1e]">
          <div className="flex items-center h-8 px-4 bg-[#2d2d2d] border-b border-[#3e3e3e]">
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
            </div>
            <span className="ml-4 text-xs text-zinc-400 font-mono">{match[1] || 'code'}</span>
          </div>
          <SyntaxHighlighter 
            language={match[1] || 'javascript'} 
            style={vscDarkPlus} 
            customStyle={{ margin: 0, padding: '16px 20px', fontSize: '13px', lineHeight: '1.6', overflowX: 'auto', background: 'transparent' }}
            wrapLongLines={false}
          >
            {match[2]}
          </SyntaxHighlighter>
        </div>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(<div key="text-end" className="whitespace-pre-wrap text-zinc-700 leading-7 text-[15px]">{text.substring(lastIndex)}</div>);
    return parts;
  };

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
      
      {/* =========== 侧边栏导航区 =========== */}
      <nav className="w-full md:w-64 bg-[#1A1C1E] text-white shrink-0 shadow-2xl z-30 flex flex-col">
        <div className="p-6 shrink-0">
            <div className="text-lg font-black text-blue-400 tracking-wider uppercase flex items-center gap-2">
                <span className="text-2xl">📚</span> ZH's DEV LOG
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6 md:space-y-4">
          {data.map(day => {
            const isDateExpanded = expandedDates.includes(day.date);
            const containsActiveLog = day.logs.some(log => log.id === activeLogId);

            return (
              <div key={day.date} className="space-y-1">
                <button 
                  onClick={() => toggleDateExpand(day.date)} 
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all group ${containsActiveLog ? 'text-blue-400' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 opacity-70" />
                    <span>{day.date}</span>
                  </div>
                  <div className={`transform transition-transform duration-200 ${isDateExpanded ? 'rotate-180' : ''} opacity-50 group-hover:opacity-100`}>
                     <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isDateExpanded && (
                  <div className="space-y-1 pl-4 relative">
                    <div className="absolute left-[11px] top-0 bottom-2 w-[1px] bg-zinc-800"></div>
                    {day.logs.map(log => (
                      <button 
                        key={log.id}
                        onClick={() => setActiveLogId(log.id)}
                        className={`relative w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-all flex items-center gap-2 group ${
                          activeLogId === log.id 
                            ? 'bg-blue-600/20 text-blue-400'  
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30' 
                        }`}
                      >
                        {activeLogId === log.id && (
                            <div className="absolute left-[-5px] w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        )}
                        <FileText className={`w-3.5 h-3.5 shrink-0 transition-opacity ${activeLogId === log.id ? 'opacity-100' : 'opacity-50 group-hover:opacity-80'}`} />
                        <span className="truncate">{log.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* =========== 主内容展示区 =========== */}
      <section className="flex-grow p-6 md:p-12 overflow-y-auto bg-white">
        <div className="max-w-4xl mx-auto">
          {activeData ? (
            <div className="animate-fadeIn">
              <div className="mb-8 pb-6 border-b border-zinc-100">
                <div className="flex items-center gap-3 text-sm text-zinc-400 font-medium mb-3">
                  <span className="bg-zinc-100 px-2 py-1 rounded-md">{activeData.date}</span>
                  <span>•</span>
                  <span className="font-mono">{activeData.log.time}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight leading-tight">
                  {activeData.log.title}
                </h1>
              </div>

              <div className="content-render prose prose-zinc max-w-none">
                {renderFormattedContent(activeData.log.content)}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-zinc-400">
              请在左侧选择一篇笔记阅读
            </div>
          )}
        </div>
      </section>
    </main>
  );
}