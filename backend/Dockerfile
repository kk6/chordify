# syntax=docker/dockerfile:1.10

# === Build Stage ===
FROM python:3.12-slim AS builder
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Disable Python downloads, because we want to use the system interpreter
ENV UV_PYTHON_DOWNLOADS=0

# Change the working directory to the `app` directory
WORKDIR /app

# Create virtual environment
RUN uv venv .venv

# Install dependencies from lockfile
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --python .venv/bin/python --frozen --no-install-project --no-editable

# Copy the project into the intermediate image
COPY . /app

# Install project itself
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --python .venv/bin/python --frozen

# === Final Stage ===
FROM python:3.12-slim

# Create non-root user
RUN groupadd -r app && useradd -r -g app app

# Copy the application from the builder
COPY --from=builder --chown=app:app /app /app

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

WORKDIR /app

# Add healthcheck for container orchestration systems
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8000/ || exit 1

# Switch to non-root user
USER app

# Default command for development
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
