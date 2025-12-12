import customtkinter as ctk

class NavButton(ctk.CTkFrame):
    def __init__(self, master, label, icon, view_name, command, **kwargs):
        super().__init__(master, fg_color="transparent", corner_radius=0, **kwargs)
        self.view_name = view_name
        self.command = command

        # Grid layout: [Border Strip][Icon + Text]
        self.grid_columnconfigure(0, weight=0) # Border strip
        self.grid_columnconfigure(1, weight=1) # Content
        self.grid_rowconfigure(0, weight=1)

        # 1. Accent Border (Left Strip)
        self.accent_strip = ctk.CTkFrame(
            self,
            width=4,
            fg_color="transparent", # Hidden by default
            corner_radius=0,
            height=40 # Inherit from parent height approx
        )
        self.accent_strip.grid(row=0, column=0, sticky="ns")

        # 2. Main Button (Icon + Text)
        # We use a button to handle hover and click easily, but styled to look like part of the row
        self.btn = ctk.CTkButton(
            self,
            text=f"  {icon}   {label}",
            anchor="w",
            font=ctk.CTkFont(size=16),
            fg_color="transparent",
            text_color="#9CA3AF", # gray-400
            hover_color="#1F2937", # gray-800
            corner_radius=6,
            height=40,
            command=self._on_click
        )
        self.btn.grid(row=0, column=1, sticky="nsew", padx=(5, 10), pady=2)

    def _on_click(self):
        if self.command:
            self.command(self.view_name)

    def set_active(self, is_active):
        if is_active:
            # Active State
            self.accent_strip.configure(fg_color="#00FFFF") # Cyan Accent
            self.btn.configure(
                text_color="white",
                font=ctk.CTkFont(size=16, weight="bold"),
                fg_color="#1F2937" # Darker bg for active
            )
            # Optional: Set frame bg if needed, but transparent is usually fine if btn has color
        else:
            # Inactive State
            self.accent_strip.configure(fg_color="transparent")
            self.btn.configure(
                text_color="#9CA3AF",
                font=ctk.CTkFont(size=16, weight="normal"),
                fg_color="transparent"
            )


class Sidebar(ctk.CTkFrame):
    def __init__(self, master, on_navigate, **kwargs):
        super().__init__(master, **kwargs)
        self.on_navigate = on_navigate

        # Styles
        self.configure(fg_color="#111827", width=260, corner_radius=0) # gray-900
        self.grid_rowconfigure(6, weight=1) # Spacer at bottom

        # Header / Logo
        self.logo_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.logo_frame.grid(row=0, column=0, padx=20, pady=30, sticky="ew")

        self.logo_icon = ctk.CTkLabel(
            self.logo_frame,
            text="⚡",
            font=ctk.CTkFont(size=24),
            fg_color="#8B5CF6", # purple-500
            width=40, height=40,
            corner_radius=8
        )
        self.logo_icon.pack(side="left")

        self.logo_text = ctk.CTkLabel(
            self.logo_frame,
            text="PhysiCode",
            font=ctk.CTkFont(size=22, weight="bold"),
            text_color="white"
        )
        self.logo_text.pack(side="left", padx=10)

        # Navigation Buttons
        self.nav_buttons = []

        items = [
            ("Aprender", "dashboard", "📖"),
            ("Clasificación", "stats", "🏆"),
            ("Generador PDF", "pdf_generator", "📄"),
            ("Perfil", "profile", "👤")
        ]

        for idx, (label, view_name, icon) in enumerate(items):
            # Create NavButton wrapper
            # Padding handled by grid in parent
            nav_btn = NavButton(
                self,
                label=label,
                icon=icon,
                view_name=view_name,
                command=self.handle_click
            )
            # Increased vertical padding as requested (15px -> actually spread out)
            nav_btn.grid(row=idx + 1, column=0, sticky="ew", pady=8)
            self.nav_buttons.append(nav_btn)

    def handle_click(self, view_name):
        self.set_active(view_name)
        self.on_navigate(view_name)

    def set_active(self, view_name):
        for btn in self.nav_buttons:
            btn.set_active(btn.view_name == view_name)
