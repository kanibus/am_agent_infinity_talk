# am_agent_infinity_talk

Aplicação web de página única para o fluxo PPVG descrito no PRD.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior (recomendado)

## Executando localmente

1. Instale as dependências do projeto (não há dependências externas, mas este passo garante que o `package.json` esteja registrado):
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
3. Acesse [http://localhost:3000](http://localhost:3000) no navegador para visualizar o app.

O servidor utiliza Node.js nativo para servir os arquivos estáticos presentes na raiz do projeto. Caso deseje utilizar outra porta, execute:

```bash
PORT=4000 npm start
```

## Estrutura

- `index.html` – estrutura base da SPA.
- `styles.css` – estilos principais e responsivos.
- `app.js` – lógica do assistente PPVG.
- `server.js` – servidor HTTP estático simples para desenvolvimento local.
- `PRD.txt` – documento de requisitos do produto.
- `SESSION_LOG.md` – registro das sessões de desenvolvimento.
- `QA_STATUS.md` – status atual de QA.

## Scripts disponíveis

- `npm start` – inicia o servidor local em `http://localhost:3000`.

## Próximos passos sugeridos

- Integrar APIs reais de autenticação e geração de roteiro.
- Configurar pipeline de build/deploy automatizado.
- Adicionar suíte de testes automatizados (unitários e e2e).
