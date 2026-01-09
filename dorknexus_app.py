#!/usr/bin/env python3
"""
DorkNexus - Advanced Google Dorking & OSINT Toolkit
Desktop Application built with tkinter
"""

import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext, filedialog
import json
import os
import webbrowser
import threading
from datetime import datetime
from pathlib import Path
import sys

try:
    import google.generativeai as genai
except ImportError:
    genai = None

# Configuration
APP_NAME = "DorkNexus"
VERSION = "2.0.0"
VAULT_FILE = "nexus_vault.json"
CONFIG_FILE = "dorknexus_config.json"

# Color Scheme (Dark Theme)
COLORS = {
    'bg_dark': '#0f172a',
    'bg_darker': '#0b1120',
    'primary': '#3b82f6',
    'success': '#10b981',
    'warning': '#f59e0b',
    'danger': '#ef4444',
    'text': '#e2e8f0',
    'text_muted': '#94a3b8',
    'border': '#1e293b',
    'cyan': '#06b6d4',
    'purple': '#a855f7',
    'emerald': '#10b981',
    'orange': '#f97316',
    'pink': '#ec4899',
    'amber': '#f59e0b'
}

class DorkNexusApp:
    """Main application class"""

    def __init__(self, root):
        self.root = root
        self.root.title(f"{APP_NAME} v{VERSION}")
        self.root.geometry("1200x800")
        self.root.configure(bg=COLORS['bg_dark'])

        # Application state
        self.current_dork = tk.StringVar(value="")
        self.api_key = tk.StringVar(value="")
        self.vault_items = []
        self.templates = self.load_templates()

        # Load configuration
        self.load_config()

        # Initialize Gemini if available
        self.init_gemini()

        # Build UI
        self.create_header()
        self.create_dork_preview()
        self.create_notebook()
        self.create_footer()

        # Load vault data
        self.load_vault()

    def init_gemini(self):
        """Initialize Gemini API"""
        if genai and self.api_key.get():
            try:
                genai.configure(api_key=self.api_key.get())
                self.gemini_available = True
            except Exception as e:
                print(f"Gemini initialization failed: {e}")
                self.gemini_available = False
        else:
            self.gemini_available = False

    def create_header(self):
        """Create application header"""
        header = tk.Frame(self.root, bg=COLORS['bg_darker'], height=80)
        header.pack(fill=tk.X, pady=0)
        header.pack_propagate(False)

        # Logo and title
        title_frame = tk.Frame(header, bg=COLORS['bg_darker'])
        title_frame.pack(side=tk.LEFT, padx=20, pady=15)

        logo_label = tk.Label(
            title_frame,
            text="🔍",
            font=('Arial', 24),
            bg=COLORS['bg_darker'],
            fg=COLORS['text']
        )
        logo_label.pack(side=tk.LEFT)

        title_label = tk.Label(
            title_frame,
            text=f"{APP_NAME} v{VERSION}",
            font=('Arial', 18, 'bold'),
            bg=COLORS['bg_darker'],
            fg=COLORS['cyan']
        )
        title_label.pack(side=tk.LEFT, padx=10)

        # API Key button
        api_frame = tk.Frame(header, bg=COLORS['bg_darker'])
        api_frame.pack(side=tk.RIGHT, padx=20)

        api_btn = tk.Button(
            api_frame,
            text="⚙️ API Settings",
            command=self.show_api_settings,
            bg=COLORS['primary'],
            fg='white',
            font=('Arial', 10),
            relief=tk.FLAT,
            padx=15,
            pady=8,
            cursor='hand2'
        )
        api_btn.pack()

    def create_dork_preview(self):
        """Create sticky dork preview bar"""
        preview_frame = tk.Frame(self.root, bg=COLORS['border'], height=50)
        preview_frame.pack(fill=tk.X, pady=(1, 0))
        preview_frame.pack_propagate(False)

        # Dork display
        dork_container = tk.Frame(preview_frame, bg=COLORS['bg_dark'])
        dork_container.pack(fill=tk.BOTH, expand=True, padx=2, pady=2)

        label = tk.Label(
            dork_container,
            text="Current Dork:",
            font=('Consolas', 10, 'bold'),
            bg=COLORS['bg_dark'],
            fg=COLORS['text_muted']
        )
        label.pack(side=tk.LEFT, padx=10)

        self.dork_display = tk.Label(
            dork_container,
            textvariable=self.current_dork,
            font=('Consolas', 10),
            bg=COLORS['bg_dark'],
            fg=COLORS['cyan'],
            anchor='w'
        )
        self.dork_display.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)

        # Buttons
        btn_frame = tk.Frame(dork_container, bg=COLORS['bg_dark'])
        btn_frame.pack(side=tk.RIGHT, padx=10)

        copy_btn = tk.Button(
            btn_frame,
            text="📋 Copy",
            command=self.copy_dork,
            bg=COLORS['success'],
            fg='white',
            font=('Arial', 9),
            relief=tk.FLAT,
            padx=10,
            pady=5,
            cursor='hand2'
        )
        copy_btn.pack(side=tk.LEFT, padx=5)

        search_btn = tk.Button(
            btn_frame,
            text="🔍 Search Google",
            command=self.search_google,
            bg=COLORS['primary'],
            fg='white',
            font=('Arial', 9),
            relief=tk.FLAT,
            padx=10,
            pady=5,
            cursor='hand2'
        )
        search_btn.pack(side=tk.LEFT)

    def create_notebook(self):
        """Create tabbed interface"""
        # Style configuration
        style = ttk.Style()
        style.theme_use('default')

        # Configure notebook style
        style.configure('TNotebook', background=COLORS['bg_dark'], borderwidth=0)
        style.configure('TNotebook.Tab',
                       background=COLORS['bg_darker'],
                       foreground=COLORS['text'],
                       padding=[20, 10],
                       font=('Arial', 10, 'bold'))
        style.map('TNotebook.Tab',
                 background=[('selected', COLORS['bg_dark'])],
                 foreground=[('selected', COLORS['cyan'])])

        # Create notebook
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=0, pady=0)

        # Create tabs
        self.create_builder_tab()
        self.create_ai_tab()
        self.create_templates_tab()
        self.create_terminal_tab()
        self.create_pivot_tab()
        self.create_research_tab()
        self.create_vault_tab()

    def create_builder_tab(self):
        """Tab 1: Query Builder"""
        frame = tk.Frame(self.notebook, bg=COLORS['bg_dark'])
        self.notebook.add(frame, text="🔧 Builder")

        # Scroll container
        canvas = tk.Canvas(frame, bg=COLORS['bg_dark'], highlightthickness=0)
        scrollbar = ttk.Scrollbar(frame, orient="vertical", command=canvas.yview)
        scrollable_frame = tk.Frame(canvas, bg=COLORS['bg_dark'])

        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )

        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        # Title
        title = tk.Label(
            scrollable_frame,
            text="🔧 Google Dork Query Builder",
            font=('Arial', 16, 'bold'),
            bg=COLORS['bg_dark'],
            fg=COLORS['cyan']
        )
        title.pack(pady=20)

        # Input fields
        self.builder_inputs = {}
        fields = [
            ('site', 'Site', 'site:example.com', 'Limit results to specific domain'),
            ('filetype', 'File Type', 'pdf', 'Search for specific file types'),
            ('intitle', 'In Title', 'confidential', 'Words in page title'),
            ('inurl', 'In URL', 'admin', 'Words in page URL'),
            ('intext', 'In Text', 'password', 'Words in page content'),
            ('exact', 'Exact Match', '"exact phrase"', 'Exact phrase match'),
            ('exclude', 'Exclude', '-word', 'Exclude terms from results')
        ]

        for key, label, placeholder, tooltip in fields:
            field_frame = tk.Frame(scrollable_frame, bg=COLORS['bg_dark'])
            field_frame.pack(fill=tk.X, padx=40, pady=10)

            # Label
            lbl = tk.Label(
                field_frame,
                text=label,
                font=('Arial', 11, 'bold'),
                bg=COLORS['bg_dark'],
                fg=COLORS['text'],
                width=15,
                anchor='w'
            )
            lbl.pack(side=tk.LEFT)

            # Entry
            entry_var = tk.StringVar()
            entry_var.trace('w', lambda *args: self.update_builder_dork())

            entry = tk.Entry(
                field_frame,
                textvariable=entry_var,
                font=('Consolas', 10),
                bg=COLORS['bg_darker'],
                fg=COLORS['text'],
                insertbackground=COLORS['text'],
                relief=tk.FLAT,
                width=40
            )
            entry.pack(side=tk.LEFT, padx=10, fill=tk.X, expand=True)
            entry.insert(0, '')

            # Tooltip
            tip = tk.Label(
                field_frame,
                text=f"ℹ️ {tooltip}",
                font=('Arial', 9),
                bg=COLORS['bg_dark'],
                fg=COLORS['text_muted']
            )
            tip.pack(side=tk.LEFT, padx=5)

            self.builder_inputs[key] = entry_var

        # Buttons
        btn_frame = tk.Frame(scrollable_frame, bg=COLORS['bg_dark'])
        btn_frame.pack(pady=30)

        clear_btn = tk.Button(
            btn_frame,
            text="🗑️ Clear All",
            command=self.clear_builder,
            bg=COLORS['danger'],
            fg='white',
            font=('Arial', 11),
            relief=tk.FLAT,
            padx=20,
            pady=10,
            cursor='hand2'
        )
        clear_btn.pack(side=tk.LEFT, padx=10)

        apply_btn = tk.Button(
            btn_frame,
            text="✓ Build Query",
            command=self.update_builder_dork,
            bg=COLORS['success'],
            fg='white',
            font=('Arial', 11),
            relief=tk.FLAT,
            padx=20,
            pady=10,
            cursor='hand2'
        )
        apply_btn.pack(side=tk.LEFT, padx=10)

        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    def create_ai_tab(self):
        """Tab 2: AI Intelligence"""
        frame = tk.Frame(self.notebook, bg=COLORS['bg_dark'])
        self.notebook.add(frame, text="🤖 AI Intelligence")

        # Title
        title = tk.Label(
            frame,
            text="🤖 AI-Powered Dork Generation & Analysis",
            font=('Arial', 16, 'bold'),
            bg=COLORS['bg_dark'],
            fg=COLORS['purple']
        )
        title.pack(pady=20)

        # Mode selection
        mode_frame = tk.Frame(frame, bg=COLORS['bg_dark'])
        mode_frame.pack(pady=10)

        self.ai_mode = tk.StringVar(value='generate')

        gen_btn = tk.Radiobutton(
            mode_frame,
            text="🎯 AI Constructor",
            variable=self.ai_mode,
            value='generate',
            font=('Arial', 11),
            bg=COLORS['bg_dark'],
            fg=COLORS['text'],
            selectcolor=COLORS['bg_darker'],
            activebackground=COLORS['bg_dark']
        )
        gen_btn.pack(side=tk.LEFT, padx=20)

        analyze_btn = tk.Radiobutton(
            mode_frame,
            text="🔬 Deep Analyzer",
            variable=self.ai_mode,
            value='analyze',
            font=('Arial', 11),
            bg=COLORS['bg_dark'],
            fg=COLORS['text'],
            selectcolor=COLORS['bg_darker'],
            activebackground=COLORS['bg_dark']
        )
        analyze_btn.pack(side=tk.LEFT, padx=20)

        # Input area
        input_label = tk.Label(
            frame,
            text="Describe your objective or paste a dork to analyze:",
            font=('Arial', 10),
            bg=COLORS['bg_dark'],
            fg=COLORS['text_muted']
        )
        input_label.pack(pady=(20, 5))

        self.ai_input = scrolledtext.ScrolledText(
            frame,
            height=6,
            font=('Consolas', 10),
            bg=COLORS['bg_darker'],
            fg=COLORS['text'],
            insertbackground=COLORS['text'],
            relief=tk.FLAT,
            wrap=tk.WORD
        )
        self.ai_input.pack(padx=40, fill=tk.X)

        # Generate button
        gen_btn_frame = tk.Frame(frame, bg=COLORS['bg_dark'])
        gen_btn_frame.pack(pady=15)

        self.ai_generate_btn = tk.Button(
            gen_btn_frame,
            text="✨ Generate with AI",
            command=self.ai_generate,
            bg=COLORS['purple'],
            fg='white',
            font=('Arial', 12, 'bold'),
            relief=tk.FLAT,
            padx=30,
            pady=12,
            cursor='hand2'
        )
        self.ai_generate_btn.pack()

        # Results area
        results_label = tk.Label(
            frame,
            text="AI Results:",
            font=('Arial', 11, 'bold'),
            bg=COLORS['bg_dark'],
            fg=COLORS['text']
        )
        results_label.pack(pady=(20, 5), anchor='w', padx=40)

        self.ai_results = scrolledtext.ScrolledText(
            frame,
            height=12,
            font=('Consolas', 9),
            bg=COLORS['bg_darker'],
            fg=COLORS['text'],
            relief=tk.FLAT,
            wrap=tk.WORD,
            state='disabled'
        )
        self.ai_results.pack(padx=40, fill=tk.BOTH, expand=True, pady=(0, 20))

    def create_templates_tab(self):
        """Tab 3: Template Gallery"""
        frame = tk.Frame(self.notebook, bg=COLORS['bg_dark'])
        self.notebook.add(frame, text="📚 Templates")

        # Title
        title = tk.Label(
            frame,
            text="📚 Pre-built Dork Templates",
            font=('Arial', 16, 'bold'),
            bg=COLORS['bg_dark'],
            fg=COLORS['emerald']
        )
        title.pack(pady=20)

        # Category filter
        filter_frame = tk.Frame(frame, bg=COLORS['bg_dark'])
        filter_frame.pack(pady=10)

        self.template_category = tk.StringVar(value='all')

        categories = [
            ('All', 'all'),
            ('Files', 'files'),
            ('Vulnerabilities', 'vulns'),
            ('Network', 'network'),
            ('OSINT', 'osint')
        ]

        for label, value in categories:
            btn = tk.Radiobutton(
                filter_frame,
                text=label,
                variable=self.template_category,
                value=value,
                command=self.filter_templates,
                font=('Arial', 10),
                bg=COLORS['bg_dark'],
                fg=COLORS['text'],
                selectcolor=COLORS['bg_darker'],
                activebackground=COLORS['bg_dark']
            )
            btn.pack(side=tk.LEFT, padx=10)

        # Templates list
        canvas = tk.Canvas(frame, bg=COLORS['bg_dark'], highlightthickness=0)
        scrollbar = ttk.Scrollbar(frame, orient="vertical", command=canvas.yview)
        self.templates_frame = tk.Frame(canvas, bg=COLORS['bg_dark'])

        self.templates_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )

        canvas.create_window((0, 0), window=self.templates_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=20, pady=10)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        self.filter_templates()

    def create_terminal_tab(self):
        """Tab 4: Nexus Terminal"""
        frame = tk.Frame(self.notebook, bg=COLORS['bg_darker'])
        self.notebook.add(frame, text="💻 Terminal")

        # Title
        title = tk.Label(
            frame,
            text="💻 Nexus Terminal - Live Search Interface",
            font=('Arial', 14, 'bold'),
            bg=COLORS['bg_darker'],
            fg=COLORS['text']
        )
        title.pack(pady=15)

        # Terminal output
        self.terminal_output = scrolledtext.ScrolledText(
            frame,
            height=20,
            font=('Consolas', 9),
            bg='#000000',
            fg='#00ff00',
            insertbackground='#00ff00',
            relief=tk.FLAT
        )
        self.terminal_output.pack(padx=20, fill=tk.BOTH, expand=True)
        self.terminal_output.insert('1.0', f"{APP_NAME} Terminal Ready\n")
        self.terminal_output.insert('end', "Type your dork query and press Execute to search...\n\n")

        # Input area
        input_frame = tk.Frame(frame, bg=COLORS['bg_darker'])
        input_frame.pack(fill=tk.X, padx=20, pady=15)

        tk.Label(
            input_frame,
            text="Query:",
            font=('Consolas', 10),
            bg=COLORS['bg_darker'],
            fg=COLORS['text']
        ).pack(side=tk.LEFT, padx=5)

        self.terminal_input = tk.Entry(
            input_frame,
            font=('Consolas', 10),
            bg='#1a1a1a',
            fg='#00ff00',
            insertbackground='#00ff00',
            relief=tk.FLAT
        )
        self.terminal_input.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=10)

        exec_btn = tk.Button(
            input_frame,
            text="▶ Execute",
            command=self.execute_terminal,
            bg=COLORS['success'],
            fg='white',
            font=('Arial', 10),
            relief=tk.FLAT,
            padx=15,
            pady=8,
            cursor='hand2'
        )
        exec_btn.pack(side=tk.LEFT, padx=5)

        clear_btn = tk.Button(
            input_frame,
            text="🗑️ Clear",
            command=lambda: self.terminal_output.delete('1.0', tk.END),
            bg=COLORS['danger'],
            fg='white',
            font=('Arial', 10),
            relief=tk.FLAT,
            padx=15,
            pady=8,
            cursor='hand2'
        )
        clear_btn.pack(side=tk.LEFT)

    def create_pivot_tab(self):
        """Tab 5: Intelligence Pivot"""
        frame = tk.Frame(self.notebook, bg=COLORS['bg_dark'])
        self.notebook.add(frame, text="🔄 Pivot")

        # Title
        title = tk.Label(
            frame,
            text="🔄 Translate to Other Search Engines",
            font=('Arial', 16, 'bold'),
            bg=COLORS['bg_dark'],
            fg=COLORS['orange']
        )
        title.pack(pady=20)

        # Info
        info = tk.Label(
            frame,
            text="Convert your Google Dork to Shodan, Censys, Hunter.io, and ZoomEye syntax",
            font=('Arial', 10),
            bg=COLORS['bg_dark'],
            fg=COLORS['text_muted']
        )
        info.pack(pady=5)

        # Translate button
        translate_btn = tk.Button(
            frame,
            text="🔄 Translate Current Dork",
            command=self.translate_dork,
            bg=COLORS['orange'],
            fg='white',
            font=('Arial', 11),
            relief=tk.FLAT,
            padx=20,
            pady=10,
            cursor='hand2'
        )
        translate_btn.pack(pady=20)

        # Results area
        canvas = tk.Canvas(frame, bg=COLORS['bg_dark'], highlightthickness=0)
        scrollbar = ttk.Scrollbar(frame, orient="vertical", command=canvas.yview)
        self.pivot_results = tk.Frame(canvas, bg=COLORS['bg_dark'])

        self.pivot_results.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )

        canvas.create_window((0, 0), window=self.pivot_results, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=20, pady=10)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    def create_research_tab(self):
        """Tab 6: Research Hub"""
        frame = tk.Frame(self.notebook, bg=COLORS['bg_dark'])
        self.notebook.add(frame, text="📖 Research")

        # Title
        title = tk.Label(
            frame,
            text="📖 Security Research Hub",
            font=('Arial', 16, 'bold'),
            bg=COLORS['bg_dark'],
            fg=COLORS['primary']
        )
        title.pack(pady=20)

        # Search input
        search_frame = tk.Frame(frame, bg=COLORS['bg_dark'])
        search_frame.pack(fill=tk.X, padx=40, pady=10)

        self.research_input = tk.Entry(
            search_frame,
            font=('Arial', 11),
            bg=COLORS['bg_darker'],
            fg=COLORS['text'],
            insertbackground=COLORS['text'],
            relief=tk.FLAT
        )
        self.research_input.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 10))

        research_btn = tk.Button(
            search_frame,
            text="🔍 Research",
            command=self.do_research,
            bg=COLORS['primary'],
            fg='white',
            font=('Arial', 10),
            relief=tk.FLAT,
            padx=20,
            pady=8,
            cursor='hand2'
        )
        research_btn.pack(side=tk.LEFT)

        # Results
        self.research_results = scrolledtext.ScrolledText(
            frame,
            font=('Arial', 10),
            bg=COLORS['bg_darker'],
            fg=COLORS['text'],
            relief=tk.FLAT,
            wrap=tk.WORD
        )
        self.research_results.pack(padx=40, fill=tk.BOTH, expand=True, pady=(10, 20))

    def create_vault_tab(self):
        """Tab 7: Nexus Vault"""
        frame = tk.Frame(self.notebook, bg=COLORS['bg_dark'])
        self.notebook.add(frame, text="💾 Vault")

        # Title
        title = tk.Label(
            frame,
            text="💾 Nexus Vault - Saved Queries",
            font=('Arial', 16, 'bold'),
            bg=COLORS['bg_dark'],
            fg=COLORS['amber']
        )
        title.pack(pady=20)

        # Save section
        save_frame = tk.Frame(frame, bg=COLORS['bg_darker'], relief=tk.RAISED, borderwidth=1)
        save_frame.pack(fill=tk.X, padx=20, pady=10)

        tk.Label(
            save_frame,
            text="Save Current Dork:",
            font=('Arial', 11, 'bold'),
            bg=COLORS['bg_darker'],
            fg=COLORS['text']
        ).pack(pady=10, padx=15, anchor='w')

        # Tags
        tag_frame = tk.Frame(save_frame, bg=COLORS['bg_darker'])
        tag_frame.pack(fill=tk.X, padx=15, pady=5)

        tk.Label(
            tag_frame,
            text="Tags:",
            font=('Arial', 10),
            bg=COLORS['bg_darker'],
            fg=COLORS['text']
        ).pack(side=tk.LEFT)

        self.vault_tags = tk.Entry(
            tag_frame,
            font=('Arial', 10),
            bg=COLORS['bg_dark'],
            fg=COLORS['text'],
            insertbackground=COLORS['text'],
            relief=tk.FLAT
        )
        self.vault_tags.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=10)

        # Notes
        note_frame = tk.Frame(save_frame, bg=COLORS['bg_darker'])
        note_frame.pack(fill=tk.X, padx=15, pady=5)

        tk.Label(
            note_frame,
            text="Notes:",
            font=('Arial', 10),
            bg=COLORS['bg_darker'],
            fg=COLORS['text']
        ).pack(side=tk.LEFT)

        self.vault_notes = tk.Entry(
            note_frame,
            font=('Arial', 10),
            bg=COLORS['bg_dark'],
            fg=COLORS['text'],
            insertbackground=COLORS['text'],
            relief=tk.FLAT
        )
        self.vault_notes.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=10)

        # Save button
        save_btn = tk.Button(
            save_frame,
            text="💾 Save to Vault",
            command=self.save_to_vault,
            bg=COLORS['success'],
            fg='white',
            font=('Arial', 10),
            relief=tk.FLAT,
            padx=20,
            pady=8,
            cursor='hand2'
        )
        save_btn.pack(pady=10)

        # Vault list
        tk.Label(
            frame,
            text="Saved Dorks:",
            font=('Arial', 11, 'bold'),
            bg=COLORS['bg_dark'],
            fg=COLORS['text']
        ).pack(pady=(20, 5), anchor='w', padx=20)

        # Vault items
        canvas = tk.Canvas(frame, bg=COLORS['bg_dark'], highlightthickness=0)
        scrollbar = ttk.Scrollbar(frame, orient="vertical", command=canvas.yview)
        self.vault_list = tk.Frame(canvas, bg=COLORS['bg_dark'])

        self.vault_list.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )

        canvas.create_window((0, 0), window=self.vault_list, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=20, pady=10)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    def create_footer(self):
        """Create application footer"""
        footer = tk.Frame(self.root, bg=COLORS['bg_darker'], height=60)
        footer.pack(fill=tk.X, pady=0)
        footer.pack_propagate(False)

        warning = tk.Label(
            footer,
            text="⚠️ For authorized security research and educational purposes only",
            font=('Arial', 9),
            bg=COLORS['warning'],
            fg='#000000',
            pady=5
        )
        warning.pack(fill=tk.X)

        copyright_text = tk.Label(
            footer,
            text=f"© 2024 {APP_NAME} | Version {VERSION} | Desktop Edition",
            font=('Arial', 9),
            bg=COLORS['bg_darker'],
            fg=COLORS['text_muted']
        )
        copyright_text.pack(pady=8)

    # Helper methods

    def load_config(self):
        """Load app configuration"""
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, 'r') as f:
                    config = json.load(f)
                    self.api_key.set(config.get('api_key', ''))
            except:
                pass

    def save_config(self):
        """Save app configuration"""
        config = {
            'api_key': self.api_key.get()
        }
        with open(CONFIG_FILE, 'w') as f:
            json.dump(config, f, indent=2)

    def show_api_settings(self):
        """Show API settings dialog"""
        dialog = tk.Toplevel(self.root)
        dialog.title("API Settings")
        dialog.geometry("500x200")
        dialog.configure(bg=COLORS['bg_dark'])
        dialog.transient(self.root)
        dialog.grab_set()

        tk.Label(
            dialog,
            text="Gemini API Key",
            font=('Arial', 12, 'bold'),
            bg=COLORS['bg_dark'],
            fg=COLORS['text']
        ).pack(pady=20)

        key_entry = tk.Entry(
            dialog,
            textvariable=self.api_key,
            font=('Consolas', 10),
            bg=COLORS['bg_darker'],
            fg=COLORS['text'],
            show='*',
            width=50
        )
        key_entry.pack(pady=10)

        info = tk.Label(
            dialog,
            text="Get your API key from: https://aistudio.google.com/apikey",
            font=('Arial', 9),
            bg=COLORS['bg_dark'],
            fg=COLORS['text_muted']
        )
        info.pack(pady=5)

        def save_and_close():
            self.save_config()
            self.init_gemini()
            dialog.destroy()
            messagebox.showinfo("Success", "API key saved successfully!")

        tk.Button(
            dialog,
            text="Save",
            command=save_and_close,
            bg=COLORS['success'],
            fg='white',
            font=('Arial', 10),
            padx=30,
            pady=8
        ).pack(pady=20)

    def update_builder_dork(self):
        """Update dork from builder inputs"""
        parts = []

        if self.builder_inputs['site'].get():
            parts.append(f"site:{self.builder_inputs['site'].get()}")
        if self.builder_inputs['filetype'].get():
            parts.append(f"filetype:{self.builder_inputs['filetype'].get()}")
        if self.builder_inputs['intitle'].get():
            parts.append(f"intitle:{self.builder_inputs['intitle'].get()}")
        if self.builder_inputs['inurl'].get():
            parts.append(f"inurl:{self.builder_inputs['inurl'].get()}")
        if self.builder_inputs['intext'].get():
            parts.append(f"intext:{self.builder_inputs['intext'].get()}")
        if self.builder_inputs['exact'].get():
            parts.append(f'"{self.builder_inputs["exact"].get()}"')
        if self.builder_inputs['exclude'].get():
            parts.append(f"-{self.builder_inputs['exclude'].get()}")

        self.current_dork.set(' '.join(parts))

    def clear_builder(self):
        """Clear all builder inputs"""
        for var in self.builder_inputs.values():
            var.set('')
        self.current_dork.set('')

    def copy_dork(self):
        """Copy dork to clipboard"""
        self.root.clipboard_clear()
        self.root.clipboard_append(self.current_dork.get())
        messagebox.showinfo("Copied", "Dork copied to clipboard!")

    def search_google(self):
        """Open Google search with current dork"""
        if self.current_dork.get():
            url = f"https://www.google.com/search?q={self.current_dork.get()}"
            webbrowser.open(url)
        else:
            messagebox.showwarning("No Query", "Please build a dork query first!")

    def ai_generate(self):
        """Generate or analyze dork with AI"""
        if not self.gemini_available:
            messagebox.showerror("API Key Required", "Please configure your Gemini API key in settings!")
            return

        prompt = self.ai_input.get('1.0', tk.END).strip()
        if not prompt:
            messagebox.showwarning("Input Required", "Please enter a prompt or dork to analyze!")
            return

        self.ai_generate_btn.config(state='disabled', text='⏳ Processing...')

        def process():
            try:
                mode = self.ai_mode.get()

                if mode == 'generate':
                    result = self.gemini_generate_dork(prompt)
                else:
                    result = self.gemini_analyze_dork(prompt)

                self.ai_results.config(state='normal')
                self.ai_results.delete('1.0', tk.END)
                self.ai_results.insert('1.0', result)
                self.ai_results.config(state='disabled')

            except Exception as e:
                messagebox.showerror("AI Error", f"Error: {str(e)}")
            finally:
                self.ai_generate_btn.config(state='normal', text='✨ Generate with AI')

        threading.Thread(target=process, daemon=True).start()

    def gemini_generate_dork(self, prompt):
        """Generate dork using Gemini"""
        model = genai.GenerativeModel('gemini-2.0-flash-exp')

        system_prompt = """You are an expert Google Dork generator.
        Generate precise Google Dork queries based on user objectives.
        Return:
        1. The dork query
        2. Explanation
        3. Risk level (Low/Medium/High)"""

        response = model.generate_content(f"{system_prompt}\n\nUser objective: {prompt}")

        # Update current dork if found
        text = response.text
        if 'Query:' in text or 'Dork:' in text:
            lines = text.split('\n')
            for line in lines:
                if line.startswith(('Query:', 'Dork:')):
                    dork = line.split(':', 1)[1].strip()
                    self.current_dork.set(dork)
                    break

        return response.text

    def gemini_analyze_dork(self, dork):
        """Analyze dork using Gemini"""
        model = genai.GenerativeModel('gemini-2.0-flash-exp')

        system_prompt = """You are a Google Dork analysis expert.
        Analyze the given dork for:
        1. Effectiveness (0-100)
        2. Potential issues
        3. Optimization suggestions
        4. Risk level"""

        response = model.generate_content(f"{system_prompt}\n\nDork to analyze: {dork}")
        return response.text

    def load_templates(self):
        """Load dork templates"""
        templates = [
            # Files category
            {'name': 'Exposed Log Files', 'category': 'files', 'query': 'filetype:log inurl:log'},
            {'name': 'SQL Dumps', 'category': 'files', 'query': 'filetype:sql intext:"INSERT INTO" intext:"VALUES"'},
            {'name': 'Private Keys', 'category': 'files', 'query': 'filetype:pem intext:"BEGIN RSA PRIVATE KEY"'},
            {'name': 'Configuration Files', 'category': 'files', 'query': 'filetype:conf inurl:config'},
            {'name': 'Backup Files', 'category': 'files', 'query': 'filetype:bak inurl:backup'},
            {'name': 'Password Lists', 'category': 'files', 'query': 'filetype:txt intext:password'},
            {'name': 'Excel Spreadsheets', 'category': 'files', 'query': 'filetype:xls intext:confidential'},
            {'name': 'PDF Documents', 'category': 'files', 'query': 'filetype:pdf intext:"confidential"'},
            {'name': 'Email Lists', 'category': 'files', 'query': 'filetype:csv intext:email'},
            {'name': 'Source Code', 'category': 'files', 'query': 'filetype:java intext:"password"'},

            # Vulnerabilities category
            {'name': 'Exposed .env Files', 'category': 'vulns', 'query': 'filetype:env intext:DB_PASSWORD'},
            {'name': 'Git Exposure', 'category': 'vulns', 'query': 'inurl:.git intitle:"Index of"'},
            {'name': 'PHP Info Pages', 'category': 'vulns', 'query': 'inurl:phpinfo.php'},
            {'name': 'SQL Errors', 'category': 'vulns', 'query': 'intext:"SQL syntax" intext:"error"'},
            {'name': 'Directory Listings', 'category': 'vulns', 'query': 'intitle:"Index of" "parent directory"'},
            {'name': 'Admin Panels', 'category': 'vulns', 'query': 'inurl:admin intitle:login'},
            {'name': 'Test/Dev Sites', 'category': 'vulns', 'query': 'inurl:test OR inurl:dev intext:"under construction"'},
            {'name': 'WordPress Backups', 'category': 'vulns', 'query': 'filetype:sql intext:"wp_users"'},
            {'name': 'FTP Credentials', 'category': 'vulns', 'query': 'filetype:txt intext:"ftp://"'},
            {'name': 'API Keys Exposed', 'category': 'vulns', 'query': 'intext:"api_key" filetype:json'},

            # Network category
            {'name': 'Webcams', 'category': 'network', 'query': 'inurl:view.shtml intitle:"Network Camera"'},
            {'name': 'Printers', 'category': 'network', 'query': 'inurl:hp/device/this.LCDispatcher'},
            {'name': 'Network Devices', 'category': 'network', 'query': 'intitle:"Router Configuration"'},
            {'name': 'Server Status', 'category': 'network', 'query': 'intitle:"Apache Status" intext:"Server Version"'},
            {'name': 'Jenkins CI', 'category': 'network', 'query': 'intitle:"Dashboard [Jenkins]"'},
            {'name': 'Grafana', 'category': 'network', 'query': 'intitle:"Grafana" inurl:3000'},
            {'name': 'Kibana', 'category': 'network', 'query': 'intitle:"Kibana" inurl:5601'},
            {'name': 'Database Admin', 'category': 'network', 'query': 'intitle:"phpMyAdmin" intext:"Welcome to phpMyAdmin"'},
            {'name': 'Docker Registries', 'category': 'network', 'query': 'inurl:5000/v2/_catalog'},
            {'name': 'Redis Commander', 'category': 'network', 'query': 'intitle:"Redis Commander"'},

            # OSINT category
            {'name': 'LinkedIn Profiles', 'category': 'osint', 'query': 'site:linkedin.com intitle:"CISO"'},
            {'name': 'GitHub Repos', 'category': 'osint', 'query': 'site:github.com intext:"password"'},
            {'name': 'Pastebin Leaks', 'category': 'osint', 'query': 'site:pastebin.com intext:"password"'},
            {'name': 'Public Documents', 'category': 'osint', 'query': 'site:docs.google.com inurl:edit'}
        ]
        return templates

    def filter_templates(self):
        """Filter and display templates"""
        # Clear existing
        for widget in self.templates_frame.winfo_children():
            widget.destroy()

        category = self.template_category.get()

        filtered = [t for t in self.templates if category == 'all' or t['category'] == category]

        for template in filtered:
            card = tk.Frame(self.templates_frame, bg=COLORS['bg_darker'], relief=tk.RAISED, borderwidth=1)
            card.pack(fill=tk.X, pady=8, padx=5)

            # Name
            tk.Label(
                card,
                text=template['name'],
                font=('Arial', 11, 'bold'),
                bg=COLORS['bg_darker'],
                fg=COLORS['emerald'],
                anchor='w'
            ).pack(fill=tk.X, padx=15, pady=(10, 5))

            # Query
            tk.Label(
                card,
                text=template['query'],
                font=('Consolas', 9),
                bg=COLORS['bg_darker'],
                fg=COLORS['text_muted'],
                anchor='w',
                wraplength=600
            ).pack(fill=tk.X, padx=15, pady=5)

            # Button
            tk.Button(
                card,
                text="Use Template",
                command=lambda q=template['query']: self.use_template(q),
                bg=COLORS['success'],
                fg='white',
                font=('Arial', 9),
                relief=tk.FLAT,
                padx=15,
                pady=5,
                cursor='hand2'
            ).pack(pady=10, anchor='e', padx=15)

    def use_template(self, query):
        """Load template into current dork"""
        self.current_dork.set(query)
        messagebox.showinfo("Template Loaded", "Template loaded into current dork!")

    def execute_terminal(self):
        """Execute terminal search"""
        query = self.terminal_input.get().strip()
        if not query:
            return

        self.terminal_output.insert('end', f"\n> Executing: {query}\n")
        self.terminal_output.insert('end', f"[{datetime.now().strftime('%H:%M:%S')}] Searching...\n")

        if self.gemini_available:
            def search():
                try:
                    model = genai.GenerativeModel('gemini-2.0-flash-exp')
                    response = model.generate_content(
                        f"Simulate 3 Google search results for this dork query: {query}\n"
                        f"Format each as: Title | URL | Snippet"
                    )
                    self.terminal_output.insert('end', f"\nResults:\n{response.text}\n")
                except Exception as e:
                    self.terminal_output.insert('end', f"Error: {str(e)}\n")

            threading.Thread(target=search, daemon=True).start()
        else:
            self.terminal_output.insert('end', "⚠️ Gemini API not configured. Please set API key.\n")

        self.terminal_output.see('end')

    def translate_dork(self):
        """Translate current dork to other engines"""
        if not self.current_dork.get():
            messagebox.showwarning("No Dork", "Please build a dork query first!")
            return

        # Clear existing results
        for widget in self.pivot_results.winfo_children():
            widget.destroy()

        if not self.gemini_available:
            messagebox.showerror("API Required", "Gemini API key required for translation!")
            return

        def translate():
            try:
                model = genai.GenerativeModel('gemini-2.0-flash-exp')
                engines = ['Shodan', 'Censys', 'Hunter.io', 'ZoomEye']

                for engine in engines:
                    prompt = f"Translate this Google Dork to {engine} syntax: {self.current_dork.get()}"
                    response = model.generate_content(prompt)

                    card = tk.Frame(self.pivot_results, bg=COLORS['bg_darker'], relief=tk.RAISED, borderwidth=1)
                    card.pack(fill=tk.X, pady=10, padx=5)

                    tk.Label(
                        card,
                        text=f"🔹 {engine}",
                        font=('Arial', 12, 'bold'),
                        bg=COLORS['bg_darker'],
                        fg=COLORS['orange']
                    ).pack(anchor='w', padx=15, pady=10)

                    result_text = scrolledtext.ScrolledText(
                        card,
                        height=6,
                        font=('Consolas', 9),
                        bg=COLORS['bg_dark'],
                        fg=COLORS['text'],
                        wrap=tk.WORD
                    )
                    result_text.pack(fill=tk.X, padx=15, pady=(0, 10))
                    result_text.insert('1.0', response.text)
                    result_text.config(state='disabled')

            except Exception as e:
                messagebox.showerror("Translation Error", f"Error: {str(e)}")

        threading.Thread(target=translate, daemon=True).start()

    def do_research(self):
        """Research a topic"""
        topic = self.research_input.get().strip()
        if not topic:
            return

        if not self.gemini_available:
            messagebox.showerror("API Required", "Gemini API key required for research!")
            return

        self.research_results.delete('1.0', tk.END)
        self.research_results.insert('1.0', "🔍 Researching...\n\n")

        def research():
            try:
                model = genai.GenerativeModel('gemini-2.0-flash-exp')
                response = model.generate_content(
                    f"Provide detailed information about: {topic}\n"
                    f"Focus on security research and OSINT context."
                )

                self.research_results.delete('1.0', tk.END)
                self.research_results.insert('1.0', response.text)

            except Exception as e:
                self.research_results.delete('1.0', tk.END)
                self.research_results.insert('1.0', f"Error: {str(e)}")

        threading.Thread(target=research, daemon=True).start()

    def save_to_vault(self):
        """Save current dork to vault"""
        if not self.current_dork.get():
            messagebox.showwarning("No Dork", "Please build a dork query first!")
            return

        item = {
            'id': str(datetime.now().timestamp()),
            'dork': self.current_dork.get(),
            'tags': self.vault_tags.get(),
            'notes': self.vault_notes.get(),
            'timestamp': datetime.now().isoformat()
        }

        self.vault_items.append(item)
        self.save_vault()
        self.refresh_vault_list()

        self.vault_tags.delete(0, tk.END)
        self.vault_notes.delete(0, tk.END)

        messagebox.showinfo("Saved", "Dork saved to vault!")

    def load_vault(self):
        """Load vault from file"""
        if os.path.exists(VAULT_FILE):
            try:
                with open(VAULT_FILE, 'r') as f:
                    self.vault_items = json.load(f)
            except:
                self.vault_items = []
        self.refresh_vault_list()

    def save_vault(self):
        """Save vault to file"""
        with open(VAULT_FILE, 'w') as f:
            json.dump(self.vault_items, f, indent=2)

    def refresh_vault_list(self):
        """Refresh vault display"""
        for widget in self.vault_list.winfo_children():
            widget.destroy()

        for item in reversed(self.vault_items):
            card = tk.Frame(self.vault_list, bg=COLORS['bg_darker'], relief=tk.RAISED, borderwidth=1)
            card.pack(fill=tk.X, pady=8, padx=5)

            # Dork
            tk.Label(
                card,
                text=item['dork'],
                font=('Consolas', 10, 'bold'),
                bg=COLORS['bg_darker'],
                fg=COLORS['amber'],
                anchor='w'
            ).pack(fill=tk.X, padx=15, pady=(10, 5))

            # Notes
            if item.get('notes'):
                tk.Label(
                    card,
                    text=f"📝 {item['notes']}",
                    font=('Arial', 9),
                    bg=COLORS['bg_darker'],
                    fg=COLORS['text_muted'],
                    anchor='w'
                ).pack(fill=tk.X, padx=15, pady=2)

            # Tags
            if item.get('tags'):
                tk.Label(
                    card,
                    text=f"🏷️ {item['tags']}",
                    font=('Arial', 9),
                    bg=COLORS['bg_darker'],
                    fg=COLORS['text_muted'],
                    anchor='w'
                ).pack(fill=tk.X, padx=15, pady=2)

            # Timestamp
            tk.Label(
                card,
                text=f"⏰ {item['timestamp'][:19]}",
                font=('Arial', 8),
                bg=COLORS['bg_darker'],
                fg=COLORS['text_muted'],
                anchor='w'
            ).pack(fill=tk.X, padx=15, pady=2)

            # Buttons
            btn_frame = tk.Frame(card, bg=COLORS['bg_darker'])
            btn_frame.pack(pady=10, padx=15, anchor='e')

            tk.Button(
                btn_frame,
                text="Load",
                command=lambda d=item['dork']: self.current_dork.set(d),
                bg=COLORS['primary'],
                fg='white',
                font=('Arial', 8),
                relief=tk.FLAT,
                padx=10,
                pady=3
            ).pack(side=tk.LEFT, padx=3)

            tk.Button(
                btn_frame,
                text="Delete",
                command=lambda i=item: self.delete_vault_item(i),
                bg=COLORS['danger'],
                fg='white',
                font=('Arial', 8),
                relief=tk.FLAT,
                padx=10,
                pady=3
            ).pack(side=tk.LEFT, padx=3)

    def delete_vault_item(self, item):
        """Delete item from vault"""
        self.vault_items = [i for i in self.vault_items if i['id'] != item['id']]
        self.save_vault()
        self.refresh_vault_list()

def main():
    """Main entry point"""
    root = tk.Tk()
    app = DorkNexusApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
