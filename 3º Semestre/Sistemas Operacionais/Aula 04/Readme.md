# Resumo: Estrutura e Arquitetura de Sistemas Operacionais

**Disciplina:** Estrutura e Arquitetura de Sistemas Operacionais  
**Instituição:** Fatec (Faculdade de Tecnologia)  
**Professor:** Me. Deivison S. Takatu  

---

## 1. Importância e Conceito de Sistema Operacional (SO)
Sem um Sistema Operacional, cada aplicação precisaria gerenciar individualmente:
- Memória e processador;
- Dispositivos de E/S e arquivos;
- Segurança e detalhes específicos do hardware.

**Função do SO:** Prover uma **camada de abstração** entre as aplicações do usuário e o hardware subjacente.

---

## 2. Componentes do Sistema Operacional
- **Kernel (Núcleo):** Gerencia os recursos críticos do sistema.
- **Gerenciamento de Processos:** Execução e controle de programas.
- **Gerenciamento de Memória:** Alocação e proteção de memória física e virtual.
- **Sistema de Arquivos:** Organização e estruturação hierárquica de dados em armazenamento.
- **Entrada e Saída (E/S):** Comunicação com dispositivos externos (teclado, mouse, disco, rede, impressora).
- **Drivers:** Módulos que atuam como interface com hardwares específicos, abstraindo a complexidade para o SO.

---

## 3. Kernel e Modos de Execução

### Responsabilidades do Kernel
1. Gerenciamento de processos e threads.
2. Controle de memória física e virtual.
3. Controle de periféricos e dispositivos.
4. Comunicação entre hardware e software.
5. Proteção e segurança do sistema.

### Modos de Execução
- **Modo Usuário (*User Mode*):** Execução de aplicações com acesso limitado ao hardware para garantir segurança e estabilidade.
- **Chamada de Sistema (*System Call*):** Mecanismo de solicitação de serviços pelo programa ao kernel.
- **Modo Kernel (*Kernel Mode*):** Execução de funções críticas do sistema com acesso total aos recursos de hardware.

---

## 4. Conceitos de Programa, Processo e Thread
- **Programa:** Arquivo estático armazenado em disco (ex: `chrome.exe`).
- **Processo:** Programa carregado em memória e em execução, possuindo seu próprio espaço de endereçamento.
  - *Componentes:* Código executável (`text`), dados, pilha (`stack`), registradores de CPU e recursos/arquivos abertos.
- **Thread:** Fluxo de execução dentro de um mesmo processo (ex: abas e tarefas do navegador).

---

## 5. Reaproveitamento de Estrutura
Muitos sistemas operacionais modernos são construídos reaproveitando ou adaptando kernels e arquiteturas existentes, visando:
- Redução de custos e tempo de desenvolvimento;
- Maior estabilidade e segurança testadas pela comunidade/mercado;
- Suporte e atualizações contínuas.

**Exemplos propostos na aula:**
- **Raspberry Pi OS:** Baseado no **Debian (Linux)**.
- **Orbis OS (PlayStation 4):** Baseado no **FreeBSD**.

---

## 6. Atividades Propostas no Material

### Atividade 01: Processo de Formatação e Instalação
- Elaborar um documento Markdown descrevendo detalhadamente as etapas de formatação e instalação de um SO.
- Identificar para cada etapa quais componentes do SO e hardware estão envolvidos e sua relevância.

### Atividade 02: Pesquisa e Tabela Comparativa de SOs
- Identificar **5 Sistemas Operacionais** derivados de outros (usando mesmo kernel, arquitetura ou estrutura).
- Construir uma **tabela comparativa** destacando as diferenças entre cada SO e seu sistema base.

---

## Referências Bibliográficas Destacadas
- TANENBAUM, Andrew S.; BOS, Herbert. *Sistemas Operacionais Modernos*. 4. ed.
- SILBERSCHATZ, A.; GALVIN, P. B.; GAGNE, G. *Fundamentos de Sistemas Operacionais*. 9. ed.
- STALLINGS, William. *Sistemas Operacionais: Conceitos e Projetos*. 8. ed.
