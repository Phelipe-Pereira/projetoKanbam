# Sistema de Gestão de Chamados de TI

Este é um projeto mockado de sistema web para gestão de chamados técnicos de TI, desenvolvido como apresentação acadêmica. O sistema simula um fluxo Kanban para acompanhamento de solicitações.

## Funcionalidades

- **Tela de Login**: Autenticação simulada (sem validação real)
- **Dashboard Kanban**: Visualização dos chamados em 4 colunas (Recebido, Em análise, Em revisão, Concluído)
- **Criação de Chamados**: Formulário para abrir novas solicitações
- **Detalhes do Chamado**: Visualização completa das informações

## Estrutura do Projeto

```
projetoKanbam/
├── index.html          # Tela de login
├── pages/
│   ├── dashboard.html  # Dashboard Kanban
│   ├── create.html     # Criação de chamado
│   └── detail.html     # Detalhes do chamado
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── dashboard.css
│   ├── js/
│   │   ├── app.js      # Lógica do login
│   │   ├── dashboard.js # Lógica do Kanban
│   │   ├── create.js   # Lógica de criação
│   │   └── detail.js   # Lógica de detalhes
│   └── json/
│       └── requests.json # Dados mockados
```

## Tecnologias Utilizadas

- HTML5
- CSS3 (com Bootstrap 5)
- JavaScript (ES6+)
- Bootstrap 5 para layout responsivo

## Como Executar

1. Instale as dependências: `npm install`
2. Inicie o servidor: `node server.js`
3. Abra o navegador em `http://localhost:3001`
4. Faça login (qualquer email/senha)
5. Navegue pelo sistema

## Dados Mockados

Os chamados são carregados do arquivo `assets/json/requests.json`. Novos chamados criados são armazenados no localStorage do navegador.

## Destaques Visuais

- **Chamados críticos** (impacto = true): Fundo vermelho e badge "Crítico"
- **Chamados com alta afetados** (>10 pessoas): Card maior e sombra mais pronunciada

## Navegação

- Login → Dashboard
- Dashboard → Criar Chamado / Ver Detalhes
- Criar → Dashboard (após criação)
- Detalhes → Dashboard (botão voltar)

Este projeto é puramente para demonstração e não possui backend real.