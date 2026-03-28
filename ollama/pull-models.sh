#!/bin/bash
ollama serve & 
sleep 5
echo "📥 Scaricando Llama 3.1 8B..."
ollama pull llama3.1:8b
echo "📥 Scaricando modello di Embedding (Nomic)..."
ollama pull nomic-embed-text
wait
