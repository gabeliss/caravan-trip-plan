# Caravan Trip Planner Makefile

# Variables
PYTHON := python3
VENV := backend/venv
VENV_ACTIVATE := $(VENV)/bin/activate
FLASK_APP := backend/app.py
BACKEND_PORT := 5001
FRONTEND_DIR := frontend
FRONTEND_PORT := 5173
PIP_TIMEOUT := 60

# Colors for terminal output
YELLOW := \033[1;33m
GREEN := \033[1;32m
NC := \033[0m # No Color

.PHONY: all setup backend frontend both clean help fix-backend-deps

# Default target
all: help

# Setup environment
setup: setup-backend setup-frontend
	@echo "$(GREEN)Setup complete. You can now run 'make backend', 'make frontend', or 'make both'$(NC)"

setup-backend:
	@echo "$(YELLOW)Setting up backend...$(NC)"
	@if [ ! -d $(VENV) ]; then \
		$(PYTHON) -m venv $(VENV); \
	fi
	@. $(VENV_ACTIVATE) && pip install --upgrade pip
	@. $(VENV_ACTIVATE) && ( \
		pip install --timeout $(PIP_TIMEOUT) -r backend/requirements.txt || \
		(echo "$(YELLOW)Regular installation failed, trying one-by-one installation...$(NC)" && \
		$(MAKE) fix-backend-deps) \
	)
	@echo "$(GREEN)Backend setup complete$(NC)"

fix-backend-deps:
	@echo "$(YELLOW)Installing dependencies one by one to avoid resolver issues...$(NC)"
	@if [ ! -d $(VENV) ]; then \
		$(PYTHON) -m venv $(VENV); \
	fi
	@. $(VENV_ACTIVATE) && pip install --upgrade pip
	@. $(VENV_ACTIVATE) && xargs -n 1 pip install --timeout $(PIP_TIMEOUT) < backend/requirements.txt
	@echo "$(GREEN)Backend dependencies fixed$(NC)"

setup-frontend:
	@echo "$(YELLOW)Setting up frontend...$(NC)"
	@cd $(FRONTEND_DIR) && npm install
	@echo "$(GREEN)Frontend setup complete$(NC)"

# Run backend
backend:
	@echo "$(YELLOW)Starting backend server on port $(BACKEND_PORT)...$(NC)"
	@. $(VENV_ACTIVATE) && $(PYTHON) $(FLASK_APP)

# Run frontend
frontend:
	@echo "$(YELLOW)Starting frontend server on port $(FRONTEND_PORT)...$(NC)"
	@cd $(FRONTEND_DIR) && npm run dev

# Run both frontend and backend
both:
	@echo "$(YELLOW)Starting both frontend and backend servers...$(NC)"
	@(trap 'kill 0' SIGINT; \
		(. $(VENV_ACTIVATE) && $(PYTHON) $(FLASK_APP)) & \
		(cd $(FRONTEND_DIR) && npm run dev) & \
		wait)

# Clean up generated files
clean:
	@echo "$(YELLOW)Cleaning up...$(NC)"
	@rm -rf $(VENV)
	@rm -rf $(FRONTEND_DIR)/node_modules
	@rm -rf $(FRONTEND_DIR)/dist
	@echo "$(GREEN)Cleanup complete$(NC)"

# Display help information
help:
	@echo "$(YELLOW)Caravan Trip Planner Makefile$(NC)"
	@echo "Available commands:"
	@echo "  $(GREEN)make setup$(NC)        - Set up both backend and frontend dependencies"
	@echo "  $(GREEN)make setup-backend$(NC) - Set up backend dependencies only"
	@echo "  $(GREEN)make setup-frontend$(NC) - Set up frontend dependencies only"
	@echo "  $(GREEN)make fix-backend-deps$(NC) - Fix backend dependencies when pip gets stuck"
	@echo "  $(GREEN)make backend$(NC)      - Run the backend server only"
	@echo "  $(GREEN)make frontend$(NC)     - Run the frontend server only"
	@echo "  $(GREEN)make both$(NC)         - Run both frontend and backend servers"
	@echo "  $(GREEN)make clean$(NC)        - Clean up generated files and directories"
	@echo "  $(GREEN)make help$(NC)         - Display this help message" 