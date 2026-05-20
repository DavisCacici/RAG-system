#!/bin/bash
ollama serve & 
sleep 5
echo "📥 Scaricando Qwen 3.5 9B..."
ollama pull qwen3.5:9b
echo "📥 Scaricando modello di Embedding (Nomic)..."
ollama pull nomic-embed-text
wait
