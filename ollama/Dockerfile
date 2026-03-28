FROM ollama/ollama:0.18.2

# Copiamo uno script che scarica i modelli all'avvio
COPY ./pull-models.sh /pull-models.sh
RUN chmod +x /pull-models.sh

ENTRYPOINT ["/bin/sh", "/pull-models.sh"]
