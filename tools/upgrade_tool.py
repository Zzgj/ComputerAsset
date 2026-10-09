#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ComputerAsset 升级工具
独立 Windows 桌面 GUI（tkinter），用于将本地 deploy-package 升级包部署到远程服务器。
"""

import os
import json
import queue
import shutil
import threading
import subprocess
import tkinter as tk
from tkinter import ttk, filedialog, messagebox

# ─────────────────────────── 常量 ───────────────────────────

APP_TITLE = "ComputerAsset 升级工具"
DEFAULT_LOCAL = r"D:\ComputerAsset-server\ComputerAsset-LocalOnline\ComputerAsset\deploy-package"
WINDOW_SIZE = "760x640"

# robocopy 目录复制参数
ROBOCOPY_DIR_FLAGS = ["/e", "/nfl", "/ndl", "/njh", "/njs", "/nc", "/ns", "/np"]
# robocopy 退出码 0-7 均为成功
ROBOCOPY_SUCCESS_CODES = set(range(0, 8))

# 要复制的条目：(相对路径, 类型)  类型: "dir" / "file"
COPY_ITEMS = [
    (r"backend\dist", "dir"),
    (r"backend\prisma", "dir"),
    (r"backend\package.json", "file"),
    (r"backend\prisma.config.ts", "file"),
    (r"backend\node_modules", "dir"),
    (r"frontend\dist", "dir"),
    (r"upgrade.bat", "file"),
    (r"deploy.bat", "file"),
    (r"stop.bat", "file"),
    (r"restart.bat", "file"),
]

# 受保护、不覆盖的条目（仅作日志提示）
PROTECTED_ITEMS = [
    r"backend\data",
    r"backend\.env",
]

# robocopy 中各目录的近似权重（用于进度估算）
DIR_WEIGHTS = {
    r"backend\node_modules": 60,
    r"backend\dist": 10,
    r"backend\prisma": 5,
    r"frontend\dist": 15,
}
FILE_WEIGHT = 1
TOTAL_WEIGHT = sum(DIR_WEIGHTS.values()) + (len(COPY_ITEMS) - len(DIR_WEIGHTS)) * FILE_WEIGHT



# ─────────────────────────── 工具函数 ───────────────────────────


def norm(p):
    """标准化路径字符串（去掉两端空白和引号）。"""
    if not p:
        return ""
    return p.strip().strip('"').strip("'")


def read_version(base_path):
    """
    从 base_path/backend/package.json 读取版本号。
    返回 (version_str, error_msg)。成功时 error_msg 为 None。
    """
    base = norm(base_path)
    if not base:
        return None, "路径为空"
    pkg = os.path.join(base, "backend", "package.json")
    try:
        with open(pkg, "r", encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        return None, "找不到 backend/package.json"
    except json.JSONDecodeError as e:
        return None, f"解析失败: {e}"
    except OSError as e:
        return None, f"读取失败: {e}"
    ver = data.get("version", "")
    if not ver:
        return None, "package.json 中未找到 version 字段"
    return ver, None


def test_path_accessible(path):
    """测试路径是否可访问（存在且可读）。返回 (bool, msg)。"""
    p = norm(path)
    if not p:
        return False, "路径为空"
    try:
        if not os.path.exists(p):
            return False, "路径不存在"
        if not os.path.isdir(p):
            return False, "路径不是目录"
        os.listdir(p)  # 尝试列目录验证可读性
        return True, "连接成功"
    except OSError as e:
        return False, f"访问失败: {e}"


def robocopy_dir(src, dst, log_fn):
    """
    用 robocopy 复制目录。返回 True/False。
    log_fn(msg) 用于输出日志。
    """
    src = norm(src)
    dst = norm(dst)
    if not os.path.isdir(src):
        log_fn(f"  [跳过] 源目录不存在: {src}")
        return True  # 源不存在不算失败
    os.makedirs(dst, exist_ok=True)
    cmd = ["robocopy", src, dst] + ROBOCOPY_DIR_FLAGS
    log_fn(f"  robocopy \"{src}\" → \"{dst}\"")
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=3600)
    except FileNotFoundError:
        log_fn("  [错误] 未找到 robocopy（非 Windows 系统?）")
        return False
    except subprocess.TimeoutExpired:
        log_fn("  [错误] robocopy 超时（>60分钟）")
        return False
    except OSError as e:
        log_fn(f"  [错误] 启动失败: {e}")
        return False
    if proc.returncode in ROBOCOPY_SUCCESS_CODES:
        log_fn(f"  [完成] 退出码={proc.returncode}")
        return True
    else:
        stderr = (proc.stderr or "").strip()
        stdout = (proc.stdout or "").strip()
        detail = stderr or stdout or "未知错误"
        log_fn(f"  [失败] 退出码={proc.returncode}  {detail[:200]}")
        return False


def copy_single_file(src, dst, log_fn):
    """复制单个文件，返回 True/False。"""
    src = norm(src)
    dst = norm(dst)
    if not os.path.isfile(src):
        log_fn(f"  [跳过] 源文件不存在: {src}")
        return True  # 源不存在不算失败
    try:
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)
        log_fn(f"  [已复制] {os.path.basename(src)}")
        return True
    except OSError as e:
        log_fn(f"  [失败] {os.path.basename(src)}: {e}")
        return False



# ─────────────────────────── GUI 应用 ───────────────────────────


class UpgradeToolApp:
    def __init__(self, root):
        self.root = root
        self.root.title(APP_TITLE)
        self.root.geometry(WINDOW_SIZE)
        self.root.minsize(660, 580)

        # 状态变量
        self.local_var = tk.StringVar()
        self.server_var = tk.StringVar()
        self.local_version = None
        self.server_version = None
        self.server_accessible = False
        self.upgrading = False
        self.msg_queue = queue.Queue()
        self.worker_thread = None

        # ── 样式 ──
        style = ttk.Style()
        try:
            style.theme_use("clam")
        except tk.TclError:
            pass
        style.configure("Title.TLabel", font=("Microsoft YaHei", 14, "bold"))
        style.configure("Header.TLabel", font=("Microsoft YaHei", 10, "bold"))
        style.configure("Status.TLabel", font=("Microsoft YaHei", 9))
        style.configure("Accent.TButton", font=("Microsoft YaHei", 10, "bold"))
        style.configure("Big.TButton", font=("Microsoft YaHei", 11, "bold"))

        self._build_ui()
        self._poll_queue()

        # 初始化默认本地路径
        self.local_var.set(DEFAULT_LOCAL)
        self._on_local_change()

    # ─────────────── UI 构建 ───────────────

    def _build_ui(self):
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(5, weight=1)  # 日志区域可拉伸

        # ── 标题 ──
        title = ttk.Label(self.root, text=APP_TITLE, style="Title.TLabel",
                          anchor="center")
        title.grid(row=0, column=0, sticky="ew", padx=10, pady=(8, 2))

        # ── Row 1: 本地路径 ──
        lf_local = ttk.LabelFrame(self.root, text="本地升级包路径")
        lf_local.grid(row=1, column=0, sticky="ew", padx=10, pady=4)
        lf_local.columnconfigure(0, weight=1)

        self.local_entry = ttk.Entry(lf_local, textvariable=self.local_var)
        self.local_entry.grid(row=0, column=0, sticky="ew", padx=(8, 4), pady=6)
        ttk.Button(lf_local, text="浏览…",
                   command=self._browse_local).grid(row=0, column=1, padx=(0, 8), pady=6)

        # ── Row 2: 服务器路径 ──
        lf_server = ttk.LabelFrame(self.root, text="服务器部署路径")
        lf_server.grid(row=2, column=0, sticky="ew", padx=10, pady=4)
        lf_server.columnconfigure(0, weight=1)

        self.server_entry = ttk.Entry(lf_server, textvariable=self.server_var)
        self.server_entry.grid(row=0, column=0, sticky="ew", padx=(8, 4), pady=6)
        self.server_entry.bind("<KeyRelease>", lambda e: self._on_server_change())
        ttk.Button(lf_server, text="测试连接",
                   command=self._test_connection).grid(row=0, column=1, padx=(0, 8), pady=6)

        # ── Row 3: 版本对比 ──
        lf_ver = ttk.LabelFrame(self.root, text="版本对比")
        lf_ver.grid(row=3, column=0, sticky="ew", padx=10, pady=4)
        lf_ver.columnconfigure(1, weight=1)
        lf_ver.columnconfigure(3, weight=1)

        ttk.Label(lf_ver, text="本地:").grid(row=0, column=0, padx=(8, 4), pady=6, sticky="e")
        self.local_ver_label = ttk.Label(lf_ver, text="—", style="Header.TLabel",
                                         foreground="#555555")
        self.local_ver_label.grid(row=0, column=1, sticky="w", padx=4, pady=6)

        ttk.Label(lf_ver, text="服务器:").grid(row=0, column=2, padx=(8, 4), pady=6, sticky="e")
        self.server_ver_label = ttk.Label(lf_ver, text="—", style="Header.TLabel",
                                          foreground="#555555")
        self.server_ver_label.grid(row=0, column=3, sticky="w", padx=(4, 8), pady=6)

        # ── Row 4: 进度条 ──
        lf_prog = ttk.LabelFrame(self.root, text="升级进度")
        lf_prog.grid(row=4, column=0, sticky="ew", padx=10, pady=4)
        lf_prog.columnconfigure(0, weight=1)

        self.progress = ttk.Progressbar(lf_prog, mode="determinate",
                                        maximum=100, value=0)
        self.progress.grid(row=0, column=0, sticky="ew", padx=8, pady=(6, 2))
        self.status_label = ttk.Label(lf_prog, text="就绪", style="Status.TLabel")
        self.status_label.grid(row=1, column=0, sticky="w", padx=8, pady=(0, 6))

        # ── Row 5: 日志 ──
        lf_log = ttk.LabelFrame(self.root, text="操作日志")
        lf_log.grid(row=5, column=0, sticky="nsew", padx=10, pady=4)
        lf_log.columnconfigure(0, weight=1)
        lf_log.rowconfigure(0, weight=1)

        self.log_text = tk.Text(lf_log, wrap="word", state="disabled",
                                font=("Consolas", 9), bg="#1e1e1e", fg="#cccccc",
                                insertbackground="#cccccc", relief="flat")
        self.log_text.grid(row=0, column=0, sticky="nsew", padx=(8, 0), pady=6)
        log_scroll = ttk.Scrollbar(lf_log, orient="vertical",
                                   command=self.log_text.yview)
        log_scroll.grid(row=0, column=1, sticky="ns", pady=6)
        self.log_text.config(yscrollcommand=log_scroll.set)

        # ── 底部按钮栏 + 状态 ──
        bottom = ttk.Frame(self.root)
        bottom.grid(row=6, column=0, sticky="ew", padx=10, pady=(4, 8))
        bottom.columnconfigure(1, weight=1)

        self.upgrade_btn = ttk.Button(bottom, text="▶ 一键升级", style="Big.TButton",
                                      command=self._start_upgrade, state="disabled")
        self.upgrade_btn.grid(row=0, column=0, padx=(0, 8), pady=4, sticky="w")
        self.bottom_status = ttk.Label(bottom, text="就绪", style="Status.TLabel",
                                       anchor="e")
        self.bottom_status.grid(row=0, column=1, sticky="e", padx=8, pady=4)


    # ─────────────── 日志 ───────────────

    def log(self, msg):
        """向队列推送日志消息（线程安全）。"""
        self.msg_queue.put(("log", msg))

    def _flush_log(self, msg):
        """在主线程中将消息写入 Text 控件。"""
        self.log_text.config(state="normal")
        self.log_text.insert("end", msg + "\n")
        self.log_text.see("end")
        self.log_text.config(state="disabled")

    def _set_status(self, msg):
        """设置底部状态栏（线程安全，通过队列）。"""
        self.msg_queue.put(("status", msg))

    def _set_progress(self, value):
        """设置进度条（线程安全，通过队列）。"""
        self.msg_queue.put(("progress", value))

    def _set_bottom_status(self, msg):
        self.msg_queue.put(("bottom", msg))

    # ─────────────── 队列轮询 ───────────────

    def _poll_queue(self):
        """定期检查消息队列，在主线程更新 GUI。"""
        try:
            while True:
                kind, data = self.msg_queue.get_nowait()
                if kind == "log":
                    self._flush_log(data)
                elif kind == "status":
                    self.status_label.config(text=data)
                elif kind == "progress":
                    self.progress.config(value=data)
                elif kind == "bottom":
                    self.bottom_status.config(text=data)
                elif kind == "version_local":
                    self.local_version = data
                    self.local_ver_label.config(text=data or "未知")
                    self._update_version_colors()
                    self._update_upgrade_button()
                elif kind == "version_server":
                    self.server_version = data
                    self.server_ver_label.config(text=data or "未知")
                    self._update_version_colors()
                    self._update_upgrade_button()
                elif kind == "server_ok":
                    self.server_accessible = data
                    self._update_upgrade_button()
                elif kind == "upgrade_done":
                    self.upgrading = False
                    self.upgrade_btn.config(state="normal")
                    self._set_progress(100)
                    self._set_status("升级完成")
                    self._set_bottom_status("完成")
                    if data:
                        messagebox.showinfo("升级完成", data)
                elif kind == "upgrade_error":
                    self.upgrading = False
                    self.upgrade_btn.config(state="normal")
                    self._set_status("升级失败")
                    self._set_bottom_status("失败")
                    if data:
                        messagebox.showerror("升级失败", data)
        except queue.Empty:
            pass
        self.root.after(150, self._poll_queue)

    # ─────────────── 版本对比 ───────────────

    def _update_version_colors(self):
        """根据本地/服务器版本是否一致，更新颜色。"""
        lv = self.local_version
        sv = self.server_version
        if lv and sv:
            if lv == sv:
                self.local_ver_label.config(foreground="#228B22")   # 绿色
                self.server_ver_label.config(foreground="#228B22")
            else:
                self.local_ver_label.config(foreground="#007ACC")   # 蓝色（较新）
                self.server_ver_label.config(foreground="#CC0000")   # 红色（较旧）
        else:
            self.local_ver_label.config(foreground="#555555")
            self.server_ver_label.config(foreground="#555555")

    def _update_upgrade_button(self):
        """根据状态决定升级按钮是否可用。"""
        if self.upgrading:
            self.upgrade_btn.config(state="disabled")
            return
        ok = (
            self.local_version is not None
            and self.server_accessible
            and self.local_var.get().strip() != ""
            and self.server_var.get().strip() != ""
        )
        # 版本不同时可升级；版本相同时也允许强制升级
        self.upgrade_btn.config(state="normal" if ok else "disabled")


    # ─────────────── 事件处理 ───────────────

    def _browse_local(self):
        d = filedialog.askdirectory(title="选择本地 deploy-package 目录",
                                    initialdir=self.local_var.get() or DEFAULT_LOCAL)
        if d:
            self.local_var.set(d)
            self._on_local_change()

    def _on_local_change(self):
        """本地路径变化时读取版本。"""
        path = self.local_var.get().strip()
        if not path:
            self.local_version = None
            self.local_ver_label.config(text="—")
            self._update_version_colors()
            self._update_upgrade_button()
            return
        ver, err = read_version(path)
        if ver:
            self.local_version = ver
            self.local_ver_label.config(text=ver)
            self.log(f"本地版本: {ver}")
        else:
            self.local_version = None
            self.local_ver_label.config(text="未知")
            self.log(f"[警告] 本地版本读取失败: {err}")
        self._update_version_colors()
        self._update_upgrade_button()

    def _on_server_change(self):
        """服务器路径变化时重置状态。"""
        self.server_accessible = False
        self.server_version = None
        self.server_ver_label.config(text="—")
        self._update_version_colors()
        self._update_upgrade_button()

    def _test_connection(self):
        """测试服务器路径连通性，并读取服务器版本。"""
        path = self.server_var.get().strip()
        if not path:
            messagebox.showwarning("提示", "请输入服务器路径")
            return
        self._set_status("正在测试连接…")
        self._set_bottom_status("测试中…")
        self.log(f"测试连接: {path}")

        def worker():
            ok, msg = test_path_accessible(path)
            self.msg_queue.put(("server_ok", ok))
            if ok:
                self.log(f"  [OK] {msg}")
                self._set_status("连接成功，读取版本…")
                ver, verr = read_version(path)
                if ver:
                    self.msg_queue.put(("version_server", ver))
                    self.log(f"  服务器版本: {ver}")
                else:
                    self.msg_queue.put(("version_server", None))
                    self.log(f"  [警告] 服务器版本读取失败: {verr}")
            else:
                self.log(f"  [失败] {msg}")
                self.msg_queue.put(("version_server", None))
                self._set_status("连接失败")
                self._set_bottom_status("连接失败")
            self._set_bottom_status("就绪" if ok else "连接失败")

        t = threading.Thread(target=worker, daemon=True)
        t.start()


    # ─────────────── 升级 ───────────────

    def _start_upgrade(self):
        """启动升级流程。"""
        local = self.local_var.get().strip()
        server = self.server_var.get().strip()
        if not local or not server:
            messagebox.showwarning("提示", "请先填写本地路径和服务器路径")
            return

        # 确认
        lv = self.local_version or "未知"
        sv = self.server_version or "未知"
        msg = (
            f"确认执行升级？\n\n"
            f"本地路径:   {local}\n"
            f"  版本: {lv}\n"
            f"服务器路径: {server}\n"
            f"  版本: {sv}\n\n"
            f"将覆盖服务器上的文件（保留 data 和 .env）。\n"
            f"复制 node_modules 可能需要数分钟。"
        )
        if not messagebox.askyesno("确认升级", msg):
            return

        self.upgrading = True
        self.upgrade_btn.config(state="disabled")
        self._set_progress(0)
        self._set_status("升级中…")
        self._set_bottom_status("升级中…")
        self.log("=" * 50)
        self.log("开始升级")
        self.log(f"  本地:   {local}")
        self.log(f"  服务器: {server}")
        self.log(f"  本地版本: {lv}")
        self.log(f"  服务器版本: {sv}")

        self.worker_thread = threading.Thread(
            target=self._upgrade_worker, args=(local, server), daemon=True
        )
        self.worker_thread.start()

    def _upgrade_worker(self, local, server):
        """后台线程: 执行实际复制操作。"""
        local = norm(local)
        server = norm(server)

        # 提示受保护项
        for item in PROTECTED_ITEMS:
            protected = os.path.join(server, item)
            self.log(f"[保护] 不覆盖: {item}  ({'存在' if os.path.exists(protected) else '不存在'})")

        cumulative = 0

        for rel, kind in COPY_ITEMS:
            src = os.path.join(local, rel)
            dst = os.path.join(server, rel)

            self.log(f"\n[{COPY_ITEMS.index((rel, kind)) + 1}/{len(COPY_ITEMS)}] {rel} ({kind})")
            self._set_status(f"复制: {rel}")

            if kind == "dir":
                ok = robocopy_dir(src, dst, self.log)
            else:
                ok = copy_single_file(src, dst, self.log)

            if not ok:
                self.log(f"[中止] 复制 {rel} 失败，升级终止")
                self.msg_queue.put(("upgrade_error", f"复制 {rel} 失败"))
                return

            # 更新进度
            if kind == "dir":
                cumulative += DIR_WEIGHTS.get(rel, FILE_WEIGHT)
            else:
                cumulative += FILE_WEIGHT
            pct = int(cumulative / TOTAL_WEIGHT * 100)
            self._set_progress(pct)

        self.log("\n" + "=" * 50)
        self.log("所有文件复制完成!")
        self._set_progress(100)

        # 验证服务器版本
        new_ver, _ = read_version(server)
        self.msg_queue.put(("version_server", new_ver))
        if new_ver:
            self.log(f"服务器新版本: {new_ver}")
        else:
            self.log("[警告] 升级后无法读取服务器版本")

        # 提示运行 upgrade.bat
        hint = (
            "升级文件复制完成！\n\n"
            "请前往服务器执行以下步骤：\n"
            "  1. 以管理员身份打开 CMD\n"
            f"  2. cd /d \"{server}\"\n"
            "  3. 运行 upgrade.bat\n"
            "  4. 等待服务重启完成\n\n"
            f"服务器路径: {server}"
        )
        self.log(hint)
        self.msg_queue.put(("upgrade_done", hint))


# ─────────────────────────── 入口 ───────────────────────────


def main():
    root = tk.Tk()
    app = UpgradeToolApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()

