.PHONY: up down build logs

# Load .env file if it exists
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

up:
	docker-compose -f docker-compose.prod.yml up -d

down:
	docker-compose -f docker-compose.prod.yml down

build:
	docker-compose -f docker-compose.prod.yml build

logs:
	docker-compose -f docker-compose.prod.yml logs -f
