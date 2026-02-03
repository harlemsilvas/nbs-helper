#!/bin/bash

echo "🚀 Setup GitHub Remote"
echo ""
echo "Digite seu username do GitHub:"
read github_user

echo ""
echo "Digite o nome do repositório (padrão: nbs-helper):"
read repo_name
repo_name=${repo_name:-nbs-helper}

echo ""
echo "Configurando remote..."
git remote add origin "https://github.com/$github_user/$repo_name.git"

echo ""
echo "✅ Remote configurado!"
echo ""
echo "Agora execute:"
echo "  git push -u origin main"
echo ""
echo "Depois acesse:"
echo "  https://github.com/$github_user/$repo_name"
