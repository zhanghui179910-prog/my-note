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
    date: "2026年2月28日",
    logs: [
      {
        id: "github-actions-automation",
        time: "16:00",
        title: "☁️ 实战：让 AI 资讯系统在云端自动运行",
        content: `
这篇文章记录了我从 0 到 1 打造“全维度 AI 资讯与投资决策聚合系统”的最后一步：如何利用 GitHub Actions 把代码放到云端，让它成为一个 24 小时待命、全自动运行的私人助理。

### 第一部分：准备工作与云端金库搭建

我们要把 GitHub 想象成一个免费为你提供 24 小时在线服务器的大厂。只要给它写一份“定时任务说明书”，它就会准时唤醒一台云端电脑帮你跑代码。

1. 建立私密仓库 (Private Repository)
登录 GitHub 后新建一个仓库。这里的致命重点是：必须选择 Private（私有）。因为我们的代码里写着真实的 DeepSeek API 密钥，如果公开，极易被黑客编写脚本盗刷余额。

2. 上传核心代码
将我们写好的 Python 代码文件（例如命名为 daily_scraper.py）上传到这个私密仓库的根目录下。

---

### 第二部分：编写云端定时任务说明书

在 GitHub 仓库中找到 Actions 标签页，点击 set up a workflow yourself，新建一个名为 schedule.yml 的配置文件。

这个 YML 文件就是给云端服务器下达的指令清单。

代码实现：

\`\`\`yaml
name: 每日情报内参自动推送

on:
  schedule:
    - cron: '0 6 * * *'
  workflow_dispatch: 

jobs:
  run-python-script:
    runs-on: ubuntu-latest

    steps:
      - name: 1. 检出代码
        uses: actions/checkout@v3

      - name: 2. 配置 Python 环境
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: 3. 安装依赖包
        run: |
          python -m pip install --upgrade pip
          pip install requests feedparser urllib3

      - name: 4. 执行抓取与推送脚本
        run: python daily_scraper.py
\`\`\`

语法穿插教学：

1. YAML 格式语法：这是一种专门用来写配置文件的语言。它不使用大括号，而是严格依靠缩进（空格）来表示层级关系。就像大纲笔记一样，同层级的事物必须对齐。

2. Cron 表达式：这是一种在服务器领域通用的时间表达语言。格式通常是五颗星（分钟 小时 日 月 星期）。比如 0 6 * * * 就代表每天的 06:00 执行任务。

3. 管道符 (|)：在 run 后面加上这个竖线，意味着下面可以连续写多行命令，计算机会逐行依次执行。

逐行原理解析：

- name：给这个自动化工作流起个名字。
- on.schedule：设定触发条件为定时计划。
- cron: '0 6 * * *'：设定具体时间。注意这里是 UTC 时间 06:00，换算成北京时间正好是 14:00。
- workflow_dispatch：这是一个极其好用的魔法指令。加上它，GitHub 网页上就会多出一个可以手动点击运行的按钮，方便我们随时测试，不用傻等定时时间。
- runs-on: ubuntu-latest：向 GitHub 申请一台安装了最新版 Ubuntu (Linux) 系统的免费虚拟电脑。
- steps：这台虚拟电脑开机后，要依次执行的步骤清单。
- actions/checkout@v3：使用 GitHub 官方的工具，把我们仓库里的 Python 代码下载到这台刚开机的虚拟电脑里。
- actions/setup-python@v4：在这台电脑上安装 Python 3.10 运行环境。
- pip install...：通过终端命令，安装我们代码中引用到的 requests 等第三方库。如果没有这一步，代码运行会报错找不到模块。
- python daily_scraper.py：最后一步，敲下回车，正式运行我们的爬虫与推送脚本。

---

### 第三部分：实战避坑与关键注意事项总结

在自动化部署（CI/CD 雏形）的过程中，有几个反直觉的坑需要特别注意：

时区陷阱 (UTC vs UTC+8)
在服务器领域，默认时间永远是格林威治标准时间 (UTC)。中国处于东八区，比 UTC 时间快 8 个小时。如果你想让程序在北京时间 14:00 运行，必须在 Cron 表达式里减去 8 小时，写成 0 6 * * *。如果直接写 14，程序会在每天晚上 22:00 运行。

排队拥堵机制
GitHub Actions 是面向全球开发者免费提供的。在每个整点（比如 06:00 UTC），全球会有海量的定时任务同时被触发，导致服务器发生网络大塞车。因此，你设定的 14:00 任务，实际推送到手机上的时间可能会在 14:05 或 14:12，这是正常的服务器排队调度现象，并非代码错误。

安全隔离意识
永远不要在公开仓库暴露任何形式的 Token 或 API Key。一旦暴露，不仅面临经济损失，平台方（如 GitHub 或推送平台）的安全扫描机器人也会立刻介入，强制将你的仓库封禁或使 Token 失效。

至此，我们的全维度 AI 资讯聚合系统已经实现了从抓取、提炼、排版到云端定时运行的 100% 全自动化闭环。每天下午两点，你只需要优雅地打开微信，即可查收专属于你的行业内参。
`
      },
      {
        id: "ai-news-aggregator-dev",
        time: "10:30",
        title: "🤖 实战：开发 AI 资讯与投资聚合系统",
        content: `
这篇文章记录了我从 0 到 1 打造“全维度 AI 资讯与投资决策聚合系统”的全过程。不论你是刚接触 Python 的新手，还是想了解大模型 API 对接的开发者，这篇笔记都会拆解清楚每一行代码背后的逻辑。

### 第一部分：项目拆解与准备工作

在动手写代码之前，我们需要理清这个系统到底要干什么、数据从哪来、怎么展示。

1. 我们要解决什么痛点？
每天去不同网站刷科技新闻、看 GitHub 榜单太浪费时间。我们需要一个机器人，每天自动去各大平台抓取最新的信息，用 AI 总结成一句话，然后发到我们的手机上。

2. 数据从哪里来？
- 开源项目：调用 GitHub 官方提供的 Search API。
- 行业资讯：利用 RSS 订阅源（如 36氪、机器之心等）。RSS 是一种结构化的数据格式，非常适合爬虫抓取。

3. 页面需要哪些板块？
系统包含：AI 龙头官方动态、每日投资跟踪、设计前沿、综合科技资讯，以及 GitHub 的 AI 和设计类工具榜单。

4. 交互逻辑怎么设计？
因为资讯数量庞大（多达 60 条），如果全部平铺，手机屏幕根本看不完。我们需要利用原生 HTML 的 details 和 summary 标签，实现“点击标题即可展开内容”的折叠效果。

---

### 第二部分：核心代码实现与逐行教学

这一部分是核心重点。我会将代码拆解成几个模块，并逐行解释它们的含义。

#### 模块一：大模型 API 对接与异常处理机制

当爬虫抓取到长篇大论的新闻后，我们需要把它交给 DeepSeek 模型，让它提炼出核心要点。

代码实现：

\`\`\`python
import requests
import time

def call_deepseek_with_retry(prompt, retries=3):
    url = "https://api.deepseek.com/chat/completions"
    headers = {
        "Authorization": "Bearer sk-你的API密钥", 
        "Content-Type": "application/json"
    }
    payload = {
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3,
        "max_tokens": 500
    }

    for attempt in range(retries):
        try:
            time.sleep(2) 
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            response.raise_for_status()
            return response.json()['choices'][0]['message']['content'].strip()
        except Exception as e:
            print(f"请求失败，正在进行重试... 错误信息：{e}")
            time.sleep(3) 
            
    return "⚠️ 暂未获取到最新信息，服务器可能过载。"
\`\`\`

语法穿插教学：

1. 字典构建 (Dictionary)：headers 和 payload 是 Python 中的字典结构（用大括号包裹的键值对）。你可以把它理解为一个带有标签的收纳盒。比如 Content-Type 就是标签，application/json 就是里面装的内容。这相当于我们在给 DeepSeek 写信时，信封上规定的标准格式。

2. for 循环控制：for attempt in range(retries): 的意思是“重复执行下面的代码若干次”。这里的 retries=3 表示最多尝试 3 次。

3. try-except 异常捕获：这是程序的“防撞墙”。平时代码一报错就会直接死机退出。把代码放在 try 里面，如果出错了，程序不会崩溃，而是会跳到 except 里面执行。这叫做“捕获异常”。

逐行原理解析：

- url：定义了 DeepSeek 接收消息的服务器地址。
- headers：带上你的通行证（API 密钥）和数据格式声明。
- payload：我们要发给 AI 的具体内容。temperature 参数限制了 AI 的发散思维，让它的回答更严谨、不啰嗦。
- time.sleep(2)：极其关键的一行！让程序强制停顿 2 秒。如果请求太快，AI 服务器会以为你是恶意攻击从而封锁你。这叫“物理防封锁”。
- requests.post：使用 Python 的 requests 库，把打包好的信件发送出去。
- response.raise_for_status：检查服务器有没有报错。如果有错，立刻抛出异常进入 except。
- return：如果一切顺利，剥开服务器返回的层层数据格式，提取出 AI 最终说的核心文字，并返回给主程序。

#### 模块二：多源数据爬取与去重过滤

我们需要抓取成百上千条新闻，并确保最终推送到手机上的内容绝对不重复。

代码实现：

\`\`\`python
import feedparser

SEEN_TITLES = set() # 全局去重池

def fetch_filtered_news(url, target_count):
    global SEEN_TITLES
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0'
    }
    
    response = requests.get(url, headers=headers, timeout=15)
    entries = feedparser.parse(response.content).entries[:100]
    
    results = []
    for e in entries:
        if e.title in SEEN_TITLES:
            continue
            
        results.append({"标题": e.title, "链接": e.link})
        SEEN_TITLES.add(e.title)
        
        if len(results) >= target_count:
            break
            
    return results
\`\`\`

语法穿插教学：

1. 全局变量 (global)：SEEN_TITLES 定义在所有函数外面，这就好比挂在村口的大黑板。加了 global 关键字，所有的爬虫函数就都能看到并修改这块黑板，从而实现跨板块的数据共享。

2. 集合特性 (Set)：set() 是 Python 里一种特殊的数据容器。它最大的特点是天生去重，里面绝对不能有两件一模一样的东西。并且它查找数据的速度极快。

3. requests.get()：相比于刚才发送数据的 post，get 就像是单纯的“读取”网页内容。

逐行原理解析：

- SEEN_TITLES：在程序最开始，初始化一个空的黑名单。
- headers：这是“爬虫伪装术”。声明自己是 Chrome 浏览器，就能骗过服务器的防爬机制。
- entries：解析网页数据，并且一口气提取前 100 条备用。
- if e.title in SEEN_TITLES：查户口。如果要抓取的新闻标题已经在黑板上了，直接跳过当前循环，看下一条。
- SEEN_TITLES.add：把新鲜抓到的新闻立刻写在村口的黑板上，告诉后面的程序不要再抓。
- if len(results) >= target_count: break：只要数量凑够了，立刻结束循环，不再继续抓取。

#### 模块三：HTML 原生排版与防止内容截断

拿到数据后，我们要把它们拼接成漂亮的排版。

避坑解析（为什么要用 HTML 而不用 Markdown？）：
很多推送平台（如 PushPlus）底层的 Markdown 解析器非常脆弱。如果你在折叠标签里面继续使用 Markdown 的列表符，解析器会崩溃，导致你收到的消息只有一半或者排版全部错乱。最好的解决办法是返璞归真，直接用最基础的 HTML 标签来控制排版。

代码实现：

\`\`\`python
def render_safe_html_section(section_title, items):
    if not items: 
        return ""
    
    html = f"<details>\\n"
    html += f"<summary><h4>{section_title} (共 {len(items)} 条)</h4></summary>\\n<br>\\n"
    
    for i, item in enumerate(items, 1):
        html += f"<details>\\n"
        html += f"<summary><b>{i:02d}. {item['标题']}</b></summary>\\n"
        html += f"<p><b>💡 核心提炼：</b><br>{item['总结']}</p>\\n"
        html += f"<a href='{item['链接']}'>🔗 点击阅读原文</a>\\n"
        html += f"</details>\\n"
        
    html += "</details>\\n\\n---\\n\\n"
    return html
\`\`\`

逐行原理解析：

- if not items: return ""：容错机制，如果这个板块没抓到数据，直接返回空，避免报错。
- details 和 summary：这是一对原生 HTML 标签。包裹在 summary 里的文字会显示为可点击的标题，点击后才会显示 details 里面的详细内容。
- enumerate(items, 1)：这个函数可以在遍历数据的同时，自动帮你生成一个序号，并且我们指定从 1 开始数。
- <br>：强制换行符。我们用它取代了传统的 Markdown 回车，极大地增强了不同平台渲染的稳定性。

---

### 第三部分：系统联调与推送

所有数据和排版都组装好后，最后一步是把它推送到我们的微信上。这里借助了免费的 PushPlus 接口。

代码实现：

\`\`\`python
def push_to_wechat(final_content):
    url = "http://www.pushplus.plus/send"
    payload = {
        "token": "你的PushPlus_Token",
        "title": "行业决策全景简报",
        "content": final_content,
        "template": "markdown" 
    }
    
    response = requests.post(url, json=payload, timeout=20)
    if response.json().get('code') == 200:
        print("推送成功！")
\`\`\`

语法穿插教学：

JSON 格式：前后端通信的“世界语”。它在 Python 里看起来像字典（键值对），但在网络传输时，会被转化成一种轻量级的文本格式。我们通过 json=payload 让 Python 自动帮我们完成这个转化。

逐行原理解析：

- 规定目标 URL，组装 token（验证身份）、title（微信卡片标题）和 content（拼接出的 HTML 长文本）。
- 使用 POST 请求将包裹发给 PushPlus 服务器。
- response.json().get('code') == 200：大多数规范的 API 服务器，只要处理成功，都会返回状态码 200。我们在终端打印成功提示，方便监控。

---

### 第四部分：实战避坑与关键注意事项总结

在整个项目的从 0 到 1 落地过程中，有几个极易踩坑的地方，需要特别注意：

合规与稳定：为什么必须要有物理冷却？
- 边界：爬虫只能抓取公开可见的数据，绝不要尝试绕过付费墙，同时遵循网站的 robots 协议。
- 防过载：大模型 API 对并发请求极其敏感。如果在 for 循环中不加物理休眠，系统会瞬间发出几十个请求，不仅大概率触发报错被封禁，还可能导致程序崩溃。稳扎稳打才是真理。

数量保障机制：警惕“新闻源枯竭”
- 现象：如果你要求提取 20 条新闻，但抓取源本身只提供最新的 30 条数据。经过关键词过滤和去重后，很可能只剩下 5 条符合要求，导致最终推送缺斤少两。
- 解法：采用多源合并策略。在代码中，我们把多个源头的新闻汇总到一个巨大的池子里，把总样本量扩大到 200 条以上，然后再交给代码去过滤，这样就能确保每次都有充足的干货填满指标。

性能优化：节省 Token 的切片大法
- 思路：新闻正文往往有几千字，全部塞给 AI 不仅会导致接口响应缓慢，还会消耗海量的 Token 额度。
- 优化：在调用 AI 的函数中，强制对文本进行切片，只把前 200 个字发给大模型。因为核心要点通常都在导语部分，前 200 字已经足够提炼出精准的摘要了。这能让程序速度翻倍，且成本降至最低。
`
      }
    ]
  },
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