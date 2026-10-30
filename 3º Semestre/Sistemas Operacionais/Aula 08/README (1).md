# MoneyMap — Explorador Econômico

Aplicação web para **visualizar, converter e comparar informações econômicas**, com foco em moedas, câmbio e indicadores brasileiros (IPCA e Selic).

> **Aviso:** o MoneyMap é uma plataforma informativa e de visualização de dados. Não é corretora, banco nem serviço de recomendação financeira, e não realiza operações, investimentos ou transações reais.

**🔗 Demonstração online:** <https://money-map-so.netlify.app/>

## Sumário

1. [Objetivo](#1-objetivo) · 2. [Problema](#2-problema-que-pretende-resolver) · 3. [Escopo](#3-escopo)
4. [Requisitos funcionais](#4-requisitos-funcionais) · 5. [Requisitos não funcionais](#5-requisitos-não-funcionais)
6. [Tecnologias](#6-tecnologias-utilizadas) · 7. [Arquitetura](#7-arquitetura-da-aplicação) · 8. [Componentes](#8-organização-dos-componentes)
9. [Pré-requisitos](#9-pré-requisitos) · 10. [Instalação](#10-instalação) · 11. [Configuração](#11-configuração) · 12. [Execução](#12-execução)
13. [APIs](#13-documentação-das-apis) · 14. [Banco de dados](#14-banco-de-dados-planejado) · 15. [Variáveis de ambiente](#15-variáveis-de-ambiente)
16. [Testes](#16-testes) · 17. [Deploy](#17-deploy) · 18. [Limitações](#18-limitações-conhecidas) · 19. [Referências](#19-referências)

---

## Status do projeto

| Etapa | Conteúdo | Situação |
|-------|----------|----------|
| 1 | Frontend: Dashboard, Conversor, Histórico, Comparador e Indicadores, integrados às APIs externas | ✅ Concluída |
| 2 | Backend Node.js + Express (rotas, serviços, cache, validação) | ⏳ Planejada |
| 3 | Banco MySQL, cadastro/login, favoritos e histórico de conversões | ⏳ Planejada |
| 4 | Testes finais, melhorias de interface e deploy | ⏳ Planejada |

Hoje o projeto funciona **somente com o frontend**, que consulta as APIs públicas diretamente pelo navegador. A página **Favoritos** ainda é um aviso, pois depende de login e banco de dados (Etapas 2 e 3).

---

## 1. Objetivo

Oferecer uma interface com aparência de produto financeiro profissional para consultar cotações, converter valores, analisar a evolução histórica do câmbio e acompanhar indicadores econômicos do Brasil, sempre informando a **fonte** e a **data/hora** de cada dado.

Também serve como projeto de portfólio, demonstrando:

- desenvolvimento frontend (HTML, CSS e JavaScript);
- consumo e integração de APIs REST e manipulação de JSON;
- visualização de dados com gráficos;
- tratamento de erros, cache e organização de código;
- (nas próximas etapas) backend, modelagem relacional, autenticação e deploy.

## 2. Problema que pretende resolver

Informações sobre câmbio e indicadores econômicos estão espalhadas em fontes diferentes, com formatos, periodicidades e significados distintos. Isso gera confusão frequente, por exemplo:

- tratar uma cotação de referência diária como se fosse "tempo real";
- confundir a **Selic efetiva diária** (série SGS 11) com a **meta Selic** definida pelo Copom;
- comparar valores nominais de moedas com escalas diferentes, em vez de comparar variações percentuais.

O MoneyMap reúne essas informações em um só lugar, de forma clara, identificando o tipo de cotação (compra), a fonte, a periodicidade e a data de atualização.

## 3. Escopo

### Dentro do escopo (Nível 2 do planejamento)

- Dashboard com cotações, variações e gráficos.
- Conversor de moedas.
- Histórico de câmbio com estatísticas do período.
- Comparador de moedas com séries normalizadas.
- Indicadores IPCA e Selic.
- *(Planejado)* Backend próprio, MySQL, cadastro e login, favoritos e histórico de conversões.

### Fora do escopo

- Operações bancárias, compra/venda de moedas, investimentos ou qualquer transação real.
- Recomendações financeiras.
- Cotações em tempo real garantido.

### Possíveis extensões (Nível 3)

Alertas de cotação, relatórios em PDF, calculadora de inflação, notícias econômicas e simulador de valorização histórica.

## 4. Requisitos funcionais

| ID | Requisito | Situação |
|----|-----------|----------|
| RF01 | Exibir cotação, variação absoluta e percentual, indicador de alta/queda, data/hora e mini-gráfico para USD, EUR, GBP e BTC em relação ao real | ✅ |
| RF02 | Exibir gráfico de evolução do dólar com períodos de 7, 30, 90, 180 dias e ~1 ano | ✅ |
| RF03 | Converter valores entre BRL, USD, EUR, GBP, JPY, ARS e BTC, com botão para inverter as moedas e exibição da taxa e do horário da cotação | ✅ |
| RF04 | Validar o valor digitado (vazio, inválido, negativo, separadores `.` e `,`) e tratar moedas iguais | ✅ |
| RF05 | Mostrar o histórico de uma moeda com cotação inicial, final, maior, menor, variação percentual e gráfico | ✅ |
| RF06 | Comparar duas ou três moedas (USD, EUR, GBP, JPY) com séries normalizadas (início = 100), tabela e variação no período | ✅ |
| RF07 | Exibir IPCA mensal, IPCA acumulado em 12 meses e Selic efetiva diária, com explicação e periodicidade | ✅ |
| RF08 | Informar fonte e data/hora dos dados e exibir mensagens de erro quando uma API estiver indisponível | ✅ |
| RF09 | Cadastro, login e logout de usuários | ⏳ Etapa 3 |
| RF10 | Adicionar, remover e listar moedas favoritas com a cotação mais recente | ⏳ Etapa 3 |
| RF11 | Salvar e consultar o histórico de conversões do usuário | ⏳ Etapa 3 |

## 5. Requisitos não funcionais

| ID | Requisito | Como é atendido |
|----|-----------|-----------------|
| RNF01 | **Transparência dos dados** | Os valores são de **compra** (`bid`) da AwesomeAPI e são rotulados como tal; nenhuma cotação é apresentada como tempo real garantido; a Selic é identificada como efetiva diária, não como meta |
| RNF02 | **Resiliência** | Timeout de 10 s nas requisições, blocos `try/catch` e mensagens amigáveis quando uma fonte falha; dados indisponíveis nunca são substituídos por valores inventados |
| RNF03 | **Desempenho** | Cache no navegador (`sessionStorage`) com validade de 1 min para cotações, 5 min para históricos e 1 h para séries do Banco Central |
| RNF04 | **Responsividade** | Layout adaptado a computador, tablet e celular; a sidebar vira barra inferior em telas pequenas |
| RNF05 | **Usabilidade e acessibilidade** | Identidade visual escura e consistente, rótulos `aria-label`, foco visível no teclado e respeito à preferência por menos movimento |
| RNF06 | **Precisão** | Formatação numérica em pt-BR; casas decimais adequadas por moeda (8 para BTC); IPCA acumulado calculado pelo produto dos fatores mensais |
| RNF07 | **Manutenibilidade** | Código separado em camada de acesso às APIs (`api.js`), um script por página e estilos modulares |
| RNF08 | **Compatibilidade** | Navegadores modernos com suporte a ES2020+ (Chrome, Edge, Firefox e Safari atuais) |
| RNF09 | **Segurança** *(planejado)* | Senhas com hash (bcrypt/Argon2), credenciais em variáveis de ambiente, validação de entradas no backend |

## 6. Tecnologias utilizadas

### Em uso (Etapa 1)

| Tecnologia | Função |
|------------|--------|
| HTML5 | Estrutura das páginas |
| CSS3 | Layout (Flexbox e Grid), tema escuro, responsividade e animações leves |
| JavaScript (ES2020+) | Lógica, cálculos, manipulação do DOM e `fetch` com `async/await` |
| [Chart.js 4.4.1](https://www.chartjs.org/) | Gráficos de linha e barras (via CDN) |
| [Lucide 0.446.0](https://lucide.dev/) | Ícones (via CDN) |
| Google Fonts (Manrope) | Tipografia |

### Fontes de dados

| Fonte | Uso |
|-------|-----|
| [AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas) | Cotações atuais (`/json/last`) e histórico diário (`/json/daily`, máximo de 360 dias) |
| [Banco Central do Brasil — SGS](https://api.bcb.gov.br/) | Selic efetiva diária (série 11) e IPCA mensal (série 433) |

### Planejadas

Node.js e Express (backend), MySQL (persistência), bcrypt (senhas), Day.js (datas) e Frankfurter como fonte alternativa de câmbio.

## 7. Arquitetura da aplicação

### Arquitetura atual (Etapa 1)

O frontend é estático e consulta as APIs externas diretamente, com cache local:

```mermaid
flowchart LR
    U[Usuário] --> F["Frontend<br/>HTML + CSS + JavaScript"]
    F -->|"fetch + cache<br/>(sessionStorage)"| A[AwesomeAPI]
    F -->|"fetch + cache<br/>(sessionStorage)"| B[API do Banco Central - SGS]
```

### Arquitetura alvo (Etapas 2 e 3)

Um backend próprio centralizará as consultas externas, o cache, a validação e o acesso ao banco:

```mermaid
flowchart TD
    A[Frontend - HTML, CSS e JavaScript] -->|HTTP / JSON| B[Backend - Node.js e Express]
    B --> C[(MySQL)]
    B --> D[AwesomeAPI]
    B --> E[API do Banco Central]
    B -.->|alternativa| F[Frankfurter]
```

Motivos para adicionar o backend: centralizar requisições externas, tratar respostas inconsistentes, ter cache compartilhado, proteger eventuais chaves de API e conectar o sistema ao MySQL (usuários, favoritos e conversões).

### Fluxo de uma consulta (arquitetura atual)

1. O usuário abre uma página (por exemplo, o Dashboard).
2. O script da página chama uma função de `api.js`.
3. `getJSON()` verifica o cache em `sessionStorage`; se estiver válido, devolve o dado salvo.
4. Caso contrário, faz a requisição com timeout de 10 s e guarda a resposta.
5. `api.js` converte os campos da API externa para um formato padronizado (`code`, `name`, `price`, `change`, `pct`, `date`).
6. O script da página atualiza cards, tabelas e gráficos, ou exibe uma mensagem de erro.

## 8. Organização dos componentes

```text
MoneyMap/
├── frontend/
│   ├── index.html              # Dashboard
│   ├── pages/
│   │   ├── converter.html      # Conversor de moedas
│   │   ├── history.html        # Histórico de câmbio
│   │   ├── comparison.html     # Comparador de moedas
│   │   ├── indicators.html     # Indicadores econômicos
│   │   └── favorites.html      # Favoritos (aguarda backend e banco)
│   ├── css/
│   │   ├── global.css          # Variáveis de cor, reset e layout base
│   │   ├── components.css      # Sidebar, topbar, cards, formulários e botões
│   │   ├── dashboard.css       # Cards de cotação, gráficos e indicadores
│   │   └── responsive.css      # Regras para tablet e celular
│   ├── js/
│   │   ├── api.js              # Acesso às APIs, cache, formatação e utilitários
│   │   ├── dashboard.js
│   │   ├── converter.js
│   │   ├── history.js
│   │   ├── comparison.js
│   │   └── indicators.js
│   └── assets/                 # Imagens e ícones
└── README.md
```

As pastas `backend/` e `database/` (com `schema.sql`) serão criadas nas Etapas 2 e 3.

### Principais componentes

| Componente | Responsabilidade |
|------------|------------------|
| `api.js` | Camada de acesso: `getLatest`, `getHistory`, `getRate` (AwesomeAPI) e `getSeries` (Banco Central); `getJSON` com timeout e cache; formatadores pt-BR; cálculos de IPCA acumulado e Selic anualizada; opções base dos gráficos |
| `dashboard.js` | Cards de cotação com mini-gráficos, gráfico principal com seleção de período, indicadores e tabela de moedas |
| `converter.js` | Leitura e validação do valor, conversão usando o BRL como moeda ponte e inversão de moedas |
| `history.js` | Estatísticas do período (inicial, final, maior, menor, variação) e gráfico |
| `comparison.js` | Seleção de duas ou três moedas, alinhamento das datas em comum e normalização (`índice = valor / valor inicial × 100`) |
| `indicators.js` | IPCA mensal e acumulado em 12 meses, Selic efetiva diária e gráficos |

### Fórmulas utilizadas

- Conversão: `valor convertido = valor original × taxa`
- Taxa entre duas moedas via BRL: `taxa(A→B) = cotação(A-BRL) / cotação(B-BRL)`
- Variação percentual: `((valor final − valor inicial) / valor inicial) × 100`
- Normalização: `índice = (valor na data / valor inicial) × 100`
- IPCA acumulado: `(Π (1 + mensal/100) − 1) × 100`
- Selic anualizada (estimativa): `((1 + diária/100)^252 − 1) × 100`

## 9. Pré-requisitos

- Navegador moderno (Chrome, Edge, Firefox ou Safari atualizados).
- Conexão com a internet (para as APIs e as bibliotecas carregadas por CDN).
- [Git](https://git-scm.com/) para clonar o repositório.
- Um servidor HTTP local para servir os arquivos estáticos. Use **uma** das opções:
  - extensão **Live Server** do VS Code;
  - [Node.js](https://nodejs.org/) 18 ou superior (para usar `npx serve`);
  - Python 3 (para usar `python -m http.server`).

> Para as próximas etapas serão necessários também Node.js e MySQL, mas **não são exigidos para executar a versão atual**.

## 10. Instalação

```bash
git clone https://github.com/<seu-usuario>/MoneyMap.git
cd MoneyMap
```

A versão atual não tem dependências para instalar: as bibliotecas (Chart.js e Lucide) são carregadas por CDN e não há `npm install`.

## 11. Configuração

Não há variáveis de ambiente nem chaves de API nesta etapa. As URLs das fontes ficam no início de `frontend/js/api.js`:

```js
const AWESOME = "https://economia.awesomeapi.com.br/json";
const BCB = "https://api.bcb.gov.br/dados/serie/bcdata.sgs";
```

Os tempos de cache são definidos no parâmetro `ttl` de cada chamada a `getJSON()` (60 s para cotações, 5 min para histórico de câmbio e 1 h para séries do Banco Central). O timeout das requisições (10 s) também está em `getJSON()`.

> **Backend e banco (Etapas 2 e 3):** quando forem implementados, as credenciais do MySQL e demais segredos ficarão em um arquivo `.env`, que **não deve ser versionado** (incluir no `.gitignore`). Os passos de configuração serão documentados aqui.

## 12. Execução

Na pasta `frontend`, inicie um servidor local usando uma das opções:

```bash
cd frontend

# Opção A: Node.js
npx serve .

# Opção B: Python
python -m http.server 5500
```

Ou, no VS Code, clique com o botão direito em `frontend/index.html` e escolha **Open with Live Server**.

Depois, abra o endereço exibido no terminal (por exemplo, `http://localhost:3000` com `serve` ou `http://localhost:5500` com Python).

**Evite abrir o `index.html` com duplo clique** (protocolo `file://`): o navegador pode bloquear as requisições às APIs.

## 13. Documentação das APIs

### 13.1 APIs externas consumidas hoje (Etapa 1)

O frontend chama as duas fontes diretamente. Todas as requisições são `GET`, não exigem autenticação e retornam JSON. Os parâmetros abaixo são os realmente usados em `frontend/js/api.js`.

#### AwesomeAPI (`https://economia.awesomeapi.com.br/json`)

| Endpoint | Função em `api.js` | Uso | Cache |
|----------|--------------------|-----|-------|
| `GET /last/{PAR1},{PAR2},...` | `getLatest(codes)` | Cotação atual de vários pares de uma vez. Ex.: `/last/USD-BRL,EUR-BRL,GBP-BRL,BTC-BRL` | 60 s |
| `GET /daily/{PAR}/{dias}` | `getHistory(code, days)` | Série diária de um par. Ex.: `/daily/USD-BRL/30` (máximo 360 dias) | 5 min |

Campos da resposta usados (a chave do objeto em `/last` não tem hífen, ex.: `USDBRL`):

| Campo da API | Significado | Campo padronizado no app |
|--------------|-------------|--------------------------|
| `bid` | Cotação de **compra** | `price` / `value` |
| `varBid` | Variação absoluta | `change` |
| `pctChange` | Variação percentual | `pct` |
| `create_date` | Data/hora da cotação (`AAAA-MM-DD HH:MM:SS`) | `date` |
| `timestamp` | Data da cotação diária (epoch em segundos, endpoint `/daily`) | `date` |

Exemplo de chamada:

```bash
curl "https://economia.awesomeapi.com.br/json/last/USD-BRL"
curl "https://economia.awesomeapi.com.br/json/daily/USD-BRL/7"
```

Moedas usadas: `USD`, `EUR`, `GBP`, `JPY`, `ARS`, `BTC` sempre contra `BRL`. Conversões entre duas moedas que não sejam o real usam o BRL como ponte (`getRate`).

#### Banco Central do Brasil — SGS (`https://api.bcb.gov.br/dados/serie/bcdata.sgs`)

| Endpoint | Função | Série | Periodicidade | Cache |
|----------|--------|-------|---------------|-------|
| `GET .{código}/dados?formato=json&dataInicial=DD/MM/AAAA&dataFinal=DD/MM/AAAA` | `getSeries(code, start, end)` | `11` — Selic efetiva diária (% a.d.) | Diária (dias úteis) | 1 h |
| idem | idem | `433` — IPCA variação mensal (%) | Mensal | 1 h |

A resposta é uma lista de `{ "data": "DD/MM/AAAA", "valor": "0.12" }`; o app converte `data` para `Date` e `valor` para número.

```bash
curl "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json&dataInicial=01/01/2025&dataFinal=30/10/2026"
```

#### Tratamento de erros nas chamadas

| Situação | Comportamento |
|----------|---------------|
| Resposta HTTP diferente de 2xx | `getJSON` lança `Error("HTTP <status>")` |
| Sem resposta em 10 s | A requisição é abortada (`AbortController`) |
| Par ausente na resposta | O par é ignorado; `getRate` lança "Cotação indisponível" |
| Qualquer falha | A página exibe a mensagem padrão (`ERR`) e **nenhum dado fictício** |

### 13.2 API própria do backend (planejada — Etapa 2 e 3)

> ⚠️ **Proposta de projeto.** Os endpoints abaixo ainda **não existem** no repositório; descrevem o contrato previsto para o backend Node.js + Express. Serão ajustados na implementação.

Prefixo: `/api`. Formato: JSON. Rotas protegidas exigem `Authorization: Bearer <token>`.

| Método | Rota | Auth | Descrição |
|--------|------|:----:|-----------|
| GET | `/api/health` | — | Verifica se o servidor está no ar |
| GET | `/api/quotes?codes=USD,EUR` | — | Cotações atuais (cache no servidor) |
| GET | `/api/history/:code?days=30` | — | Histórico diário (validação: 1–360 dias) |
| GET | `/api/convert?from=USD&to=BRL&amount=100` | — | Conversão com taxa e horário |
| GET | `/api/indicators/ipca` · `/api/indicators/selic` | — | Séries do Banco Central |
| POST | `/api/auth/register` | — | Cadastro (`name`, `email`, `password`) |
| POST | `/api/auth/login` | — | Login; devolve o token |
| GET | `/api/favorites` | ✔ | Lista favoritos com a cotação mais recente |
| POST | `/api/favorites` | ✔ | Adiciona favorito (`currency_code`) |
| DELETE | `/api/favorites/:code` | ✔ | Remove favorito |
| GET | `/api/conversions` | ✔ | Histórico de conversões do usuário |
| POST | `/api/conversions` | ✔ | Salva uma conversão |

Padrão de erro previsto:

```json
{ "error": { "code": "INVALID_AMOUNT", "message": "O valor deve ser um número positivo." } }
```

## 14. Banco de dados (planejado)

> ⚠️ A versão atual **não usa banco de dados**. O modelo abaixo é a proposta para a Etapa 3 (MySQL 8+) e ficará em `database/schema.sql`.

```mermaid
erDiagram
    USERS ||--o{ FAVORITES : possui
    USERS ||--o{ CONVERSIONS : realiza
    USERS {
        int id PK
        varchar name
        varchar email UK
        varchar password_hash
        datetime created_at
    }
    FAVORITES {
        int id PK
        int user_id FK
        char currency_code
        datetime created_at
    }
    CONVERSIONS {
        int id PK
        int user_id FK
        char from_currency
        char to_currency
        decimal amount
        decimal rate
        decimal result
        datetime quoted_at
        datetime created_at
    }
```

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,        -- nunca guardar a senha em texto puro
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  currency_code CHAR(3) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_currency (user_id, currency_code),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE conversions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  from_currency CHAR(3) NOT NULL,
  to_currency CHAR(3) NOT NULL,
  amount DECIMAL(20,8) NOT NULL,
  rate DECIMAL(24,10) NOT NULL,
  result DECIMAL(24,8) NOT NULL,
  quoted_at DATETIME NOT NULL,                -- horário da cotação usada
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

Decisões: valores monetários em `DECIMAL` (nunca `FLOAT`); `UNIQUE (user_id, currency_code)` impede favorito duplicado; a taxa e o horário da cotação são gravados em cada conversão para manter o histórico fiel.

## 15. Variáveis de ambiente

**Etapa 1 (atual): nenhuma.** O frontend não usa `.env`, chaves de API nem segredos.

**Etapas 2 e 3 (planejado):** o backend lerá a configuração de um arquivo `backend/.env` (listado no `.gitignore`). Será versionado apenas um `backend/.env.example` com valores fictícios:

| Variável | Exemplo | Descrição |
|----------|---------|-----------|
| `NODE_ENV` | `development` | Ambiente (`development` ou `production`) |
| `PORT` | `3333` | Porta do servidor Express |
| `CORS_ORIGIN` | `https://money-map-so.netlify.app` | Origem permitida do frontend |
| `DB_HOST` | `localhost` | Host do MySQL |
| `DB_PORT` | `3306` | Porta do MySQL |
| `DB_USER` | `moneymap` | Usuário do banco |
| `DB_PASSWORD` | `troque_esta_senha` | Senha do banco (**segredo**) |
| `DB_NAME` | `moneymap` | Nome do banco |
| `JWT_SECRET` | `string_longa_e_aleatoria` | Chave para assinar tokens (**segredo**) |
| `JWT_EXPIRES_IN` | `1d` | Validade do token |
| `AWESOMEAPI_BASE_URL` | `https://economia.awesomeapi.com.br/json` | Fonte de câmbio |
| `BCB_BASE_URL` | `https://api.bcb.gov.br/dados/serie/bcdata.sgs` | Fonte de indicadores |
| `CACHE_TTL_QUOTES` | `60` | Cache de cotações (segundos) |
| `CACHE_TTL_HISTORY` | `300` | Cache de histórico (segundos) |
| `CACHE_TTL_INDICATORS` | `3600` | Cache de indicadores (segundos) |

Nunca publique `DB_PASSWORD` ou `JWT_SECRET` no repositório; em produção, configure-os no painel da hospedagem.

## 16. Testes

### 16.1 Testes manuais (Etapa 1)

Não há testes automatizados nesta etapa. A verificação é feita com o roteiro abaixo, rodando o projeto localmente (seção 12) ou na [versão online](https://money-map-so.netlify.app/).

| Área | Caso de teste | Resultado esperado |
|------|---------------|--------------------|
| Dashboard | Abrir `index.html` | Cards de USD, EUR, GBP e BTC com preço, variação, data/hora e mini-gráfico |
| Dashboard | Trocar o período (7, 30, 90, 180 dias, ~1 ano) | Gráfico do dólar é redesenhado |
| Conversor | `100` de USD para BRL | Valor convertido, taxa e horário da cotação |
| Conversor | Digitar `1.234,56` e `1234.56` | Ambos aceitos como o mesmo número |
| Conversor | Campo vazio, texto (`abc`) e valor negativo | Mensagem de validação; sem conversão |
| Conversor | Moedas de origem e destino iguais | Taxa 1, sem erro |
| Conversor | Botão de inverter | Moedas trocam de lugar e o resultado é recalculado |
| Conversor | BTC → BRL | Exibe até 8 casas decimais quando aplicável |
| Histórico | Escolher uma moeda e um período | Cotação inicial, final, maior, menor, variação % e gráfico |
| Comparador | Selecionar 2 e depois 3 moedas | Séries normalizadas começando em 100, tabela e variação no período |
| Indicadores | Abrir a página | IPCA mensal, IPCA 12 meses e Selic efetiva diária, com explicação |
| Resiliência | DevTools → Network → **Offline** e recarregar | Mensagem de erro amigável; nenhum número inventado |
| Resiliência | Bloquear `economia.awesomeapi.com.br` no DevTools | Somente as seções dependentes dessa fonte mostram erro |
| Cache | Recarregar duas vezes em menos de 1 min | A segunda carga não gera nova requisição de cotações (aba Network) |
| Responsividade | Largura de 360 px (modo dispositivo) | Sidebar vira barra inferior; sem rolagem horizontal |
| Acessibilidade | Navegar só com `Tab` | Foco visível em todos os controles |
| Favoritos | Abrir `pages/favorites.html` | Aviso de que depende de login e banco (Etapas 2 e 3) |

Verificação rápida das fontes, antes de testar a interface:

```bash
curl -s "https://economia.awesomeapi.com.br/json/last/USD-BRL" | head -c 300
curl -s "https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados/ultimos/1?formato=json"
```

### 16.2 Testes automatizados (planejado — Etapa 4)

| Camada | Ferramenta sugerida | O que cobrir |
|--------|---------------------|--------------|
| Funções puras do frontend | Vitest ou Jest | `accumulate`, `annualize`, formatadores pt-BR, normalização, taxa via BRL |
| Rotas do backend | Jest + Supertest | Validação de parâmetros, códigos HTTP e formato de erro |
| Serviços externos | Mocks da AwesomeAPI e do BCB | Timeout, resposta inválida e fonte indisponível |
| Banco | MySQL de teste | Restrições `UNIQUE`/`FOREIGN KEY` e fluxos de cadastro e favoritos |
| Ponta a ponta | Playwright | Conversão, login e favoritos |

Comando previsto: `npm test` (será documentado quando existir).

## 17. Deploy

### 17.1 Frontend — Netlify (em produção)

A versão atual está publicada em **<https://money-map-so.netlify.app/>**. Como o frontend é estático, não há etapa de build.

| Configuração no Netlify | Valor |
|-------------------------|-------|
| Base directory | `frontend` *(se o repositório tiver a pasta `MoneyMap/` na raiz, use `MoneyMap/frontend`)* |
| Build command | *(vazio)* |
| Publish directory | `frontend` *(ou `MoneyMap/frontend`)* |

Passo a passo:

1. Envie o projeto para o GitHub.
2. No Netlify: **Add new site → Import an existing project** e escolha o repositório.
3. Informe a pasta de publicação conforme a tabela acima, deixe o comando de build vazio e confirme.
4. A cada `git push` na branch principal, o Netlify republica o site automaticamente.

Alternativa sem Git: arraste a pasta `frontend` em **Deploy manually**.

Como as bibliotecas vêm de CDN e as APIs são chamadas pelo navegador via HTTPS, o site publicado não exige configuração extra. Após cada deploy, repita o roteiro da seção 16.1 na URL pública.

### 17.2 Backend e banco (planejado)

Sugestão para as Etapas 2 a 4: hospedar o Express em um serviço como Render ou Railway, usar um MySQL gerenciado e configurar as variáveis da seção 15 no painel da hospedagem. Ao publicar, ajustar `CORS_ORIGIN` para a URL do Netlify e fazer o frontend apontar para a URL pública da API. Os passos exatos serão documentados aqui quando o backend existir.

## 18. Limitações conhecidas

- As cotações exibidas são de **compra** (`bid`) da AwesomeAPI. Sem chave de API, as respostas têm cache de cerca de 1 minuto no servidor da AwesomeAPI.
- O histórico diário da AwesomeAPI é limitado a **360 dias** por consulta (por isso o rótulo "~1 ano").
- A Selic exibida é a **efetiva diária** (SGS 11), não a meta do Copom; o valor anualizado é uma estimativa.
- O Comparador usa apenas as datas em que todas as moedas selecionadas têm cotação.
- Se uma fonte estiver fora do ar, a página mostra uma mensagem de erro; nenhum dado fictício é exibido.
- O cache usa `sessionStorage`: vale apenas na aba aberta e é perdido ao fechá-la.
- A página Favoritos, o login e o histórico de conversões dependem de backend e banco (Etapas 2 e 3).
- A Etapa 1 não possui testes automatizados (veja a seção 16).

## 19. Referências

- [AwesomeAPI — moedas](https://docs.awesomeapi.com.br/api-de-moedas)
- [Banco Central — dados abertos](https://dadosabertos.bcb.gov.br/) e [API SGS](https://api.bcb.gov.br/)
- [Frankfurter](https://frankfurter.dev/)
- [Chart.js](https://www.chartjs.org/docs/latest/) · [Lucide](https://lucide.dev/) · [Node.js](https://nodejs.org/docs/latest/api/) · [Express](https://expressjs.com/) · [MySQL](https://dev.mysql.com/doc/)
- [Netlify — deploy de sites estáticos](https://docs.netlify.com/)
