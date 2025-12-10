import tkinter as tk
from tkinter import messagebox, filedialog
import customtkinter as ctk
from views.pdf_view import PDFGeneratorView
from views.quiz_view import QuizView
from views.home_view import HomeView
from utils import load_config

# Set appearance and theme (Global)
config = load_config()
ctk.set_appearance_mode(config.get("ui_theme", "Dark"))
ctk.set_default_color_theme(config.get("ui_color_theme", "blue"))

class FormulaApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Generador de Fórmulas Física PDF")
        self.root.geometry("1100x700")

        # Layout: 2 Columns
        # Col 0: Sidebar (Small width), Col 1: Main Content (Expanded)
        self.root.grid_columnconfigure(1, weight=1)
        self.root.grid_rowconfigure(0, weight=1)

        # --- Sidebar ---
        self.sidebar_frame = ctk.CTkFrame(self.root, width=220, corner_radius=0)
        self.sidebar_frame.grid(row=0, column=0, sticky="nsew")
        self.sidebar_frame.grid_rowconfigure(5, weight=1)

        self.logo_label = ctk.CTkLabel(self.sidebar_frame, text="Dashboard", font=ctk.CTkFont(size=20, weight="bold"))
        self.logo_label.grid(row=0, column=0, padx=20, pady=(20, 20))

        # Common button style
        btn_kwargs = {
            "height": 40,
            "anchor": "w",
            "font": ctk.CTkFont(size=16),
            "fg_color": "transparent",
            "text_color": ("gray10", "gray90"),
            "hover_color": ("gray70", "gray30")
        }

        self.btn_home = ctk.CTkButton(self.sidebar_frame, text="🏠  Inicio", command=self.show_home_view, **btn_kwargs)
        self.btn_home.grid(row=1, column=0, padx=20, pady=10, sticky="ew")

        self.btn_gen = ctk.CTkButton(self.sidebar_frame, text="📄  Generador PDF", command=self.show_generator_view, **btn_kwargs)
        self.btn_gen.grid(row=2, column=0, padx=20, pady=10, sticky="ew")

        self.btn_quiz = ctk.CTkButton(self.sidebar_frame, text="🎓  Quiz / Estudio", command=self.show_quiz_view, **btn_kwargs)
        self.btn_quiz.grid(row=3, column=0, padx=20, pady=10, sticky="ew")

        # --- Main Content Area ---
        self.main_frame = ctk.CTkFrame(self.root, corner_radius=0, fg_color="transparent")
        self.main_frame.grid(row=0, column=1, sticky="nsew")
        self.main_frame.grid_rowconfigure(0, weight=1) # Header/Toggle
        self.main_frame.grid_rowconfigure(1, weight=10) # Content
        self.main_frame.grid_columnconfigure(0, weight=1)

        # Toggle Button Area
        self.top_bar = ctk.CTkFrame(self.main_frame, height=40, fg_color="transparent")
        self.top_bar.grid(row=0, column=0, sticky="ew", padx=10, pady=5)

        self.toggle_btn = ctk.CTkButton(self.top_bar, text="☰", width=40, command=self.toggle_sidebar, fg_color="transparent", text_color=("gray10", "gray90"), hover_color=("gray70", "gray30"))
        self.toggle_btn.pack(side="left")

        # Content Container
        self.content_container = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        self.content_container.grid(row=1, column=0, sticky="nsew")
        self.content_container.grid_columnconfigure(0, weight=1)
        self.content_container.grid_rowconfigure(0, weight=1)

        # Views
        self.views = {}
        self.views["home"] = HomeView(self.content_container, on_navigate=self.show_view)
        self.views["generator"] = PDFGeneratorView(self.content_container)
        self.views["quiz"] = QuizView(self.content_container)

        # Show default
        self.show_home_view()
        self.sidebar_visible = True

    def show_view(self, name):
        # Hide all
        for view in self.views.values():
            view.grid_forget()

        # Update Sidebar State (Visual Indication optional, keeping simple for now)

        # Show selected
        self.views[name].grid(row=0, column=0, sticky="nsew")

    def show_home_view(self):
        self.show_view("home")

    def show_generator_view(self):
        self.show_view("generator")

    def show_quiz_view(self):
        self.show_view("quiz")

    def toggle_sidebar(self):
        if self.sidebar_visible:
            self.sidebar_frame.grid_forget()
            self.sidebar_visible = False
        else:
            self.sidebar_frame.grid(row=0, column=0, sticky="nsew")
            self.sidebar_visible = True

def main():
    root = ctk.CTk()
    app = FormulaApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
