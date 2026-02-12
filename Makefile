.PHONY: up down build logs

# Load .env file if it exists
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

# Force using "docker compose" (v2) which is standard now
DOCKER_COMPOSE_CMD := docker compose

up:
	$(DOCKER_COMPOSE_CMD) -f docker-compose.prod.yml up -d

down:
	$(DOCKER_COMPOSE_CMD) -f docker-compose.prod.yml down

build:
	$(DOCKER_COMPOSE_CMD) -f docker-compose.prod.yml build

logs:
	$(DOCKER_COMPOSE_CMD) -f docker-compose.prod.yml logs -f
