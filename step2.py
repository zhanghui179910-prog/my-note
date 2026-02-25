import tkinter as tk
import datetime
class App():
    def __init__(self,root):
        self.root = root
        self.state = "idle"
        self.build_ui()

    def build_ui(self):
        # 顶部状态区
        self.top_frame = tk.Frame(self.root)
        self.top_frame.pack(fill="x",pady=5)

        self.state_label = tk.Label(self.top_frame,text=f"state:{self.state}")
        self.state_label.pack(padx=5)

        # 控制按钮区
        self.contro_frame = tk.Frame(self.root)
        self.contro_frame.pack(padx=5)

        self.start_btn = tk.Button(self.contro_frame,command=self.start,text="Start")
        self.start_btn.pack(padx=5)

        self.stop_btn = tk.Button(self.contro_frame,command=self.stop,text="stop")
        self.stop_btn.pack(padx=5)

        self.clear_btn = tk.Button(self.contro_frame,command=self.clear_log,text="clear")
        self.clear_btn.pack(padx=5)

        self.text_btn = tk.Button(self.contro_frame,text="Text",command=self.test_log)
        self.text_btn.pack(padx=5)


        # 日志区
        self.log_frame = tk.Frame(self.root)
        self.log_frame.pack(fill="both",expand=True,padx=10,pady=10)
        # 创建滚动条
        self.srcollbar = tk.Scrollbar(self.log_frame)
        self.srcollbar.pack(side="right",fill="y")
        # 创建文本框
        self.log_text = tk.Text(self.log_frame)
        self.log_text.pack(fill="both",expand=True)
        # 绑定滚动条控制文本：
        self.srcollbar.config(command=self.log_text.yview)

    def start (self):
        self.state = "running"
        self.state_label.config(text=f"state:{self.state}")
        self.log("Started")
        self.auto_log() # 自动日志

    def stop (self):
        self.state = "stopped"
        self.state_label.config(text=f"state:{self.state}")
        self.log("Stoped")

    def clear_log(self):
        self.log_text.delete("1.0", "end")

    def log(self, message):
        now = datetime.datetime.now().strftime("%H:%M:%S")
        formatted_message = f"[{now}] {message}"
        self.log_text.insert("end", formatted_message + "\n")
        self.log_text.see("end")
        with open("app_log.txt","a") as f:
            f.write(formatted_message + "\n")
        print(datetime.datetime.now())
    
    def test_log(self):
        for i in range(5):
            self.log(f"Test Message {i}")
        
    def auto_log(self):
        if self.state == "running":
            self.log("Auto log message")
            self.root.after(000,self.auto_log) # 每两秒打印一次
root = tk.Tk()
root.title("Mession")
root.geometry("420x420")
app = App(root)
root.mainloop()