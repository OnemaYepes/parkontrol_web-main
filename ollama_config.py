from langchain_community.chat_models import ChatOllama

def get_ollama_model():
    return ChatOllama(
        model="llama3.2:3b",
        base_url="http://localhost:11434",
        temperature=0
    )