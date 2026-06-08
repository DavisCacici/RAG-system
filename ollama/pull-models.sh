#!/bin/bash
ollama serve & 
sleep 5
echo "📥 Scaricando Qwen 3.5 4B..."
ollama pull qwen3.5:4b
echo "📥 Scaricando modello di Embedding (Nomic)..."
ollama pull nomic-embed-text
wait
