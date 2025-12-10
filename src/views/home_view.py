import customtkinter as ctk

class HomeView(ctk.CTkFrame):
    """
    Vista de Inicio (Bienvenida / Dashboard).
    Ofrece acceso rápido a las funciones principales.
    """
    def __init__(self, master, on_navigate=None, **kwargs):
        super().__init__(master, **kwargs)
        self.on_navigate = on_navigate  # callback(view_name)

        # Configuración de Grid Principal
        self.grid_columnconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1) # Espacio superior
        self.grid_rowconfigure(1, weight=0) # Contenido central
        self.grid_rowconfigure(2, weight=2) # Espacio inferior

        # Contenedor Central
        self.center_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.center_frame.grid(row=1, column=0, columnspan=2, sticky="nsew", padx=20)
        self.center_frame.grid_columnconfigure((0, 1), weight=1)

        # Título de Bienvenida
        self.title_label = ctk.CTkLabel(
            self.center_frame,
            text="Bienvenido al Generador de Fórmulas",
            font=ctk.CTkFont(size=32, weight="bold")
        )
        self.title_label.grid(row=0, column=0, columnspan=2, pady=(0, 40))

        # Tarjeta 1: Generador
        self.card_gen = self.create_nav_card(
            self.center_frame,
            title="📄 Generador PDF",
            description="Crea hojas de fórmulas personalizadas\na partir de tus datos.",
            color="hover_color", # Theme dependent hack or specific color
            command=lambda: self.navigate("generator")
        )
        self.card_gen.grid(row=1, column=0, padx=20, pady=20, sticky="ew")

        # Tarjeta 2: Quiz
        self.card_quiz = self.create_nav_card(
            self.center_frame,
            title="🎓 Quiz / Estudio",
            description="Practica y ponte a prueba con\npreguntas y fórmulas interactivas.",
            color="hover_color",
            command=lambda: self.navigate("quiz")
        )
        self.card_quiz.grid(row=1, column=1, padx=20, pady=20, sticky="ew")

    def create_nav_card(self, parent, title, description, color, command):
        # Creamos un botón grande que parece una tarjeta
        # Usamos '\n' en el texto para simular título y descripción si es un solo botón,
        # o construimos un Frame clickable.
        # Para simplicidad y estética nativa, usaremos un CTkButton grande.

        text = f"{title}\n\n{description}"

        btn = ctk.CTkButton(
            parent,
            text=text,
            command=command,
            font=ctk.CTkFont(size=18),
            height=150,
            fg_color=("gray80", "gray20"),
            text_color=("gray10", "gray90"),
            hover_color=("gray70", "gray30"),
            corner_radius=15
        )
        return btn

    def navigate(self, view_name):
        if self.on_navigate:
            self.on_navigate(view_name)
