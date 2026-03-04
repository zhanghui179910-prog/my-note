"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  ChevronRight, ChevronDown, FileText, Calendar, Activity,
  Github, Terminal, Search, Tag, X, ArrowLeft, ArrowRight, Pencil, Plus, Check
} from 'lucide-react';

interface LogEntry {
  id: string;
  time: string;
  title: string;
  content: string;
  tags?: string[];
}

interface DayLog {
  date: string;
  logs: LogEntry[];
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const STATIC_BLOG_POSTS: DayLog[] = [
  {
    date: "2026年3月4日",
    logs: [
      {
        id: "go-language-basics",
        time: "10:30",
        title: "🎯 Go 语言初体验：变量与常量声明",
        tags: ["Go", "编程入门", "后端"],
        content: `
这篇文章记录了我第一次接触 Go 语言的基础语法学习，包括常量、变量声明和基本输出。

### 一、常量声明 (const)

在 Go 语言中，使用 \`const\` 关键字声明常量。常量一旦声明，其值不可更改。

\`\`\`go
// 声明一个常量 GameName
// 格式：const 名字 = "值"
const GameName = "Go语言打怪之旅"
\`\`\`

**关键点：**
- 常量在编译时确定值，运行时不可修改
- 适合存放固定配置、错误码等不变数据

---

### 二、变量声明 (var)

使用 \`var\` 关键字声明变量，Go 编译器会自动推断类型。

\`\`\`go
// 用 var 声明一个整数类型的变量 level
// 格式：var 名字 类型 = 值 （Go 语言里的整数类型叫 int）
var level = 1
\`\`\`

**注意：** 虽然可以省略类型让编译器推断，但显式声明类型可提高代码可读性。

---

### 三、简短声明 (:=)

这是 Go 语言最酷、最常用的语法！不需要写 \`var\` 和类型，编译器自动推断。

\`\`\`go
// 用简短声明 := 定义一个字符串变量 heroName
// 格式：名字 := "值"
heroName := "第一次练习GO语言"
\`\`\`

**使用场景：**
- 只能在函数内部使用
- 适合声明局部变量，简洁高效

---

### 四、格式化输出 (fmt.Println)

\`fmt.Println\` 可以接收多个参数，中间用逗号隔开，它会自动在输出时加上空格。

\`\`\`go
// 使用 fmt.Println 组合打印出来
fmt.Println("欢迎来到", GameName, "！")
fmt.Println("勇士", heroName, "当前的等级是:", level)
\`\`\`

**输出结果：**
\`\`\`
欢迎来到 Go语言打怪之旅 ！
勇士 第一次练习GO语言 当前的等级是: 1
\`\`\`

---

### 五、完整代码示例

\`\`\`go
package main

import "fmt"

func main() {
    // 任务 1：声明一个常量 GameName
    const GameName = "Go语言打怪之旅"

    // 任务 2：用 var 声明一个整数类型的变量 level
    var level = 1

    // 任务 3：用简短声明 := 定义一个字符串变量 heroName
    heroName := "第一次练习GO语言"

    // 任务 4：使用 fmt.Println 组合打印出来
    fmt.Println("欢迎来到", GameName, "！")
    fmt.Println("勇士", heroName, "当前的等级是:", level)
}
\`\`\`

---

### 六、语法速记表

| 声明方式 | 关键字 | 示例 | 适用场景 |
|---------|-------|------|---------|
| 常量 | \`const\` | \`const Name = "value"\` | 固定不变的数据 |
| 变量 | \`var\` | \`var level int = 1\` | 包级别/需要显式类型 |
| 简短声明 | \`:=\` | \`name := "value"\` | 函数内部局部变量 |

> 💡 **今日开发者感悟**
> const xx = "xx" , var xx = 1 , xx := "xx" ,  fmt = Println("xx",1,"!")
 package main（声明主包）:
含义：告诉编译器当前文件属于 main 包。
作用：标志着这是一个可以被独立执行的程序（比如能编译成 .exe 文件），而不是一个给别人调用的依赖库（Library）。

import "fmt"（导入标准库）:
含义：引入 Go 官方内置的 fmt (format) 格式化工具包。
作用：赋予程序控制台输入和输出的能力。必须导入它，才能使用 fmt.Println 在屏幕上打印文字。

func main() {}（主函数入口）:
含义：定义程序的 main 主函数。
作用：整个程序运行的唯一合法起点。无论代码有多长，系统永远只会从 main 函数的大括号 { 内部开始，一行一行往下执行。

`
      },
      {
        id: "go-loop-and-condition",
        time: "14:00",
        title: "🔄 Go 语言进阶：循环与条件判断",
        tags: ["Go", "编程入门", "控制流"],
        content: `
这篇文章记录了我学习 Go 语言的流程控制语句，包括 for 循环和 if-else 条件判断。

### 一、for 循环：Go 语言唯一的循环结构

Go 语言中没有 \`while\`、\`do-while\`，只有 \`for\` 一个循环关键字，但它可以覆盖所有循环场景。

\`\`\`go
// 完整语法：for 初始化; 条件; 每次循环后执行的操作 { }
for i := 1; i <= 5; i++ {
    // 循环体：i 从 1 增加到 5
}
\`\`\`

**三要素拆解：**
| 部分 | 代码 | 含义 |
|-----|------|-----|
| 初始化 | \`i := 1\` | 从 1 开始 |
| 条件 | \`i <= 5\` | 只要 i ≤ 5 就继续 |
| 迭代 | \`i++\` | 每次循环后 i 加 1 |

---

### 二、if-else 条件判断

Go 语言的 if 语句不需要小括号包裹条件，但大括号必须写！

\`\`\`go
if i == 3 {
    fmt.Println("等级 3: 获得新技能！")
} else {
    fmt.Println("当前等级:", i)
}
\`\`\`

**关键点：**
- 判断相等必须用双等号 \`==\`（单等号是赋值！）
- \`else\` 分支在条件不满足时执行
- 左大括号 \`{\` 必须和 \`if\`/\`else\` 在同一行

---

### 三、完整代码示例

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("--- 开始自动练级 ---")

    // 使用 for 循环，让变量 i 从 1 增加到 5
    for i := 1; i <= 5; i++ {

        // 使用 if 判断 i 是否等于 3
        if i == 3 {
            fmt.Println("等级 3: 获得新技能！")
        } else {
            // 如果不等于 3，执行常规打印
            fmt.Println("当前等级:", i)
        }
    }
}
\`\`\`

**输出结果：**
\`\`\`
--- 开始自动练级 ---
当前等级: 1
当前等级: 2
等级 3: 获得新技能！
当前等级: 4
当前等级: 5
\`\`\`

---

### 四、执行流程图解

\`\`\`
i=1 → 不等于3 → 打印 "当前等级: 1"
i=2 → 不等于3 → 打印 "当前等级: 2"
i=3 → 等于3   → 打印 "等级 3: 获得新技能！"  ⭐
i=4 → 不等于3 → 打印 "当前等级: 4"
i=5 → 不等于3 → 打印 "当前等级: 5"
i=6 → 不满足 i<=5 → 循环结束
\`\`\`

---

### 五、语法速记表

| 语句 | 格式 | 示例 |
|-----|------|------|
| for 循环 | \`for 初始化; 条件; 迭代 { }\` | \`for i := 1; i <= 5; i++ { }\` |
| if 判断 | \`if 条件 { }\` | \`if i == 3 { }\` |
| if-else | \`if 条件 { } else { }\` | \`if i == 3 { } else { }\` |
| 自增 | \`变量++\` | \`i++\` (等同于 i = i + 1) |

> 💡 **今日开发者感悟**
> Go 语言的 for 循环设计非常简洁，一个关键字解决所有循环需求。if 语句不需要括号的特性让代码更清爽，但要注意 \`==\` 和 \`=\` 的区别——这是新手最容易踩的坑！
`
      },
      {
        id: "go-switch-rawstring",
        time: "16:30",
        title: "🔀 Go 语言实战：switch 与多行字符串",
        tags: ["Go", "编程入门", "CLI"],
        content: `
这篇文章记录了我学习 Go 语言的 switch 分支语句和反引号多行字符串的用法。

### 一、switch 语句：比 if-else 更优雅的多分支选择

当需要判断多种情况时，\`switch\` 比 \`if-else\` 链更清晰易读。

\`\`\`go
switch userInput {
case 1:
    fmt.Println("执行: 添加新任务")
case 2:
    fmt.Println("执行: 查看所有任务")
default:
    fmt.Println("输入错误，请重新输入")
}
\`\`\`

**执行逻辑：**
- 从上到下依次匹配 \`case\` 的值
- 匹配成功则执行对应代码块，然后**自动退出**（不需要 break！）
- 所有 case 都不匹配时执行 \`default\`

---

### 二、反引号字符串：原样输出的神器

Go 语言中有两种字符串声明方式：

| 引号类型 | 符号 | 特点 |
|---------|------|------|
| 双引号 | " " | 只能写在一行，支持转义字符如 \\n |
| 反引号 | \`(键盘Esc下方) | **原样输出**，换行、缩进全部保留 |

\`\`\`go
// 双引号：需要手动加 \\n 换行
fmt.Println("第一行\\n第二行")

// 反引号：直接换行，所见即所得
fmt.Println(\`
--- 欢迎使用 CLI 任务管理器 ---
1. 添加任务
2. 查看任务
请选择操作:___\`)
\`\`\`

**反引号使用场景：**
- CLI 菜单界面
- SQL 语句
- JSON/HTML 模板
- 任何需要保留格式的长文本

---

### 三、完整代码示例：CLI 任务管理器菜单

\`\`\`go
package main

import "fmt"

func main() {
    // 声明一个整数变量 userInput，模拟用户输入
    var userInput = 2

    // 打印多行菜单（使用反引号原样输出）
    fmt.Println(\`
--- 欢迎使用 CLI 任务管理器 ---
1. 添加任务
2. 查看任务
请选择操作:___\`)

    // 使用 switch 语句根据 userInput 的值进行判断
    switch userInput {
    case 1:
        fmt.Println("执行: 添加新任务")
    case 2:
        fmt.Println("执行: 查看所有任务")
    default:
        fmt.Println("输入错误，请重新输入")
    }
}
\`\`\`

**输出结果：**
\`\`\`
--- 欢迎使用 CLI 任务管理器 ---
1. 添加任务
2. 查看任务
请选择操作:___
执行: 查看所有任务
\`\`\`

---

### 四、switch vs if-else 对比

\`\`\`go
// 用 if-else 写（比较啰嗦）
if userInput == 1 {
    fmt.Println("执行: 添加新任务")
} else if userInput == 2 {
    fmt.Println("执行: 查看所有任务")
} else {
    fmt.Println("输入错误")
}

// 用 switch 写（更清晰）
switch userInput {
case 1:
    fmt.Println("执行: 添加新任务")
case 2:
    fmt.Println("执行: 查看所有任务")
default:
    fmt.Println("输入错误")
}
\`\`\`

**选择建议：**
- 2 种情况 → 用 \`if-else\`
- 3 种及以上 → 用 \`switch\` 更清晰

---

### 五、语法速记表

| 语法 | 格式 | 说明 |
|-----|------|------|
| switch | \`switch 变量 { case 值: ... default: ... }\` | 自动 break，无需手动添加 |
| 反引号字符串 | 用反引号包裹多行文本 | 原样输出，保留所有格式 |
| case 多值 | \`case 1, 2, 3:\` | 多个值共用一个分支 |

> 💡 **今日开发者感悟**
> switch 语句的自动 break 设计非常人性化，省去了其他语言中忘记写 break 的常见 bug。反引号字符串让我想起了 Python 的三引号，在写 CLI 菜单时特别方便，不用再手动拼接 \\n 了！
`
      },
      {
        id: "go-infinite-loop-input",
        time: "20:00",
        title: "⌨️ Go 语言实战：无限循环与用户输入",
        tags: ["Go", "编程入门", "CLI", "交互"],
        content: `
这篇文章记录了我学习 Go 语言的无限循环、用户输入和 break 跳出循环的用法。

### 一、无限循环：for { }

Go 语言中没有 \`while(true)\`，无限循环直接写 \`for { }\` 即可。

\`\`\`go
// 无限循环：条件留空就是"永远为真"
for {
    // 这里面的代码会一直重复执行
}
\`\`\`

**使用场景：**
- CLI 菜单程序（用户不退出就一直运行）
- 服务器监听请求
- 游戏主循环

---

### 二、接收用户输入：fmt.Scan

\`fmt.Scan\` 用于从键盘读取用户输入，**变量名前必须加 \`&\` 符号**。

\`\`\`go
var userInput int
fmt.Scan(&userInput)  // & 是"取地址"符号，告诉 Scan 把值存到哪里
\`\`\`

**为什么需要 & ？**
- \`userInput\` 是变量的值
- \`&userInput\` 是变量在内存中的地址
- Scan 需要知道地址才能把用户输入的值"送进"变量里

---

### 三、break：跳出循环

\`break\` 关键字用于立即退出当前所在的循环。

\`\`\`go
switch userInput {
case 3:
    fmt.Println("退出程序")
    break  // 跳出 switch（但 Go 的 switch 自动 break，这行可省略）
}

if userInput == 3 {
    break  // 跳出 for 循环
}
\`\`\`

**注意：** 在 Go 中，switch 里的 break 只跳出 switch，不会跳出外层的 for 循环。所以需要在 switch 外面再加一个 if 判断来跳出循环。

---

### 四、完整代码示例：交互式 CLI 任务管理器

\`\`\`go
package main

import "fmt"

func main() {
    // 声明一个整数变量，不赋初始值（默认是 0）
    var userInput int

    // 开启一个无限循环
    for {
        fmt.Println(\`
--- 欢迎使用 CLI 任务管理器 ---
1. 添加任务
2. 查看任务
3. 退出程序
请选择操作:\`)

        // 接收用户的键盘输入
        fmt.Scan(&userInput)

        switch userInput {
        case 1:
            fmt.Println("👉 执行: 准备添加新任务...")
        case 2:
            fmt.Println("👉 执行: 准备查看所有任务...")
        case 3:
            fmt.Println("👋 退出程序，拜拜！")
        default:
            fmt.Println("❌ 输入错误，请重新输入")
        }

        // 如果用户选择了 3，跳出循环结束程序
        if userInput == 3 {
            break
        }
    }
}
\`\`\`

**运行效果：**
\`\`\`
--- 欢迎使用 CLI 任务管理器 ---
1. 添加任务
2. 查看任务
3. 退出程序
请选择操作:
1
👉 执行: 准备添加新任务...

--- 欢迎使用 CLI 任务管理器 ---
1. 添加任务
2. 查看任务
3. 退出程序
请选择操作:
3
👋 退出程序，拜拜！
\`\`\`

---

### 五、执行流程图解

\`\`\`
┌─────────────────────────────────────┐
│  程序开始                            │
│  userInput = 0                      │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  for { } 无限循环开始                │
│  ↓                                  │
│  打印菜单                            │
│  ↓                                  │
│  fmt.Scan 等待用户输入               │
│  ↓                                  │
│  switch 判断 userInput              │
│  ↓                                  │
│  if userInput == 3 ?               │
│  ├─ 否 → 回到循环开头                │
│  └─ 是 → break 跳出循环             │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  程序结束                            │
└─────────────────────────────────────┘
\`\`\`

---

### 六、语法速记表

| 语法 | 格式 | 说明 |
|-----|------|------|
| 无限循环 | \`for { }\` | 条件留空，永远为真 |
| 接收输入 | \`fmt.Scan(&变量)\` | 必须加 & 取地址符 |
| 跳出循环 | \`break\` | 立即退出当前循环 |
| 变量默认值 | \`var i int\` | int 默认值是 0 |

> 💡 **今日开发者感悟**
> 今天完成了一个真正可交互的 CLI 程序！\`fmt.Scan\` 的 \`&\` 符号让我理解了 Go 语言对内存操作的严谨性。虽然 switch 自带 break 很方便，但要跳出外层循环还需要额外的 if 判断，这是 Go 语言设计上的一个"坑"，需要特别注意。
`
      }
    ]
  },
  {
    date: "2026年2月28日",
    logs: [
     {id: "dual-track-intelligence-radar",
        time: "20:00",
        title: "🛡️ 破局 2026：打造「双轨情报雷达」系统",
        tags: ["Python", "数据抓取", "系统架构"],
        content: `
这篇文章记录了我作为一个「系统架构师」，如何从底层手搓一个监控「高层定调与全球冲突」的私人智库系统。

### 核心技术解密：如何打造「双轨情报雷达」？

在这个系统中，我没有使用现成的爬虫框架，而是用 Node.js 从底层手搓了抓取逻辑。整个系统分为两条截然不同的侦察线：

#### 1. 国内线：硬核破解中文字符编码与「定调」过滤
官方网站通常有严格的结构。一开始抓取时，经常会遇到中文乱码或者抓到一堆无用的「行政机构名单」。

**我的破局点：** 放弃普通的文本请求，直接强制获取底层的二进制流（\`arraybuffer\`），然后手动用 \`TextDecoder\` 进行 UTF-8 解码。

接着，我写了一套「战略过滤器」：

\`\`\`javascript
// 核心过滤逻辑：剔除噪音，只留重磅
if (title.length > 12 && (title.includes('习近平') || title.includes('声明') || title.includes('李强'))) {
    // 命中核心定调，列入待分析阵列
}
\`\`\`
这样，几百条日常新闻瞬间被浓缩成了不到 30 条真正影响宏观经济走向的「重磅情报」。

#### 2. 国际线：降维打击反爬虫（绕过 JS 渲染拦截）
国际冲突监控站（如 CrisisGroup）为了防爬虫，使用了极重的 JavaScript 动态渲染。普通的 Node 请求只能抓到一堆空的 HTML 标签。

**我的破局点：** 不去跟前端死磕，直接绕到后门！我挂载了底层网络代理，并直接切入了联合国新闻「和平与安全」频道的 RSS XML 底层数据流。

\`\`\`javascript
// 开启 xmlMode 精准解析 RSS 数据流，无视任何前端反爬策略
const $ = cheerio.load(data, { xmlMode: true });

// ... 使用正则 /(冲突|加沙|乌克兰|袭击|危机|战争|制裁)/ 精准锚定见血的地缘危机
\`\`\`
机器读 XML 的速度极快，而且绝对不会漏掉任何一条影响全球供应链的高危警报。这就是降维打击。

### 总结
通过双轨并行的方式，我们构建了一个全天候的情报监控系统。国内线负责政策定调，国际线负责地缘冲突，两者互补，形成完整的情报闭环。
`},
      {
        id: "github-actions-automation",
        time: "16:00",
        title: "☁️ 实战：让 AI 资讯系统在云端自动运行",
        tags: ["GitHub", "CI/CD", "自动化", "Python"],
        content: `
这篇文章记录了我从 0 到 1 打造「全维度 AI 资讯与投资决策聚合系统」的最后一步：如何利用 GitHub Actions 把代码放到云端，让它成为一个 24 小时待命、全自动运行的私人助理。

### 第一部分：准备工作与云端金库搭建

我们要把 GitHub 想象成一个免费为你提供 24 小时在线服务器的大厂。只要给它写一份「定时任务说明书」，它就会准时唤醒一台云端电脑帮你跑代码。

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

### 第三部分：实战避坑与关键注意事项总结

在自动化部署（CI/CD 雏形）的过程中，有几个反直觉的坑需要特别注意：

1. 时区陷阱 (UTC vs UTC+8)
在服务器领域，默认时间永远是格林威治标准时间 (UTC)。中国处于东八区，比 UTC 时间快 8 个小时。如果你想让程序在北京时间 14:00 运行，必须在 Cron 表达式里减去 8 小时，写成 0 6 * * *。

2. 安全隔离意识
永远不要在公开仓库暴露任何形式的 Token 或 API Key。一旦暴露，不仅面临经济损失，平台方的安全扫描机器人也会立刻介入。

至此，我们的全维度 AI 资讯聚合系统已经实现了从抓取、提炼、排版到云端定时运行的 100% 全自动化闭环。
`
      },
      {
        id: "ai-news-aggregator-dev",
        time: "10:30",
        title: "🤖 实战：开发 AI 资讯与投资聚合系统",
        tags: ["Python", "AI", "API", "DeepSeek"],
        content: `
这篇文章记录了我从 0 到 1 打造「全维度 AI 资讯与投资决策聚合系统」的全过程。

### 第一部分：项目拆解与准备工作

在动手写代码之前，我们需要理清这个系统到底要干什么、数据从哪来、怎么展示。

1. 我们要解决什么痛点？
每天去不同网站刷科技新闻、看 GitHub 榜单太浪费时间。我们需要一个机器人，每天自动去各大平台抓取最新的信息，用 AI 总结成一句话，然后发到我们的手机上。

2. 数据从哪里来？
- 开源项目：调用 GitHub 官方提供的 Search API。
- 行业资讯：利用 RSS 订阅源（如 36氪、机器之心等）。

---

### 第二部分：核心代码实现

#### 模块一：大模型 API 对接与异常处理机制

当爬虫抓取到长篇大论的新闻后，我们需要把它交给 DeepSeek 模型，让它提炼出核心要点。

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

#### 模块二：多源数据爬取与去重过滤

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

---

### 第三部分：系统联调与推送

所有数据和排版都组装好后，最后一步是把它推送到我们的微信上。

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

### 总结

在这个时代，API 就是巨头公司对外开放的「超级算力厨房」。我们只需要写几十行 Python 代码，就能瞬间调动世界顶级的算力为我们所用。
`
      },

    ]
  },
  {
    date: "2026年2月26日",
    logs: [
      {
        id: "decoding-black-box",
        time: "12:30",
        title: "📂 Next.js 引入",
        tags: ["Next.js", "React", "前端"],
        content: `

 Next.js 核心运作机制：

### 🏗️ 一、 项目的「物理沙盘」 (核心文件夹)
就像造房子一样，代码世界也有它的功能分区。在左侧的文件树里，它们各司其职：

\`\`\`bash
📦 my-project-log (你的项目根目录)
 ┣ 📂 app/              # 📍 绝对核心区：99% 的网页逻辑都在这里
 ┃ ┣ 📜 page.tsx        # 🚪 门面担当：用户打开网址看到的第一眼画面
 ┃ ┗ 🎨 globals.css     # 🖌️ 全局画笔：控制整个网站的底色、字体等基础审美
 ┣ 📂 node_modules/     # ⚙️ 零件黑洞：(灰色) 存放 npm 下载的所有第三方工具。
 ┣ 📂 public/           # 🖼️ 静态仓库：存放本地图片、favicon 小图标。
 ┗ 📝 package.json      # 🧾 进货清单：记录了项目叫啥名，以及你「买」了哪些依赖包。
\`\`\`

### 🧬 二、 语言的「DNA 鉴定」 (文件后缀名)

\`\`\`typescript
.tsx   // 👑 王者融合：(TypeScript + XML) 允许把「逻辑控制」和「网页排版(HTML)」写在一起。
.ts    // 🛡️ 严谨护卫：(TypeScript) 严谨版 JS，自带防错机制，专门写纯逻辑。
.css   // 👗 纯粹美学：(Cascading Style Sheets) 纯粹的化妆品，只控制颜色、排版、动画。
.json  // 🗄️ 档案管理：(JS Object Notation) 死板但规矩，专职存放配置数据，必用双引号。
\`\`\`

### 🪄 三、 施法咒语 (核心关键字)

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
        tags: ["Next.js", "Vercel", "部署", "Git"],
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

// 提取文章目录
const extractToc = (content: string): TocItem[] => {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
    toc.push({ id, text, level });
  }
  return toc;
};

export default function Home() {
  const [data, setData] = useState(STATIC_BLOG_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [expandedDates, setExpandedDates] = useState<string[]>([STATIC_BLOG_POSTS[0].date]);
  const [activeLogId, setActiveLogId] = useState<string>(STATIC_BLOG_POSTS[0].logs[0].id);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showToc, setShowToc] = useState(true);
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [showTagEditor, setShowTagEditor] = useState(false);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [showAddTagToPost, setShowAddTagToPost] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    data.forEach(day => {
      day.logs.forEach(log => {
        log.tags?.forEach(tag => tagSet.add(tag));
      });
    });
    customTags.forEach(tag => tagSet.add(tag));
    return Array.from(tagSet).sort();
  }, [data, customTags]);
  const activeData = useMemo(() => {
    for (const day of data) {
      const found = day.logs.find(log => log.id === activeLogId);
      if (found) return { log: found, date: day.date };
    }
    return null;
  }, [data, activeLogId]);

  const toc = useMemo(() => {
    if (!activeData) return [];
    return extractToc(activeData.log.content);
  }, [activeData]);

  // 过滤文章
  const filteredLogs = useMemo(() => {
    let logs = data.flatMap(day => day.logs.map(log => ({ ...log, date: day.date })));

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      logs = logs.filter(log =>
        log.title.toLowerCase().includes(query) ||
        log.content.toLowerCase().includes(query)
      );
    }

    if (selectedTag) {
      logs = logs.filter(log => log.tags?.includes(selectedTag));
    }

    return logs;
  }, [data, searchQuery, selectedTag]);

  // 阅读进度
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const constScroll = window.scrollY;
      const progress = (constScroll / documentHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 滚动到顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeLogId]);

  const toggleDateExpand = (date: string) => {
    setExpandedDates(prev =>
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  // 添加新标签
  const handleAddTag = () => {
    if (newTagName.trim() && !customTags.includes(newTagName.trim())) {
      setCustomTags([...customTags, newTagName.trim()]);
      setNewTagName('');
      setShowTagEditor(false);
    }
  };

  // 删除自定义标签
  const handleDeleteTag = (tag: string) => {
    setCustomTags(customTags.filter(t => t !== tag));
    if (selectedTag === tag) {
      setSelectedTag(null);
    }
  };

  // 为当前文章添加标签
  const handleAddTagToCurrentPost = (tag: string) => {
    if (!activeData) return;
    const newData = data.map(day => ({
      ...day,
      logs: day.logs.map(log => {
        if (log.id === activeData.log.id) {
          return {
            ...log,
            tags: log.tags ? [...log.tags, tag] : [tag]
          };
        }
        return log;
      })
    }));
    setData(newData);
  };

  // 从当前文章移除标签
  const handleRemoveTagFromCurrentPost = (tag: string) => {
    if (!activeData) return;
    const newData = data.map(day => ({
      ...day,
      logs: day.logs.map(log => {
        if (log.id === activeData.log.id) {
          return {
            ...log,
            tags: log.tags?.filter(t => t !== tag)
          };
        }
        return log;
      })
    }));
    setData(newData);
  };

  // 开始编辑标题
  const handleStartEditTitle = () => {
    if (activeData) {
      setEditedTitle(activeData.log.title);
      setIsEditingTitle(true);
    }
  };

  // 保存编辑的标题
  const handleSaveTitle = () => {
    if (!activeData || !editedTitle.trim()) return;
    const newData = data.map(day => ({
      ...day,
      logs: day.logs.map(log => {
        if (log.id === activeData.log.id) {
          return { ...log, title: editedTitle.trim() };
        }
        return log;
      })
    }));
    setData(newData);
    setIsEditingTitle(false);
  };

  // 取消编辑标题
  const handleCancelEditTitle = () => {
    setIsEditingTitle(false);
    setEditedTitle('');
  };

  const renderFormattedContent = (text: string) => {
    const regex = /```(\w+)?\n([\s\S]*?)\n```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<div key={`text-${match.index}`} className="mb-4 text-[#8b949e] leading-7 text-[15px]" dangerouslySetInnerHTML={{ __html: formatMarkdown(text.substring(lastIndex, match.index)) }} />);
      }
      parts.push(
        <div key={`code-${match.index}`} className="my-6 rounded-xl overflow-hidden shadow-lg border border-[#30363d] bg-[#161b22]">
          <div className="flex items-center h-9 px-4 bg-[#21262d] border-b border-[#30363d]">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <span className="ml-4 text-xs text-[#8b949e] font-mono">{match[1] || 'code'}</span>
          </div>
          <SyntaxHighlighter
            language={match[1] || 'javascript'}
            style={vscDarkPlus}
            customStyle={{ margin: 0, padding: '18px 20px', fontSize: '13.5px', lineHeight: '1.7', overflowX: 'auto', background: 'transparent' }}
            wrapLongLines={false}
          >
            {match[2]}
          </SyntaxHighlighter>
        </div>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(<div key="text-end" className="text-[#8b949e] leading-7 text-[15px]" dangerouslySetInnerHTML={{ __html: formatMarkdown(text.substring(lastIndex)) }} />);
    return parts;
  };

  const formatMarkdown = (text: string) => {
    let html = text
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-[#f0f6fc] mt-8 mb-4">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-[#f0f6fc] mt-10 mb-4 pb-2 border-b border-[#30363d]" id="$1">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-[#f0f6fc] mt-10 mb-4">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#f0f6fc] font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-[#21262d] text-[#f0883e] rounded text-sm font-mono">$1</code>')
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-[#58a6ff] pl-4 my-4 text-[#8b949e] italic">$1</blockquote>')
      .replace(/^---$/gm, '<hr class="border-[#30363d] my-8" />')
      .replace(/^- (.+)$/gm, '<li class="text-[#8b949e] mb-2">$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li class="text-[#8b949e] mb-2"><span class="text-[#f0f6fc] font-medium">$1.</span> $2</li>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-[#8b949e] leading-7">')
      .replace(/^/, '<p class="mb-4 text-[#8b949e] leading-7">')
      .replace(/$/, '</p>');

    html = html.replace(/<p class="mb-4 text-\[#8b949e\] leading-7"><\/p>/g, '');
    return html;
  };

  const scrollToHeading = (text: string) => {
    const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
    const element = document.getElementById(text);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 前后篇文章
  const allLogs = useMemo(() => data.flatMap(day => day.logs.map(log => ({ ...log, date: day.date }))), [data]);
  const currentIndex = allLogs.findIndex(log => log.id === activeLogId);
  const prevLog = currentIndex > 0 ? allLogs[currentIndex - 1] : null;
  const nextLog = currentIndex < allLogs.length - 1 ? allLogs[currentIndex + 1] : null;

  return (
    <div className="flex min-h-screen bg-[#0d1117]">
      {/* 阅读进度条 */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-[#161b22]">
        <div
          className="h-full bg-gradient-to-r from-[#238636] to-[#58a6ff] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* =========== 侧边栏导航区 =========== */}
      <aside className="w-72 bg-[#010409] border-r border-[#30363d] flex flex-col shrink-0">
        {/* Logo 区域 */}
        <div className="p-5 border-b border-[#21262d]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#238636] to-[#2ea043] flex items-center justify-center shadow-lg shadow-green-500/20">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#f0f6fc] tracking-tight">ZH's DEV LOG</h1>
              <p className="text-xs text-[#8b949e]">技术学习笔记</p>
            </div>
          </div>

          {/* 搜索框 */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#484f58]" />
            <input
              type="text"
              placeholder="搜索文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-sm text-[#f0f6fc] placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#484f58] hover:text-[#8b949e]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 导航按钮 - 红蓝渐变 */}
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gradient-to-r from-[#dc2626] to-[#2563eb] hover:from-[#ef4444] hover:to-[#3b82f6] text-white rounded-lg transition-all font-medium text-sm shadow-lg shadow-red-500/20"
          >
            <Activity className="w-4 h-4" />
            <span>战术情报大屏</span>
          </Link>
        </div>

        {/* 标签筛选 - 可展开/收缩 */}
        <div className="px-4 py-3 border-b border-[#21262d]">
          <button
            onClick={() => setTagsExpanded(!tagsExpanded)}
            className="w-full flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-[#484f58]" />
              <span className="text-xs text-[#484f58]">标签筛选</span>
              <span className="text-xs text-[#484f58]">({allTags.length})</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#484f58] transition-transform ${tagsExpanded ? 'rotate-180' : ''}`} />
          </button>

          {tagsExpanded && (
            <>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-2 py-1 text-xs rounded-md transition-all ${
                      selectedTag === tag
                        ? 'bg-[#58a6ff] text-white'
                        : 'bg-[#161b22] text-[#8b949e] hover:text-[#f0f6fc] border border-[#30363d]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* 自定义标签管理 */}
              <div className="pt-2 border-t border-[#21262d]">
                {showTagEditor ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="新标签名"
                      className="flex-1 px-2 py-1 bg-[#161b22] border border-[#30363d] rounded text-xs text-[#f0f6fc] placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff]"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-2 py-1 bg-[#238636] text-white text-xs rounded hover:bg-[#2ea043]"
                    >
                      添加
                    </button>
                    <button
                      onClick={() => setShowTagEditor(false)}
                      className="px-2 py-1 bg-[#21262d] text-[#8b949e] text-xs rounded hover:text-[#f0f6fc]"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowTagEditor(true)}
                    className="text-xs text-[#58a6ff] hover:underline"
                  >
                    + 管理自定义标签
                  </button>
                )}

                {customTags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {customTags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#21262d] text-[#8b949e] text-xs rounded">
                        {tag}
                        <button
                          onClick={() => handleDeleteTag(tag)}
                          className="text-[#484f58] hover:text-[#f85149]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {!tagsExpanded && (
            <div className="flex flex-wrap gap-1.5">
              {allTags.slice(0, 5).map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-2 py-1 text-xs rounded-md transition-all ${
                    selectedTag === tag
                      ? 'bg-[#58a6ff] text-white'
                      : 'bg-[#161b22] text-[#8b949e] hover:text-[#f0f6fc] border border-[#30363d]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 笔记列表 */}
        <div className="flex-1 overflow-y-auto p-4">
          {searchQuery || selectedTag ? (
            // 搜索/标签筛选结果
            <div className="space-y-1">
              <div className="text-xs text-[#484f58] mb-3">
                找到 {filteredLogs.length} 篇文章
              </div>
              {filteredLogs.map(log => (
                <button
                  key={log.id}
                  onClick={() => {
                    setActiveLogId(log.id);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-start gap-2.5 group ${
                    activeLogId === log.id
                      ? 'bg-[#161b22] text-[#f0f6fc]'
                      : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#161b22]/50'
                  }`}
                >
                  <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${activeLogId === log.id ? 'text-[#58a6ff]' : 'text-[#484f58]'}`} />
                  <div>
                    <div className="line-clamp-2">{log.title.replace(/^[^\w]+/, '')}</div>
                    <div className="text-xs text-[#484f58] mt-1">{log.date}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            // 默认按日期分组
            data.map(day => {
              const isDateExpanded = expandedDates.includes(day.date);
              const containsActiveLog = day.logs.some(log => log.id === activeLogId);

              return (
                <div key={day.date} className="mb-4">
                  <button
                    onClick={() => toggleDateExpand(day.date)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${containsActiveLog ? 'text-[#58a6ff]' : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#161b22]'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{day.date}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDateExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isDateExpanded && (
                    <div className="mt-1 space-y-0.5 pl-2">
                      {day.logs.map(log => (
                        <button
                          key={log.id}
                          onClick={() => setActiveLogId(log.id)}
                          className={`relative w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-start gap-2.5 group ${
                            activeLogId === log.id
                              ? 'bg-[#161b22] text-[#f0f6fc]'
                              : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#161b22]/50'
                          }`}
                        >
                          <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${activeLogId === log.id ? 'text-[#58a6ff]' : 'text-[#484f58]'}`} />
                          <span className="line-clamp-2">{log.title.replace(/^[^\w]+/, '')}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 底部信息 */}
        <div className="p-4 border-t border-[#21262d]">
          <div className="flex items-center justify-center gap-4 text-[#484f58]">
            <a href="#" className="hover:text-[#8b949e] transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </aside>

      {/* =========== 主内容展示区 =========== */}
      <main className="flex-1 overflow-y-auto bg-[#0d1117]">
        <div className="max-w-3xl mx-auto px-8 py-12">
          {activeData ? (
            <div className="animate-fadeIn">
              {/* 文章头部 */}
              <header className="mb-10 pb-8 border-b border-[#21262d]">
                <div className="flex items-center gap-3 text-sm mb-4 flex-wrap">
                  <span className="px-2.5 py-1 bg-[#161b22] text-[#8b949e] rounded-md border border-[#30363d] text-xs">{activeData.date}</span>
                  <span className="text-[#484f58]">•</span>
                  <span className="text-[#8b949e] font-mono text-xs">{activeData.log.time}</span>
                  {activeData.log.tags && (
                    <>
                      <span className="text-[#484f58]">•</span>
                      <div className="flex gap-1.5 items-center">
                        {activeData.log.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#21262d] text-[#58a6ff] text-xs rounded group">
                            {tag}
                            <button
                              onClick={() => handleRemoveTagFromCurrentPost(tag)}
                              className="opacity-0 group-hover:opacity-100 text-[#484f58] hover:text-[#f85149] transition-all"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        <button
                          onClick={() => setShowAddTagToPost(!showAddTagToPost)}
                          className="px-2 py-0.5 bg-[#21262d] text-[#484f58] hover:text-[#58a6ff] text-xs rounded transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </>
                  )}
                  {!activeData.log.tags && (
                    <button
                      onClick={() => setShowAddTagToPost(!showAddTagToPost)}
                      className="px-2 py-0.5 bg-[#21262d] text-[#484f58] hover:text-[#58a6ff] text-xs rounded transition-colors"
                    >
                      + 添加标签
                    </button>
                  )}
                </div>

                {/* 添加标签下拉菜单 */}
                {showAddTagToPost && (
                  <div className="mb-4 p-3 bg-[#161b22] border border-[#30363d] rounded-lg">
                    <div className="text-xs text-[#8b949e] mb-2">选择标签添加到文章：</div>
                    <div className="flex flex-wrap gap-1.5">
                      {allTags.filter(tag => !activeData.log.tags?.includes(tag)).map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            handleAddTagToCurrentPost(tag);
                            setShowAddTagToPost(false);
                          }}
                          className="px-2 py-1 text-xs bg-[#21262d] text-[#8b949e] hover:text-[#58a6ff] hover:border-[#58a6ff] border border-[#30363d] rounded transition-all"
                        >
                          + {tag}
                        </button>
                      ))}
                      {customTags.filter(tag => !activeData.log.tags?.includes(tag)).length === 0 && allTags.filter(tag => !activeData.log.tags?.includes(tag)).length === 0 && (
                        <span className="text-xs text-[#484f58]">暂无可用标签，请在侧边栏添加自定义标签</span>
                      )}
                    </div>
                  </div>
                )}

                {/* 标题编辑 */}
                {isEditingTitle ? (
                  <div className="flex gap-2 items-start">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-xl md:text-2xl font-bold text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                    />
                    <button
                      onClick={handleSaveTitle}
                      className="p-2 bg-[#238636] text-white rounded-lg hover:bg-[#2ea043]"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancelEditTitle}
                      className="p-2 bg-[#21262d] text-[#8b949e] rounded-lg hover:text-[#f0f6fc]"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 group">
                    <h1 className="flex-1 text-2xl md:text-3xl font-bold text-[#f0f6fc] tracking-tight leading-tight">
                      {activeData.log.title}
                    </h1>
                    <button
                      onClick={handleStartEditTitle}
                      className="opacity-0 group-hover:opacity-100 p-2 text-[#484f58] hover:text-[#58a6ff] transition-all"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </header>

              {/* 文章目录 */}
              {toc.length > 0 && (
                <div className="mb-8 p-4 bg-[#161b22] rounded-xl border border-[#30363d]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-[#f0f6fc]">目录</h3>
                    <button
                      onClick={() => setShowToc(!showToc)}
                      className="text-[#484f58] hover:text-[#8b949e] transition-colors"
                    >
                      {showToc ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                  {showToc && (
                    <nav className="space-y-1">
                      {toc.filter(item => item.level > 1).map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => scrollToHeading(item.text)}
                          className={`block w-full text-left text-sm text-[#8b949e] hover:text-[#58a6ff] transition-colors truncate ${item.level === 3 ? 'pl-4' : ''}`}
                        >
                          {item.text}
                        </button>
                      ))}
                    </nav>
                  )}
                </div>
              )}

              {/* 文章内容 */}
              <article ref={contentRef} className="prose prose-invert max-w-none">
                {renderFormattedContent(activeData.log.content)}
              </article>

              {/* 底部导航 */}
              <footer className="mt-16 pt-8 border-t border-[#21262d]">
                <div className="flex justify-between text-sm">
                  {prevLog ? (
                    <button
                      onClick={() => setActiveLogId(prevLog.id)}
                      className="text-[#8b949e] hover:text-[#58a6ff] transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="truncate max-w-[200px]">{prevLog.title.replace(/^[^\w]+/, '')}</span>
                    </button>
                  ) : <div />}
                  {nextLog ? (
                    <button
                      onClick={() => setActiveLogId(nextLog.id)}
                      className="text-[#8b949e] hover:text-[#58a6ff] transition-colors flex items-center gap-2"
                    >
                      <span className="truncate max-w-[200px]">{nextLog.title.replace(/^[^\w]+/, '')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : <div />}
                </div>
              </footer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-[#484f58]">
              请在左侧选择一篇笔记阅读
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
