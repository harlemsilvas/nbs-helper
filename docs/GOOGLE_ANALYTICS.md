# Google Analytics - Setup

## 📊 Como Configurar o Google Analytics

### 1. Criar Conta no Google Analytics

1. Acesse: https://analytics.google.com
2. Clique em **"Começar a medir"** (ou "Start measuring")
3. Configure sua conta:
   - **Nome da conta:** NBS Helper (ou seu nome)
   - **País:** Brasil
   - Aceite os termos

### 2. Criar Propriedade

1. **Nome da propriedade:** NBS Helper
2. **Fuso horário:** (GMT-03:00) Brasília
3. **Moeda:** Real brasileiro (BRL)
4. Clique em **Avançar**

### 3. Sobre sua empresa

1. **Setor:** Tecnologia / Software
2. **Tamanho:** Pequeno (1-10 funcionários)
3. **Clique em Avançar**

### 4. Metas de negócio

Selecione:
- ✅ Gerar leads
- ✅ Aumentar o engajamento do usuário
- Clique em **Criar**

### 5. Configurar Coleta de Dados - Web

1. Selecione plataforma: **Web**
2. **URL do website:** Sua URL da Vercel (ex: https://nbs-helper.vercel.app)
3. **Nome do stream:** NBS Helper Web
4. Clique em **Criar stream**

### 6. Copiar o ID de Medição

Você verá algo como: `G-XXXXXXXXXX`

**Copie esse ID!**

### 7. Configurar no Projeto

#### Opção A: Variável de Ambiente (Recomendado)

1. Edite o arquivo `apps/web/.env.local`:
```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

2. Atualize `apps/web/index.html`, substituindo `G-XXXXXXXXXX` por seu ID real

#### Opção B: Direto no HTML

Edite `apps/web/index.html` e substitua `G-XXXXXXXXXX` pelo seu ID:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SEU-ID-AQUI"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-SEU-ID-AQUI');
</script>
```

### 8. Deploy

Faça commit e push das alterações:

```bash
git add .
git commit -m "feat: configurar Google Analytics"
git push
```

A Vercel vai fazer redeploy automaticamente.

### 9. Verificar se Está Funcionando

1. Acesse seu site na Vercel
2. Volte no Google Analytics
3. Vá em **Relatórios** > **Tempo real**
4. Você deve ver seu acesso aparecendo!

---

## 📈 Eventos Rastreados

O projeto já rastreia automaticamente:

- ✅ **Buscas:** Termo buscado + número de resultados
- ✅ **Copiar código:** Qual código foi copiado
- ✅ **Copiar descrição:** Qual descrição foi copiada
- ✅ **Favoritos:** Adicionar/remover favoritos
- ✅ **Visualizar favoritos:** Quando o usuário abre a lista
- ✅ **Mudança de página:** Navegação entre páginas

### Ver Eventos no GA

1. Acesse Google Analytics
2. Vá em **Relatórios** > **Engajamento** > **Eventos**
3. Você verá:
   - `search` - Buscas realizadas
   - `copy` - Códigos copiados
   - `favorite` - Favoritos
   - `view_favorites` - Visualizações de favoritos
   - `page_change` - Mudanças de página

---

## 🎯 Métricas Importantes

Com esses dados você pode descobrir:

1. **Códigos mais buscados:** Quais serviços são mais populares
2. **Códigos mais copiados:** Quais códigos as pessoas realmente usam
3. **Taxa de conversão:** % de buscas que resultam em cópia
4. **Engajamento:** Quantas pessoas usam favoritos
5. **Comportamento:** Quantas páginas as pessoas navegam

---

## 🔒 Privacidade

O Google Analytics coleta dados de forma anônima e agregada. 

Você pode adicionar um aviso de cookies/privacidade se quiser estar em conformidade com LGPD/GDPR.

---

## 🚀 Próximo Passo

Depois de 1 semana com dados, você pode:
- Criar relatórios customizados
- Configurar metas (ex: X cópias por semana)
- Entender o perfil dos usuários
- Otimizar os códigos mais populares
