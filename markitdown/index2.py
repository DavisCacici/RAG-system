from markitdown import MarkItDown
from openai import OpenAI
import os

# OpenAI-compatible client that points to local Ollama server.
client = OpenAI(
    base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1"),
    api_key=os.getenv("OLLAMA_API_KEY", "ollama"),
)

md = MarkItDown(
    llm_client=client,
    llm_model="qwen3.5:4b",
    llm_prompt="optional custom prompt",
)

directory = "../data"
dir_dest = "../data_markdown"
files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]

for file in files:
    file_path = os.path.join(directory, file)
    result = md.convert(file_path)
    print(f"=== {file} ===")
    output_file = os.path.join(dir_dest, f"{os.path.splitext(file)[0]}.md")
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(result.text_content)
