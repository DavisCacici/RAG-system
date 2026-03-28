.PHONY: run stop restart logs ps clean shell-n8n shell-ollama shell-qdrant

run:
	docker compose up -d --build

stop:
	docker compose down

restart: stop run

logs:
	docker compose logs -f

ps:
	docker compose ps

clean:
	docker compose down -v --rmi local

shell-n8n:
	docker compose exec n8n bash

shell-ollama:
	docker compose exec ollama bash

shell-qdrant:
	docker compose exec qdrant bash