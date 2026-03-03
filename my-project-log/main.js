const { app, BrowserWindow } = require('electron');

function createWindow () {
  // 创建一个无边框、暗黑风格的桌面应用窗口
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    title: "GLOBAL RADAR - 私人战略智库",
    backgroundColor: '#0A0A0A', // 暗黑背景，防止加载时闪白光
    autoHideMenuBar: true,      // 隐藏顶部的传统菜单栏，更具科技感
    webPreferences: {
      nodeIntegration: true
    }
  });

  // 核心逻辑：让这个桌面窗口去“套壳”加载你本地的 Next.js 页面
  win.loadURL('http://localhost:3000/dashboard');
}

// 当 Electron 引擎准备就绪时，弹出软件窗口
app.whenReady().then(createWindow);

// 当所有窗口被关闭时，彻底退出软件
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});