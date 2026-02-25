import tkinter as tk
root = tk.Tk()
root.title("Mession")
root.geometry("400x400")
state = "idle"
state_label = tk.Label(root,text=f"当前状态:{state}")
state_label.pack(pady=10)
def start():
    pass
def pause():
    pass
def stop():
    pass

tk.Button(root,text="开始",command=start).pack(pady=10)
tk.Button(root,text="暂停",command=pause).pack(pady=10)
tk.Button(root,text="停止",command=stop).pack(pady=2)
root.mainloop()