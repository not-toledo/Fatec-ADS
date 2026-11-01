# 📚 Aula 08 --- Documentação de Software

> **Professor:** Prof. Me. Deivison S. Takatu\
> **Tema central:** como registrar informações para que outras pessoas
> consigam compreender, executar, testar, manter e evoluir um software.

------------------------------------------------------------------------

## 🧭 1. O que é documentação de software?

Documentação de software é o conjunto de informações que ajuda as
pessoas a:

-   🧠 Compreender o funcionamento e o objetivo de um sistema;
-   🛠️ Utilizar, desenvolver e configurar a aplicação;
-   🧪 Executar e validar testes;
-   🔧 Corrigir problemas e realizar manutenção;
-   🤝 Colaborar no desenvolvimento do projeto.

Uma boa documentação deve responder:

1.  O que é o projeto?
2.  Para que ele serve?
3.  Como instalar e configurar?
4.  Como executar e testar?
5.  Como contribuir e realizar mudanças?

**Ideia principal:** documentar não é apenas registrar informações, mas
tornar o conhecimento reutilizável.

## ⚠️ 2. O que acontece sem documentação?

A ausência de documentação pode causar:

-   Dependência de desenvolvedores específicos;
-   Dificuldade para integrar novos membros à equipe;
-   Configurações esquecidas ou realizadas de maneiras diferentes;
-   Mais tempo gasto com manutenção e resolução de problemas;
-   Perda de conhecimento quando alguém sai da equipe;
-   Perguntas repetitivas sobre instalação, execução e deploy.

``` mermaid
flowchart TD
    A["❌ Projeto sem documentação"] --> B["Dependência de pessoas específicas"]
    A --> C["Dificuldade de integração"]
    A --> D["Configurações inconsistentes"]
    A --> E["Conhecimento perdido"]
    B --> F["🐢 Manutenção mais lenta"]
    C --> F
    D --> F
    E --> F
```

## 🎯 3. Por que documentar?

A documentação apoia quatro necessidades principais:

  -----------------------------------------------------------------------
  Necessidade                         Para que serve
  ----------------------------------- -----------------------------------
  💬 **Comunicação**                  Compartilhar conhecimento entre as
                                      pessoas.

  🔧 **Manutenção**                   Facilitar correções e evolução do
                                      sistema.

  🤝 **Colaboração**                  Permitir que várias pessoas
                                      trabalhem juntas.

  🔄 **Continuidade**                 Reduzir a dependência de indivíduos
                                      específicos.
  -----------------------------------------------------------------------

## 👥 4. Quem utiliza a documentação?

A documentação não é feita apenas para quem programa. Diferentes
participantes do projeto precisam dela:

-   👨‍💻 **Dev:** começa a trabalhar com menos dependência da equipe.
-   🧪 **Tester:** identifica como executar e validar os testes.
-   ⚙️ **DevOps:** configura pipelines, ambientes e deploy.
-   📋 **Gestor:** acompanha processos e decisões.
-   🧑‍💼 **Usuário:** aprende a utilizar o produto.

## 🧩 5. Combinação de áreas

A documentação reúne informações de diferentes áreas:

  -----------------------------------------------------------------------
  Área                                O que documenta
  ----------------------------------- -----------------------------------
  **Engenharia de Software (ES)**     Requisitos, arquitetura, código e
                                      testes.

  **Gestão de Projetos (GP)**         Escopo, cronograma, riscos e
                                      entregas.

  **DevOps**                          CI/CD, infraestrutura, deploy e
                                      monitoramento.

  **Segurança da Informação**         Vulnerabilidades, políticas,
                                      acessos e incidentes.

  **Qualidade de Software (QA)**      Testes, critérios de aceitação,
                                      evidências e qualidade.

  **Produto / UX**                    Requisitos do usuário, jornadas,
                                      regras de negócio e usabilidade.
  -----------------------------------------------------------------------

``` mermaid
flowchart TD
    D["📚 Documentação do software"]
    D --> ES["Engenharia de Software"]
    D --> GP["Gestão de Projetos"]
    D --> DO["DevOps"]
    D --> SI["Segurança da Informação"]
    D --> QA["Qualidade de Software"]
    D --> UX["Produto / UX"]
```

## 🗂️ 6. Tipos de documentação

A aula apresenta três tipos principais:

### 6.1 🛠️ Documentação técnica

Descreve os aspectos técnicos do sistema, como:

-   Arquitetura;
-   APIs;
-   Banco de dados;
-   Componentes;
-   Configurações.

### 6.2 📋 Documentação de projeto

Registra informações de organização e planejamento:

-   Objetivos;
-   Requisitos;
-   Decisões;
-   Organização do projeto.

### 6.3 🔄 Documentação de processo

Descreve como o trabalho é realizado:

-   Branches e commits;
-   Pull Requests;
-   Testes;
-   Pipeline;
-   Deploy.

## 🐙 7. README.md --- a porta de entrada do projeto

O `README.md` normalmente é o primeiro documento consultado em um
repositório GitHub. Ele deve permitir que alguém entenda rapidamente o
projeto e saiba como executá-lo.

### O que incluir no README?

#### 📝 7.1 Identificação e propósito

-   Nome do projeto;
-   Objetivo;
-   Problema que pretende resolver;
-   Breve descrição do funcionamento.

#### 💻 7.2 Tecnologias e pré-requisitos

Informe a stack necessária para executar o projeto:

-   Linguagem e versão;
-   Framework;
-   Banco de dados;
-   Gerenciador de pacotes;
-   Docker, quando utilizado;
-   Git e outras ferramentas.

Indique versões mínimas ou recomendadas quando isso fizer diferença.

#### 📥 7.3 Instalação e execução

A documentação deve transformar a preparação do ambiente em uma
sequência reproduzível.

Fluxo apresentado na aula:

``` mermaid
flowchart TD
    A["1. Clonar o repositório"] --> B["2. Acessar a pasta"]
    B --> C["3. Instalar dependências"]
    C --> D["4. Configurar variáveis"]
    D --> E["5. Executar o projeto"]
    E --> F["6. Acessar a aplicação"]
    F --> G["7. Executar os testes"]
```

#### ⚙️ 7.4 Configuração e variáveis de ambiente

Explique:

-   Quais variáveis existem;
-   Para que cada uma serve;
-   Quais são obrigatórias;
-   Como criar o arquivo de configuração;
-   Quais valores podem ser usados como exemplo.

Exemplo ilustrativo da aula:

``` env
PORT=3000
DATABASE_URL=sua_url_aqui
API_KEY=sua_chave_aqui
```

> 🔐 Os valores acima são exemplos. Não coloque chaves reais, senhas ou
> credenciais no repositório.

#### 🧪 7.5 Execução e testes

Mostre como verificar se o projeto está funcionando. Inclua, quando
existirem:

-   Comando para iniciar a aplicação;
-   Testes unitários;
-   Testes de integração;
-   Testes de performance;
-   Como verificar resultados e falhas.

#### 🗃️ 7.6 Estrutura do projeto

Apresente as pastas e os arquivos principais e explique a
responsabilidade de cada parte relevante.

Exemplo citado na aula:

``` text
projeto/
├── src/                 # Código da aplicação
├── tests/               # Testes
├── docs/                # Documentação
└── .github/
    └── workflows/       # Pipelines
```

Não é necessário documentar cada arquivo: explique o que ajuda o leitor
a compreender ou operar o sistema.

## 🚀 8. Documentação do processo DevOps

A documentação de processo registra o fluxo de desenvolvimento e entrega
do software.

### Etapas e conceitos

  -----------------------------------------------------------------------
  Etapa / conceito                    Significado
  ----------------------------------- -----------------------------------
  👨‍💻 **Desenvolvimento**              Implementação de funcionalidades e
                                      correções no código.

  🌿 **Git**                          Controle de versão e histórico das
                                      alterações.

  🔍 **Pull Request (PR)**            Solicitação de revisão e integração
                                      das mudanças.

  🏗️ **Build**                        Compilação ou preparação do
                                      software para execução.

  🧪 **Testes**                       Validação do funcionamento e
                                      identificação de falhas.

  🔁 **Pipeline CI/CD**               Automação das etapas de integração,
                                      validação e entrega.

  🚀 **Deploy**                       Publicação da aplicação em um
                                      ambiente de execução.
  -----------------------------------------------------------------------

``` mermaid
flowchart LR
    A["👨‍💻 Desenvolvimento"] --> B["🌿 Git / Commit"]
    B --> C["🔍 Pull Request"]
    C --> D["🏗️ Build"]
    D --> E["🧪 Testes"]
    E --> F["🔁 Pipeline CI/CD"]
    F --> G["🚀 Deploy"]
```

## 🔒 9. O que NÃO colocar na documentação?

A documentação não pode comprometer a segurança do sistema.

**Nunca publique:**

-   🔑 Senhas de usuários, administradores ou bancos de dados;
-   🗝️ Chaves de API e tokens de acesso;
-   🧍 Dados pessoais ou confidenciais de clientes;
-   📄 Arquivos sigilosos, como `.env` com segredos;
-   🏢 Informações restritas de infraestrutura que facilitem acessos
    indevidos.

É possível explicar quais configurações são necessárias usando nomes de
variáveis e valores fictícios, sem expor os segredos reais.

## 📝 10. Atividade proposta na aula

Escolher um projeto de software e elaborar sua documentação,
apresentando:

1.  🎯 Objetivo do projeto;
2.  🧩 Problema que pretende resolver;
3.  📦 Escopo;
4.  ⚙️ Requisitos funcionais e não funcionais;
5.  💻 Tecnologias utilizadas;
6.  🏛️ Arquitetura da aplicação;
7.  🗂️ Organização dos principais componentes.

Além disso, criar ou atualizar o `README.md` do repositório no GitHub,
incluindo:

-   Pré-requisitos;
-   Instalação;
-   Configuração;
-   Execução;
-   APIs e banco de dados, quando aplicável;
-   Variáveis de ambiente;
-   Procedimentos de testes e deploy.

## 🧠 11. Revisão rápida

``` mermaid
mindmap
  root((📚 Documentação de Software))
    Objetivos
      Comunicação
      Manutenção
      Colaboração
      Continuidade
    Tipos
      Técnica
      Projeto
      Processo
    README
      Propósito
      Tecnologias
      Instalação
      Configuração
      Testes
      Estrutura
    DevOps
      Git
      Pull Request
      Build
      Testes
      CI/CD
      Deploy
    Segurança
      Não expor senhas
      Não expor tokens
      Não publicar .env sigiloso
      Proteger dados sensíveis
```

### ❓ Perguntas para revisar

1.  O que é documentação de software?
2.  Quais problemas podem surgir quando um projeto não possui
    documentação?
3.  Quais são as quatro necessidades apoiadas pela documentação?
4.  Quais são os três tipos de documentação apresentados?
5.  Qual é a função do `README.md`?
6.  Quais informações devem aparecer nas instruções de instalação e
    execução?
7.  O que significa CI/CD?
8.  Qual é a diferença entre Build e Deploy?
9.  Que informações nunca devem ser publicadas na documentação?

------------------------------------------------------------------------

## 📌 Resumo final

A documentação de software permite que um projeto seja compreendido,
executado, testado, mantido e evoluído por diferentes pessoas. Ela reúne
informações técnicas, de planejamento e de processo. O `README.md`
funciona como a principal porta de entrada do repositório, enquanto a
documentação DevOps registra o fluxo de desenvolvimento até o deploy.
Tudo deve ser escrito de forma clara, reproduzível e segura, sem expor
credenciais ou dados sensíveis.
