from pathlib import Path

def load_login_context():
    context_path = Path(__file__).resolve().parents[1] / "rag" / "login_context.txt"
    return context_path.read_text(encoding="utf-8")