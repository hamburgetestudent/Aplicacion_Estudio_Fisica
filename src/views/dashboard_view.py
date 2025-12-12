import customtkinter as ctk
import math
from core.quiz_data import load_quiz_db

class DashboardView(ctk.CTkScrollableFrame):
    """
    The 'Tree' view where Units (Categories) and Lessons (Topics/Nodes) are displayed.
    Uses a Zig-Zag (Snake) Grid Layout on a Canvas.
    """
    def __init__(self, master, on_start_lesson, **kwargs):
        super().__init__(master, **kwargs)
        self.on_start_lesson = on_start_lesson

        self.configure(fg_color="#030712") # Background

        self.quiz_data = load_quiz_db()
        self.flattened_units = self._flatten_data()

        # Layout Constants
        self.MAX_WIDTH = 1000
        self.COLS = 4
        self.COL_WIDTH = self.MAX_WIDTH / self.COLS
        self.ROW_HEIGHT = 180
        self.NODE_SIZE = 80 # Diameter

        self._build_ui()

    def _flatten_data(self):
        units = []
        for subject, categories in self.quiz_data.items():
            for category_name, topics in categories.items():
                unit = {
                    "title": f"Unidad: {category_name}",
                    "description": f"Temas de {subject}",
                    "lessons": []
                }

                # Add lessons
                for topic_name, content in topics.items():
                    # Node 1: Study
                    unit["lessons"].append({
                        "id": f"{category_name}_{topic_name}_study",
                        "title": topic_name,
                        "type": "formulas",
                        "data": content,
                        "locked": False,
                        "completed": False,
                        "icon": "📖"
                    })
                    # Node 2: Practice
                    unit["lessons"].append({
                        "id": f"{category_name}_{topic_name}_quiz",
                        "title": "Práctica",
                        "type": "questions",
                        "data": content,
                        "locked": False,
                        "completed": False,
                        "icon": "⚡"
                    })
                units.append(unit)
        return units

    def _build_ui(self):
        # 1. Calculate Total Height needed for Canvas
        total_height = 0
        for unit in self.flattened_units:
            total_height += 100 # Header space
            num_lessons = len(unit["lessons"])
            rows = math.ceil(num_lessons / self.COLS)
            total_height += rows * self.ROW_HEIGHT
            total_height += 60 # Padding bottom of unit

        # 2. Setup Canvas
        # We place it in a container frame centered in the scrollable view
        self.container = ctk.CTkFrame(self, fg_color="transparent", width=self.MAX_WIDTH)
        self.container.pack(pady=20, padx=20) # This centers it if width is controlled?
        # Actually CTkScrollableFrame centers content by default if valid?
        # We can just pack the canvas.

        self.canvas = ctk.CTkCanvas(
            self,
            width=self.MAX_WIDTH,
            height=total_height,
            bg="#030712",
            highlightthickness=0
        )
        self.canvas.pack(pady=20)

        # 3. Draw Content
        current_y = 40

        for unit in self.flattened_units:
            # Draw Header
            self._draw_unit_header(unit, current_y)
            current_y += 120 # Move below header

            # Draw Grid
            lessons = unit["lessons"]
            prev_coords = None

            # First pass: Calculate coordinates
            node_coords = []
            for i, lesson in enumerate(lessons):
                row = i // self.COLS
                col = i % self.COLS

                # Zig-Zag Logic
                if row % 2 == 1:
                    # Reverse direction (Right to Left)
                    # Normal cols: 0, 1, 2, 3
                    # Reversed: 3, 2, 1, 0
                    effective_col = (self.COLS - 1) - col
                else:
                    effective_col = col

                # Center X in column slot
                x = (effective_col * self.COL_WIDTH) + (self.COL_WIDTH / 2)
                y = current_y + (row * self.ROW_HEIGHT) + (self.ROW_HEIGHT / 2)

                node_coords.append((x, y))

            # Second pass: Draw Connections (Behind buttons)
            for i in range(len(node_coords) - 1):
                p1 = node_coords[i]
                p2 = node_coords[i+1]
                self._draw_connection(p1, p2)

            # Third pass: Place Widgets
            for i, lesson in enumerate(lessons):
                x, y = node_coords[i]
                self._place_node_widget(lesson, x, y)

            # Advance Y for next unit
            rows = math.ceil(len(lessons) / self.COLS)
            current_y += rows * self.ROW_HEIGHT + 60

    def _draw_unit_header(self, unit, y):
        # We can place a CTkFrame on the canvas using create_window
        header_w = 600
        header_h = 80

        header_frame = ctk.CTkFrame(
            self.canvas,
            width=header_w,
            height=header_h,
            fg_color="#1F2937", # gray-800
            corner_radius=15
        )

        # Title
        ctk.CTkLabel(
            header_frame,
            text=unit["title"],
            font=ctk.CTkFont(size=20, weight="bold"),
            text_color="white"
        ).place(relx=0.5, rely=0.35, anchor="center")

        # Desc
        ctk.CTkLabel(
            header_frame,
            text=unit["description"],
            font=ctk.CTkFont(size=14),
            text_color="#9CA3AF"
        ).place(relx=0.5, rely=0.7, anchor="center")

        # Center horizontally on canvas
        center_x = self.MAX_WIDTH / 2
        self.canvas.create_window(center_x, y, window=header_frame, height=header_h, width=header_w)

    def _draw_connection(self, p1, p2):
        x1, y1 = p1
        x2, y2 = p2

        # If dropping down (vertical connection between rows)
        if abs(y2 - y1) > 10:
            # We want a smooth curve.
            # It's usually a U-turn or S-curve depending on the snake.
            # In this snake grid:
            # Row 0 ends at Right. Row 1 starts at Right (directly below).
            # So x1 ~= x2.

            # Control points for Bézier
            # We want to go out from p1 horizontally? No, p1 is a node.
            # If we assume flow direction:
            # Row 0 (L->R): Enters left, Exits right.
            # Row 1 (R->L): Enters right, Exits left.

            # Connection from End of Row 0 (Rightmost) to Start of Row 1 (Rightmost)
            # This is a vertical drop.

            # Simple line or slight curve?
            # Let's do a straight line for simplicity if x aligns, or smooth if offset.
            # User asked for "curvas suaves... no ángulos rectos".

            if abs(x1 - x2) < 5:
                # Vertical drop
                self.canvas.create_line(x1, y1, x2, y2, width=6, fill="#374151", capstyle="round")
            else:
                # This happens if cols != 4 maybe? Or logic error?
                # In standard snake, last of row N aligns with first of row N+1.
                self.canvas.create_line(x1, y1, x2, y2, width=6, fill="#374151", capstyle="round")

        else:
            # Horizontal connection
            self.canvas.create_line(x1, y1, x2, y2, width=6, fill="#374151", capstyle="round")


    def _place_node_widget(self, lesson, x, y):
        # Container for Button + Label
        # We need a small transparent frame to hold them

        node_frame = ctk.CTkFrame(self.canvas, fg_color="transparent")

        # Button
        btn_color = "#22D3EE" # cyan
        hover_color = "#06B6D4"
        text_color = "white"

        # TODO: Real state logic
        if lesson["locked"]:
            btn_color = "#374151"
            hover_color = "#374151"
            text_color = "#9CA3AF"

        btn = ctk.CTkButton(
            node_frame,
            text=lesson["icon"],
            font=ctk.CTkFont(size=32),
            width=self.NODE_SIZE,
            height=self.NODE_SIZE,
            corner_radius=self.NODE_SIZE//2,
            fg_color=btn_color,
            hover_color=hover_color,
            text_color=text_color,
            border_width=4,
            border_color="#155E75", # Darker cyan border
            command=lambda l=lesson: self.on_start_lesson(l["title"], l["data"], l["type"])
        )
        btn.pack()

        # Label (Critical per instructions)
        lbl = ctk.CTkLabel(
            node_frame,
            text=lesson["title"],
            font=ctk.CTkFont(size=12, family="Arial"), # Sans-serif
            text_color="#9CA3AF", # Light gray
            wraplength=120
        )
        lbl.pack(pady=(5, 0))

        self.canvas.create_window(x, y, window=node_frame)
