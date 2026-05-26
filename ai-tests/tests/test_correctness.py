import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from deepeval import assert_test
from deepeval.metrics import GEval
from deepeval.test_case import (
    LLMTestCase,
    LLMTestCaseParams
)

from ollama_model import OllamaModel


ollama = OllamaModel(model="llama3.2:3b")


correctness_metric = GEval(
    name="Correctness",
    criteria="Determina si la respuesta es correcta",
    evaluation_params=[
        LLMTestCaseParams.INPUT,
        LLMTestCaseParams.ACTUAL_OUTPUT
    ],
    evaluation_steps=[
        "Verifica que la respuesta responda la pregunta",
        "Verifica precisión",
        "Verifica coherencia"
    ],
    model=ollama
)


def test_login_response():

    test_case = LLMTestCase(
        input="¿Qué hace el módulo login?",
        actual_output="El módulo login autentica usuarios mediante correo y contraseña."
    )

    assert_test(test_case, [correctness_metric])