import tkinter as tk
import threading
import time


class AutoTaskPanel:
    def __init__(self, root):
        self.root = root
        self.root.title("自动化任务控制面板")

        # ===== 状态 =====
        self.state = "idle"
        self.running = False

        # ===== 统计 =====
        self.finished_count = 0

        # ===== UI =====
        self.state_label = tk.Label(root, text="当前状态：idle", font=("Arial", 12))
        self.state_label.pack(pady=10)

        self.count_label = tk.Label(root, text="完成次数：0", font=("Arial", 12))
        self.count_label.pack(pady=5)

        btn_frame = tk.Frame(root)
        btn_frame.pack(pady=10)

        self.start_btn = tk.Button(btn_frame, text="启动", width=10, command=self.start_task)
        self.start_btn.grid(row=0, column=0, padx=5)

        self.pause_btn = tk.Button(btn_frame, text="暂停", width=10, command=self.pause_task)
        self.pause_btn.grid(row=0, column=1, padx=5)

        self.stop_btn = tk.Button(btn_frame, text="停止", width=10, command=self.stop_task)
        self.stop_btn.grid(row=0, column=2, padx=5)

    # ===== 状态更新 =====
    def update_ui(self):
        self.state_label.config(text=f"当前状态：{self.state}")
        self.count_label.config(text=f"完成次数：{self.finished_count}")

    # ===== 控制逻辑 =====
    def start_task(self):
        if self.state == "running":
            return

        self.state = "running"
        self.running = True
        self.update_ui()

        # 子线程跑任务（防止界面卡死）
        threading.Thread(target=self.task_loop, daemon=True).start()

    def pause_task(self):
        if self.state == "running":
            self.state = "paused"
            self.update_ui()

    def stop_task(self):
        self.state = "stopped"
        self.running = False
        self.update_ui()

    # ===== 模拟任务 =====
    def task_loop(self):
        while self.running:
            if self.state == "paused":
                time.sleep(0.2)
                continue

            if self.state == "stopped":
                break

            # 模拟一次“任务执行”
            time.sleep(1)
            self.finished_count += 1
            self.update_ui()

        self.state = "idle"
        self.update_ui()


if __name__ == "__main__":
    root = tk.Tk()
    root.geometry("320x200")
    AutoTaskPanel(root)
    root.mainloop()
