# 📚 Aula 01: Apresentação da Disciplina e Introdução aos Sistemas Operacionais

**Professor:** Me. Deivison S. Takatu  
**Email:** deivison.takatu@fatec.sp.gov.br  
**Data:** Aula Inaugural do Semestre

---

## 🎯 Sumário da Aula

1. ✅ Apresentação da Disciplina e Contextualização
2. ✅ Plano de Aulas e Ensino
3. ✅ Contexto da Disciplina
4. ✅ Sequência dos Conteúdos do Semestre
5. ✅ Metodologia de Ensino
6. ✅ Critérios de Avaliação
7. ✅ Atividade Prática
8. ✅ Conclusão

---

## 👨‍🏫 Perfil do Professor

### 📖 Histórico Acadêmico
- 🎓 **Mestrado** em Ciência da Computação (2021)
- 🤖 **Especialização** em Inteligência Artificial (Em andamento)
- 📚 Quatro Pós-graduações Lato Sensu
- 💻 Graduação em Análise e Desenvolvimento de Sistemas (2016)

### 💼 Experiência Profissional
- 🚀 Gerente de Projetos (2023 - Atual)
- 👨‍🎓 Professor Universitário (2022 - Atual)
- 📋 Coordenador Acadêmico (2019 - 2021)
- 🖥️ Professor de Informática (2017 - 2023)

### 🎯 Atuação na FATEC
- 🌐 **Orientações:** Programação Web
- 📊 **Projetos:** Programação Web e Educação Financeira

---

## 🖥️ O Que São Sistemas Operacionais?

### 📝 Definição
Um **Sistema Operacional (SO)** é um software essencial que gerencia tanto o hardware quanto o software de um computador, funcionando como **intermediário entre o usuário e a máquina**.

### ⚡ Importância
- Gerenciamento eficiente de recursos
- Interface amigável para o usuário
- Controle de hardware e periféricos
- Segurança e proteção de dados
- Otimização de performance

### 💻 Exemplos Principais
- 🪟 **Windows** - Desktops e Laptops
- 🍎 **macOS** - Computadores Apple
- 🐧 **Linux** - Servidores e Desktop aberto
- 🤖 **Android** - Dispositivos móveis
- 🍎 **iOS** - iPhone e iPad

---

## 🏗️ Estrutura Interna: Camadas e Modelos

### 🔧 O Kernel (Núcleo)
```
┌─────────────────────────────────┐
│   APLICAÇÕES DO USUÁRIO         │ ← Modo Usuário
├─────────────────────────────────┤
│      KERNEL (NÚCLEO)            │ ← Modo Kernel
│  - Acesso direto ao hardware    │    (Privilégios elevados)
│  - Gerencia recursos vitais     │
├─────────────────────────────────┤
│        HARDWARE                 │
└─────────────────────────────────┘
```

### 📚 Estrutura em Camadas
- **Modularidade:** Organização hierárquica para melhor manutenção
- **Isolamento:** Cada camada tem responsabilidades específicas
- **Segurança:** Proteção entre níveis

### 🔀 Modos de Operação

| Modo | Descrição | Acesso |
|------|-----------|--------|
| 👤 **Modo Usuário** | Programas comuns executados | Limitado |
| 🔐 **Modo Kernel** | SO com privilégios elevados | Total ao hardware |

### 🎨 Abordagens de Design

#### 🏛️ Monolítica
- Kernel único e monolítico
- Todas as funções em um bloco
- Mais rápida, mas menos modular

#### 🧩 Modular
- Kernel com componentes modulares
- Melhor manutenção e flexibilidade
- Permite carregar/descarregar módulos

---

## ⏱️ Escalonamento de Processos: Otimizando o Tempo

### 🎯 Objetivos do Escalonamento
- ⚡ **Eficiência:** Maximizar uso do processador
- ⚖️ **Justiça:** Todos os processos recebem tempo
- 📊 **Tempo de resposta:** Reduzir latência
- 🚀 **Throughput:** Maximizar processos completados

### 🔄 Algoritmos de Escalonamento

```
┌──────────────────────────────────────┐
│   FILA DE PROCESSOS PRONTOS         │
│  [P1] [P2] [P3] [P4] [P5]          │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│   ESCALONADOR (SCHEDULER)           │
└──────────────────────────────────────┘
           ↓
    ┌──────────────────┐
    │ PROCESSADOR (CPU)│
    │   Executando P1  │
    └──────────────────┘
```

#### 📋 Algoritmos Principais

1. **FIFO (First In, First Out)**
   - Simples e justo
   - Pode causar espera longa (convoy effect)

2. **Round Robin (Rodízio)**
   - Cada processo recebe time slice
   - Melhor distribuição de tempo
   - Mais equitativo

3. **Prioridade**
   - Processos com maior prioridade executam primeiro
   - Pode prejudicar processos de baixa prioridade
   - Usado em sistemas em tempo real

### 💥 Impactos
- Desempenho geral do sistema
- Responsividade percebida pelo usuário
- Eficiência energética

---

## 💾 Gerenciamento de Memória: Real e Virtual

### 🎯 Desafios do Gerenciamento

```
┌─────────────────────────────────┐
│   APLICAÇÃO 1    │   APP 2      │  ← Espaço Virtual
├─────────────────────────────────┤
│   APP 1   │ APP 2 │ APP 3 │ SO  │  ← RAM Física
├─────────────────────────────────┤
│        DISCO (Virtual)          │
└─────────────────────────────────┘
```

### 🔴 Memória Principal (RAM)
- 📍 **Alocação dinâmica:** Programas recebem/liberam memória conforme necessário
- 🛡️ **Proteção de memória:** Um programa não pode acessar memória de outro
- ⚡ **Acesso rápido:** Tempo de acesso mínimo
- 💰 **Custo:** Recurso limitado e caro

### 💜 Memória Virtual
- 🔄 **Expansão lógica:** Estende capacidade usando disco
- 📄 **Paginação:** Divide memória em páginas
- 📂 **Segmentação:** Divide em segmentos lógicos
- 🛡️ **Maior segurança:** Isolamento entre processos
- 🔀 **Maior flexibilidade:** Programas maiores que RAM

### 📊 Comparação

| Característica | RAM Real | Memória Virtual |
|---|---|---|
| Velocidade | ⚡⚡⚡ Muito rápida | ⚡ Moderada |
| Tamanho | 💰 Limitado | 📈 Expandível |
| Custo | Caro | Econômico |
| Uso | Executar programas | Extensão lógica |

---

## 🔌 Dispositivos, Arquivos e o Futuro

### 🔌 Gerenciamento de E/S (Entrada/Saída)
- 🖥️ Controle de hardware periférico (impressoras, teclado, mouse)
- 🔄 Coordenação entre CPU e dispositivos
- 📊 Buffer para otimizar transferências

### 📁 Sistemas de Arquivos
- 🗂️ Organização lógica de dados
- 🔍 Busca e acesso rápido
- 📋 Estrutura hierárquica (pastas/diretórios)
- 🔐 Permissões e controle de acesso

**Exemplos:** NTFS (Windows), APFS (macOS), ext4 (Linux), FAT32

### 🔒 Segurança em SO
- 🛡️ Proteção contra ameaças (malware, virus)
- 🔐 Autenticação e autorização de usuários
- 🔑 Criptografia de dados
- 📊 Auditoria e logs de acesso

### ☁️ Virtualização
- 🖥️ Execução de múltiplos SOs em uma máquina
- 💰 Otimização de recursos
- 📦 Isolamento de ambientes
- 🚀 Flexibilidade e escalabilidade

**Exemplos:** Docker, VirtualBox, VMware, Hypervisors

---

## 🎓 Contexto e Metodologia de Ensino

### 🎯 Objectives da Disciplina
- Compreender fundamentos de Sistemas Operacionais
- Analisar estrutura interna e componentes
- Aplicar conceitos em projetos práticos
- Desenvolver pensamento crítico sobre SO
- Preparar para mercado profissional

### 📚 Metodologia

```
AULA EXPOSITIVA
       ↓
EXEMPLOS PRÁTICOS
       ↓
DISCUSSÃO EM GRUPO
       ↓
PROJETO PRÁTICO
       ↓
AVALIAÇÃO
```

### 💡 Dica Importante!

> **Portfolio de Projetos** 🎯
> 
> Ter um portfólio de projetos permite:
> - ✅ Demonstrar habilidades práticas e criatividade
> - ✅ Evidência concreta do aprendizado
> - ✅ Facilitar avaliação pelo professor
> - ✅ Ampliar oportunidades em estágios e empregos
> - ✅ Incentivar organização e melhoria contínua
> - ✅ Preparar para desafios do mercado profissional

---

## 📊 Critérios de Avaliação

### 🧮 Fórmula de Cálculo
```
NOTA FINAL = (P1 × 0,25) + (P2 × 0,25) + ((PJ + AT) × 0,25)

Observação: A disciplina tem 2º critérios omitido, 
completar com 0,25 restante conforme professor
```

### 📋 Componentes de Avaliação

| Componente | Peso | Descrição |
|---|---|---|
| 📝 **P1** | 25% | Prova 1 - Avaliação teórica |
| 📝 **P2** | 25% | Prova 2 - Avaliação teórica |
| 📊 **PJ** | 25% | Projeto Semestral |
| ✅ **AT** | 25% | Atividades Semanais |

### ✅ Critérios de Sucesso
- 🎯 Presença mínima: Conforme regimento
- 📖 Entrega de atividades: Prazos estabelecidos
- 💻 Qualidade do projeto: Cumprimento de requisitos
- 📚 Aprendizado: Demonstração de compreensão

---

## 📝 Checklist de Ações Importantes

### 👥 Formação de Grupos

```
☐ 1. FORMAR GRUPOS
    └─ [ ] 3 a 5 integrantes por grupo
    └─ [ ] Manter mesma composição o semestre todo
    └─ [ ] Definir líder/responsável do grupo

☐ 2. SUBMETER LISTA DE NOMES
    └─ [ ] Arquivo com nomes completos de todos
    └─ [ ] Enviar na primeira atividade da disciplina
    └─ [ ] Incluir emails de contato

☐ 3. CRIAR REPOSITÓRIO GITHUB
    └─ [ ] Novo repositório público
    └─ [ ] Nome descritivo (ex: SO-2024-Grupo01)
    └─ [ ] Documentação clara em README.md
    └─ [ ] Usar markdown para organização
    └─ [ ] Compartilhar link com professor

☐ 4. RESUMO DA AULA 01
    └─ [ ] Arquivo Markdown (.md)
    └─ [ ] Principais conceitos discutidos
    └─ [ ] Organizado e bem estruturado
    └─ [ ] Enviar antes do prazo

☐ 5. MAPA MENTAL - LINHA DO TEMPO
    └─ [ ] Ferramenta: Miro (colaborativa)
    └─ [ ] Tema: Anos de lançamento de SOs
    └─ [ ] Formato visual (mind map)
    └─ [ ] Colaboração de todos do grupo
    └─ [ ] Salvar em .md para repositório

☐ 6. ORGANIZAÇÃO DO REPOSITÓRIO
    └─ [ ] Pasta para cada aula
    └─ [ ] Atividades bem nomeadas
    └─ [ ] Commits com mensagens claras
    └─ [ ] README.md com instruções
```

---

## 🗺️ Mapa Mental: Estrutura de Sistemas Operacionais

```
                          SISTEMAS OPERACIONAIS
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
            DEFINIÇÃO           ESTRUTURA            FUNÇÕES
                │                   │                   │
            ┌───┴─────┐        ┌───┴────┐         ┌────┴─────┐
            │          │        │        │         │          │
        Software    Interface  Kernel   Camadas Gerencia Gerencia
        Essencial   Usuário-                   Processos Memória
                    Máquina
                │              │        │         │          │
                │              │        │         │          │
            ┌───┴─────┐    ┌───┴────┐  │    ┌────┴─────┐ ┌──┴───┐
            │          │    │        │  │    │          │ │      │
        Gerencia  Gerencia  Modo    E/S  Escalo. Proteção RAM   Virtual
        Recursos  Hardware  Usuário                  Dados


                         EXEMPLOS PRINCIPAIS
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
            DESKTOP           MOBILE             SERVIDOR
                │                   │                   │
            ┌───┴─────┐        ┌───┴────┐         ┌────┴─────┐
            │          │        │        │         │          │
         Windows    macOS    Android   iOS      Linux     Unix
         (NTFS)     (APFS)                      (ext4)
```

---

## 📈 Fluxograma: Ciclo de Desenvolvimento das Atividades

```
                    ┌─────────────────┐
                    │   INÍCIO AULA   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Apresentação    │
                    │ Conteúdo Teórico│
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  DISCUSSÃO E    │
                    │   EXEMPLOS      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────────────────────┐
                    │  ATIVIDADE PRÁTICA               │
                    │  (Semanal em Grupo)              │
                    └────────┬────────────────────────┘
                             │
                    ┌────────▼────────────────────┐
                    │  DESENVOLVIMENTO DO         │
                    │  PROJETO SEMESTRAL          │
                    └────────┬────────────────────┘
                             │
                    ┌────────▼────────────────────┐
                    │  DOCUMENTAÇÃO EM            │
                    │  MARKDOWN (.md)             │
                    └────────┬────────────────────┘
                             │
                    ┌────────▼────────────────────┐
                    │  PUSH PARA GITHUB           │
                    │  (Repositório do Grupo)     │
                    └────────┬────────────────────┘
                             │
            ┌────────────────┴────────────────────┐
            │                                      │
    ┌───────▼────────┐              ┌────────▼──────────┐
    │  ENTREGA ANTES  │              │  AVALIAÇÃO        │
    │  DO PRAZO      │              │  DO PROFESSOR     │
    └────────┬───────┘              └────────┬──────────┘
             │                               │
    ┌───────▼────────────────────────────────▼─────┐
    │           FEEDBACK E NOTAS                    │
    └─────────────────┬───────────────────────────┘
                      │
            ┌─────────▼──────────┐
            │  PRÓXIMA AULA      │
            │  (Continuidade)    │
            └────────────────────┘
```

---

## 📚 Sequência de Conteúdos Esperada

```
┌─────────────────────────────────────────────┐
│ SEMANA 1: Introdução e Conceitos Básicos   │
│ ☐ O que é SO                               │
│ ☐ Histórico de SOs                         │
│ ☐ Estrutura básica                         │
└─────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────┐
│ SEMANAS 2-3: Processos e Threads            │
│ ☐ Gerenciamento de processos               │
│ ☐ Escalonamento                            │
│ ☐ Sincronização                            │
└─────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────┐
│ SEMANAS 4-5: Memória                        │
│ ☐ Gerenciamento de memória                 │
│ ☐ Paginação e segmentação                  │
│ ☐ Memória virtual                          │
└─────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────┐
│ SEMANAS 6-7: Entrada/Saída e Sistemas      │
│ ☐ Gerenciamento de E/S                     │
│ ☐ Sistemas de arquivos                     │
│ ☐ Dispositivos                             │
└─────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────┐
│ SEMANAS 8+: Tópicos Avançados              │
│ ☐ Segurança em SOs                         │
│ ☐ Virtualização                            │
│ ☐ SOs modernos (Docker, Kubernetes)        │
└─────────────────────────────────────────────┘
```

---

## 🔗 Referências Bibliográficas

### 📖 Livros Principais

1. **TANENBAUM, Andrew S.; BOS, Herbert**
   - Título: *Sistemas Operacionais Modernos*
   - Edição: 4. ed.
   - Editora: Pearson
   - Ano: 2016

2. **SILBERSCHATZ, Abraham; GALVIN, Peter B.; GAGNE, Greg**
   - Título: *Fundamentos de Sistemas Operacionais*
   - Edição: 9. ed.
   - Editora: LTC
   - Ano: 2015

3. **STALLINGS, William**
   - Título: *Sistemas Operacionais: Conceitos e Projetos*
   - Edição: 8. ed.
   - Editora: Pearson
   - Ano: 2015

### 📚 Referências Complementares

4. **DENARDIM, G. W.; BARRIQUELLO, C. H** (2014)
   - Sistemas Operacionais de Tempo Real e sua Aplicação em Sistemas Embarcados

5. **AWASTHI, A.; RAWAT, V** (2023)
   - Ramificação e Tarefas do Sistema Operacional

6. **DOWNEY, Allen B** (2015)
   - *Think OS: A Brief Introduction to Operating Systems*

### 🌐 Documentação Oficial

7. **RED HAT** - Red Hat Enterprise Linux System Administration Guide
   - Disponível em: https://redhat.com

8. **DOCKER INC.** - Docker Documentation
   - Disponível em: https://docs.docker.com

---

### Próximos Passos:
1. 📋 Formar grupos conforme indicado
2. 🔧 Criar repositório no GitHub
3. 📝 Escrever resumo em Markdown
4. 🗺️ Desenvolver mapa mental em Miro
5. 📤 Submeter no prazo estabelecido

### Recursos Importantes:
- 📚 Bibliografias fornecidas
- 🌐 Documentação oficial (Docker, RedHat)
- 👨‍🏫 Professor disponível para orientação
- 💻 Ferramentas gratuitas (GitHub, Miro)

---

## 📞 Contato e Suporte

- **Professor:** Me. Deivison S. Takatu
- **Email:** deivison.takatu@fatec.sp.gov.br
- **FATEC:** Instituto Federal de Educação Tecnológica (Itapetininga)
- **Plataforma:** Ambiente Virtual de Aprendizagem (AVA)

---

## 🏁 Conclusão

Esta aula apresentou os fundamentos essenciais para entender Sistemas Operacionais, desde conceitos básicos até aplicações práticas em projetos. A metodologia proposta equilibra teoria, prática e avaliação contínua, preparando os alunos para desafios reais do mercado.

**O portfólio de projetos será sua maior ferramenta de demonstração de aprendizado!** 🎯

---

**Documento criado como resumo da Aula 01**  
*Análise e Desenvolvimento de Sistemas (ADS) - FATEC Itapetininga* 
