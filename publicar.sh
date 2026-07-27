#!/bin/bash
# Publica Farma Básica en GitHub y abre Render para el servidor.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

REPO_NAME="${1:-farma-basica}"
VISIBILITY="${2:-public}"

echo "=== Farma Básica — publicar en GitHub + Render ==="
echo ""

if ! command -v gh >/dev/null 2>&1; then
  echo "Instalando GitHub CLI (gh)..."
  brew install gh
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Inicia sesión en GitHub (solo una vez):"
  gh auth login -h github.com -p https -w
fi

GH_USER="$(gh api user -q .login)"
echo "Cuenta GitHub: $GH_USER"
echo ""

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  git init -b main
fi

CURRENT_BRANCH="$(git branch --show-current 2>/dev/null || echo main)"
if [ "$CURRENT_BRANCH" != "main" ]; then
  git branch -M main
fi

if ! git diff --cached --quiet 2>/dev/null || [ -n "$(git status --porcelain)" ]; then
  git add -A
  if git diff --cached --quiet; then
    echo "No hay cambios nuevos para commitear."
  else
    git commit -m "$(cat <<'EOF'
Publicar Farma Básica con servidor de progreso.

Incluye app educativa, API Node y configuración Render.
EOF
)"
  fi
fi

if git remote get-url origin >/dev/null 2>&1; then
  echo "Remote origin ya existe. Haciendo push..."
  git push -u origin main
else
  echo "Creando repo github.com/$GH_USER/$REPO_NAME ..."
  gh repo create "$REPO_NAME" --"$VISIBILITY" --source=. --remote=origin --push --description "App educativa Farma Básica con progreso de alumnos"
fi

REPO_URL="https://github.com/$GH_USER/$REPO_NAME"
RENDER_URL="https://dashboard.render.com/blueprint/new?repo=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$REPO_URL'))")"

echo ""
echo "✓ Código en GitHub: $REPO_URL"
echo ""
echo "Siguiente paso (servidor gratis):"
echo "  1. Se abrirá Render en el navegador."
echo "  2. Conecta tu cuenta (puedes usar «Sign in with GitHub»)."
echo "  3. Pulsa «Apply» — usa el render.yaml del repo."
echo "  4. Cuando termine, copia la URL (ej. https://farma-basica.onrender.com)."
echo "  5. Tus alumnos entran ahí. Panel profesor: Shift+P."
echo "  6. Clave profesor: Render → Environment → PROFESSOR_KEY"
echo ""
echo "Abriendo Render..."
open "$RENDER_URL" 2>/dev/null || xdg-open "$RENDER_URL" 2>/dev/null || echo "$RENDER_URL"
