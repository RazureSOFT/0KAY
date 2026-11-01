"""Markdown extras: code colouring, mermaid diagrams, formulas."""

import unittest

from kit import markdown
from kit.theme import build

THEME = build("dark")


def rows(source, width=60):
    return ["".join(text for text, _ in row)
            for row in markdown.render(source, width, THEME)]


def colours(row):
    """Distinct colours in a row, ignoring the code gutter."""
    return {span.fg for text, span in row
            if span is not None and text != markdown.CODE_GUTTER}


FENCE = "`" * 3


class CodeColouring(unittest.TestCase):
    def test_keywords_strings_and_comments_get_their_own_colour(self):
        source = (FENCE + "python\n"
                  "def greet(name):\n"
                  "    # say hi\n"
                  "    return 'hello ' + name\n"
                  + FENCE)
        rendered = markdown.render(source, 60, THEME)
        body = [row for row in rendered if "return" in "".join(t for t, _ in row)][0]
        self.assertGreaterEqual(len(colours(body)), 3,
                                "keyword, string and punctuation differ")

    def test_an_unknown_language_stays_plain(self):
        source = FENCE + "klingon\nQapla'\n" + FENCE
        rendered = markdown.render(source, 60, THEME)
        body = [row for row in rendered if "Qapla" in "".join(t for t, _ in row)][0]
        self.assertEqual(len(colours(body)), 1)

    def test_long_code_lines_are_sliced_not_reflowed(self):
        source = FENCE + "python\nx = '" + "a" * 200 + "'\n" + FENCE
        rendered = rows(source, 40)
        for line in rendered:
            self.assertLessEqual(len(line), 40)


class Mermaid(unittest.TestCase):
    def test_a_chain_becomes_boxes(self):
        source = (FENCE + "mermaid\n"
                  "graph TD\n"
                  "  A[Start] --> B{Check}\n"
                  "  B --> C[Done]\n"
                  + FENCE)
        text = chr(10).join(rows(source))
        self.assertIn("│ Start │", text)
        self.assertIn("│ Check │", text)
        self.assertIn("│ Done │", text)
        self.assertIn("▼", text)

    def test_a_branching_graph_lists_its_edges(self):
        source = (FENCE + "mermaid\n"
                  "graph TD\n"
                  "  A[Start] --> B[Left]\n"
                  "  A --> C[Right]\n"
                  + FENCE)
        text = chr(10).join(rows(source))
        self.assertIn("Start  ──▶  Left", text)
        self.assertIn("Start  ──▶  Right", text)

    def test_edge_labels_are_shown(self):
        source = (FENCE + "mermaid\n"
                  "graph TD\n"
                  "  A{OK?} -->|yes| B[Go]\n"
                  + FENCE)
        text = chr(10).join(rows(source))
        self.assertIn("yes", text)

    def test_the_diagram_fits_the_width(self):
        source = (FENCE + "mermaid\n"
                  "graph TD\n"
                  "  A[" + "x" * 120 + "] --> B[end]\n"
                  + FENCE)
        for line in rows(source, 40):
            self.assertLessEqual(len(line), 40)


class Formulas(unittest.TestCase):
    def test_greek_and_fractions(self):
        text = "".join(rows("Euler: $\\alpha + \\beta = \\frac{1}{2}$"))
        self.assertIn("α", text)
        self.assertIn("β", text)
        self.assertIn("(1)/(2)", text)

    def test_square_roots_and_superscripts(self):
        text = "".join(rows("$$\\sqrt{x^2 + y^2}$$"))
        self.assertIn("√(x² + y²)", text)

    def test_subscripts(self):
        text = "".join(rows("$a_1 + a_2$"))
        self.assertIn("a₁", text)

    def test_a_block_formula_is_indented(self):
        lines = rows("$$x^2$$")
        self.assertTrue(any(line.startswith("  ") for line in lines))

    def test_unknown_commands_keep_their_name(self):
        text = "".join(rows("$\\weirdthing$"))
        self.assertIn("weirdthing", text)

    def test_dollars_that_are_not_a_formula_are_left_alone(self):
        self.assertIn("costs $5", "".join(rows("it costs $5 and $6 total")))


if __name__ == "__main__":
    unittest.main()
