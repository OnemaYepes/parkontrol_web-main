import os
import sys

# Busca el camino hacia la carpeta "ai-tests" sin importar qué tan profundo esté este archivo de prueba
current_path = os.path.abspath(os.path.dirname(__file__))
while current_path and os.path.basename(current_path) != "ai-tests":
    parent = os.path.dirname(current_path)
    if parent == current_path:  # Llegó a la raíz del disco duro y no lo encontró
        break
    current_path = parent

# Si encontró "ai-tests", lo inyecta al path de Python
if os.path.basename(current_path) == "ai-tests":
    if current_path not in sys.path:
        sys.path.insert(0, current_path)
else:
    # Plan B: Si no lo encuentra, usa el directorio actual de ejecución de la terminal
    sys.path.insert(0, os.getcwd())

# 2. AHORA SÍ, HAZ LOS IMPORTS
from deepeval import assert_test
from deepeval.metrics import AnswerRelevancyMetric, FaithfulnessMetric
from deepeval.test_case import LLMTestCase, LLMTestCaseParams

# Esto ya no debería fallar porque 'ai-tests' está en el path
from tests.common import load_login_context
from ollama_model import OllamaModel

# 2. Instanciar el modelo que se usará para evaluar
# (Asegúrate de que OllamaModel herede correctamente de DeepEvalBaseLLM)
ollama_evaluator = OllamaModel(model="llama3.2:3b")


def test_rag_login_response():
    """Evalúa una respuesta de chatbot/agente que usa contexto RAG

    para explicar si el login fue exitoso.
    """

    # 3. Cargar el contexto (Debe ser un string)
    context_text = load_login_context()

    # Validamos que sea string para evitar errores en DeepEval
    rag_context = [str(context_text)]

    test_case = LLMTestCase(
        input="¿El login fue exitoso?",
        actual_output="Sí, el inicio de sesión fue correcto y redirigió al dashboard.",
        expected_output="Sí, el login fue exitoso.",
        retrieval_context=rag_context,
    )

    # 4. Pasar el modelo correcto a las métricas
    metrics = [
        AnswerRelevancyMetric(threshold=0.5, model=ollama_evaluator),
        FaithfulnessMetric(threshold=0., model=ollama_evaluator),
    ]

    # 5. Ejecutar la aserción de DeepEval
    assert_test(test_case, metrics)