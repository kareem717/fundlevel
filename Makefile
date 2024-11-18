#!make
include .env.local

build:
	@go build -o bin/fundlevel main.go

run: build
	@./bin/proj

install:
	@go get ./...
	@go mod vendor
	@go mod tidy
	@go mod download


test:
	@echo "Testing..."
	@go test ./... -v

watch:
	@air -c .air.toml

db-start:
	@cd ${SUPABASE_DIRECTORY} && source .env && supabase start && cd ..

db-stop:
	@cd ${SUPABASE_DIRECTORY} && source .env && supabase stop && cd ..

db-restart: 
	@make db-stop && make db-start

db-status:
	@echo "=== Supabase Status ==="
	@if [ -d "${SUPABASE_DIRECTORY}" ]; then \
		cd ${SUPABASE_DIRECTORY} && source .env && supabase status && cd ..; \
	else \
		echo "Error: Supabase directory not found at ${SUPABASE_DIRECTORY}"; \
		exit 1; \
	fi
	@echo "\n=== Migration Status ==="
	@GOOSE_DRIVER=${GOOSE_DRIVER} GOOSE_DBSTRING='${DATABASE_URL}' goose -dir=${GOOSE_MIGRATIONS_PATH} status || \
		(echo "Error: Failed to get migration status" && exit 1)

db-seed:
	@npx tsx seed.ts
	
db-up:
	@GOOSE_DRIVER=${GOOSE_DRIVER} GOOSE_DBSTRING='${DATABASE_URL}' goose -dir=${GOOSE_MIGRATIONS_PATH} up

db-up-one:
	@GOOSE_DRIVER=${GOOSE_DRIVER} GOOSE_DBSTRING='${DATABASE_URL}' goose -dir=${GOOSE_MIGRATIONS_PATH} up-by-one 

db-down:
	@GOOSE_DRIVER=${GOOSE_DRIVER} GOOSE_DBSTRING='${DATABASE_URL}' goose -dir=${GOOSE_MIGRATIONS_PATH} down

db-reset:
	@GOOSE_DRIVER=${GOOSE_DRIVER} GOOSE_DBSTRING='${DATABASE_URL}' goose -dir=${GOOSE_MIGRATIONS_PATH} reset