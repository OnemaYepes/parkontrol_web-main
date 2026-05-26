from deepeval.models.base_model import DeepEvalBaseLLM
from langchain_ollama import ChatOllama


class OllamaModel(DeepEvalBaseLLM):

    def __init__(self, model="llama3.2:3b"):
        self.model = ChatOllama(model=model)

    def load_model(self):
        return self.model

    def generate(self, prompt: str) -> str:
        response = self.model.invoke(prompt)
        return response.content

    async def a_generate(self, prompt: str) -> str:
        response = await self.model.ainvoke(prompt)
        return response.content

    def get_model_name(self):
        return "Ollama Llama3"