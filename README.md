# am_agent_infinity_talk

Aplicação web de página única para o fluxo PPVG descrito no PRD.

## Pré-requisitos

- Navegador moderno compatível com ES6.
- Opcional: Python 3 (já vem instalado na maioria dos sistemas) ou qualquer servidor HTTP estático equivalente.

## Executando localmente (sem npm)

1. Abra um terminal na raiz do projeto: `cd /workspace/am_agent_infinity_talk` (ajuste o caminho conforme necessário).
2. Suba um servidor estático usando Python 3:
   ```bash
   python3 -m http.server 8000
   ```
   > Você pode trocar `8000` por outra porta se preferir.
3. Acesse [http://localhost:8000](http://localhost:8000) no navegador para visualizar o app.
4. Sempre que salvar alterações em `index.html`, `styles.css` ou `app.js`, atualize o navegador para refletir as mudanças.

Alternativas:
- Use a extensão **Live Server** do VS Code (botão "Go Live").
- Utilize qualquer outro servidor HTTP estático (por exemplo, `ruby -run -ehttpd . -p8000`).

## Estrutura

- `index.html` – estrutura base da SPA.
- `styles.css` – estilos principais e responsivos.
- `app.js` – lógica do assistente PPVG.
- `PRD.txt` – documento de requisitos do produto.
- `SESSION_LOG.md` – registro das sessões de desenvolvimento.
- `QA_STATUS.md` – status atual de QA.

## Próximos passos sugeridos

- Integrar APIs reais de autenticação e geração de roteiro.
- Configurar pipeline de build/deploy automatizado.
- Adicionar suíte de testes automatizados (unitários e e2e).
