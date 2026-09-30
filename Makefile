# ARCHITECT_OS — Markdown Live Editor
# Usage: make help

SHELL := /bin/bash
NPM   := npm

.PHONY: help install setup env dev backend frontend server client build start lint preview clean docker

## Affiche les commandes disponibles
help:
	@echo ""
	@echo "  ARCHITECT_OS — commandes Make"
	@echo ""
	@echo "  make install     Installe les dépendances (npm install)"
	@echo "  make setup       install + copie .env.example → .env si absent"
	@echo "  make dev         Lance le backend + frontend (recommandé)"
	@echo "  make backend     Lance uniquement l'API fichiers (port 3001)"
	@echo "  make frontend    Lance uniquement Vite (port 5173)"
	@echo "  make build       Compile le client pour la production"
	@echo "  make start       Build + serveur unique (API + dist sur :3001)"
	@echo "  make docker      Build et lance via docker compose"
	@echo "  make lint        ESLint"
	@echo "  make preview     Preview Vite du build (client seul)"
	@echo "  make clean       Supprime dist/ et le cache Vite"
	@echo ""
	@echo "  Alias: make server = backend, make client = frontend"
	@echo ""

## Installe les dépendances
install:
	$(NPM) install

## Crée .env depuis .env.example si nécessaire
env:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		SECRET=$$(openssl rand -hex 32 2>/dev/null || head -c 32 /dev/urandom | xxd -p); \
		if [ -n "$$SECRET" ]; then \
			sed -i "s/^SESSION_SECRET=.*/SESSION_SECRET=$$SECRET/" .env; \
		fi; \
		echo "✓ .env créé depuis .env.example (SESSION_SECRET généré)"; \
	else \
		echo "✓ .env existe déjà"; \
	fi

## install + env + rebuild native modules
setup: install env
	$(NPM) rebuild better-sqlite3

## Backend + frontend en parallèle
dev:
	$(NPM) run dev

## API fichiers locale (workspace/ sur disque)
backend server:
	$(NPM) run dev:server

## Interface React (Vite)
frontend client:
	$(NPM) run dev:client

## Build production du client
build:
	$(NPM) run build

## Build puis serveur unique (http://localhost:3001)
start: build
	$(NPM) run start

## Production via Docker Compose
docker:
	docker compose up -d --build

## Vérification ESLint
lint:
	$(NPM) run lint

## Preview du build Vite (sans API)
preview:
	$(NPM) run preview

## Nettoie les artefacts de build
clean:
	rm -rf dist dist-ssr node_modules/.vite
	@echo "✓ dist/ et cache Vite supprimés"
