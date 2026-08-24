# Resumo da Aula: Conceitos, Funções e Tipos de Sistemas Operacionais

**Instituição:** Fatec — Faculdade de Tecnologia  
**Professor:** Prof. Me. Deivison S. Takatu  

---

## 1. Tipos de Sistemas Operacionais

* **Sistemas de Grande Porte (Mainframes):**
  * Projetados para alta capacidade de entrada/saída (E/S) e processamento de carga massiva de transações (TPS).
  * Operam com processamento em lote (*batch processing*) e tempo compartilhado (*time-sharing*) para múltiplos usuários simultâneos.
  * **Características:** Alta confiabilidade, disponibilidade, segurança e integridade de dados.
  * **Aplicações:** Bancos, grandes varejistas, e-commerce e servidores web de grande escala.
  * **Exemplos:** OS/360, OS/390, Linux e variantes UNIX em ambientes de mainframe.

* **Sistemas Operacionais de Servidor:**
  * Focados em atender múltiplos usuários e serviços via rede (web, arquivos, banco de dados, autenticação).
  * Projetados para estabilidade, escalabilidade e compartilhamento eficiente de recursos.
  * **Exemplos:** Linux (ampla adoção e vasto ecossistema) e Windows Server (integração com Active Directory).

* **Sistemas de Multiprocessadores:**
  * Suportam múltiplas CPUs ou múltiplos núcleos para processamento paralelo.
  * **Desafios e Soluções:** Escalonamento e balanceamento de carga entre núcleos, sincronização (*locks*, semáforos, algoritmos *lock-free*), coerência de cache e comunicação inter-núcleos.
  * **Aplicações:** Servidores de alto desempenho e computação científica.

* **Sistemas de Computadores Pessoais (Desktop):**
  * Orientados a um único usuário, com interface gráfica (GUI), suporte a multiprogramação e multimídia.
  * Foco em usabilidade e vasta compatibilidade de aplicações.
  * **Exemplos:** Windows (foco em jogos e produtividade), macOS (integração hardware-software e UX) e Linux (personalizável, voltado para *power users* e desenvolvedores).

* **Sistemas Operacionais Portáteis (Móveis):**
  * **Aspectos Principais:** Gerenciamento agressivo de energia, APIs integradas para sensores (GPS, acelerômetro, câmera) e segurança baseada em permissões/isolamento (*sandboxing*).
  * **Distribuição:** Aplicativos disponibilizados via lojas oficiais.
  * **Exemplos:** Android e iOS.

* **Sistemas Embarcados (*Embedded Systems*):**
  * Executam em dispositivos dedicados com recursos de hardware limitados.
  * Software armazenado em memória ROM ou Flash, sem instalação/alteração frequente pelo usuário.
  * **Aplicações:** Setor automotivo (controle de motor, *infotainment*), eletrodomésticos (micro-ondas, Smart TVs) e sistemas embarcados sofisticados.
  * **Exemplos:** Embedded Linux, QNX e VxWorks.

* **Sistemas de Nós Sensores:**
  * Dispositivos extremamente pequenos, acionados por eventos e alimentados por baterias de capacidade limitada.
  * Comunicam-se sem fio com foco total em baixo consumo de energia e uso de protocolos leves.
  * **Aplicações:** Monitoramento ambiental, vigilância militar e agricultura de precisão.
  * **Exemplos:** TinyOS e Contiki.

* **Sistemas de Tempo Real (*Real-Time Systems*):**
  * **Hard Real-Time:** O não cumprimento do prazo de execução (*deadline*) pode causar falhas catastróficas (ex.: sistemas de controle de voo, sistemas críticos de segurança).
  * **Soft Real-Time:** A perda eventual de prazos gera apenas degradação da qualidade do serviço, mas é aceitável (ex.: streaming de mídia, jogos multimídia).

* **Sistemas de Cartões Inteligentes (*Smart Cards*):**
  * Recursos computacionais extremamente restritos, exigindo gerenciamento rigoroso de memória.
  * Foco elevado em segurança: criptografia, autenticação e resistência a ataques físicos.
  * Multiprogramação limitada através do isolamento por *applets*.

---

## 2. Controle de Versão com Git

* **O que é o Git:** Sistema distribuído de controle de versão de arquivos instalado localmente e utilizado via linha de comando.
* **Principais Funcionalidades:**
  * Registrar e manter o histórico do projeto.
  * Acompanhar modificações, comparar alterações e restaurar versões anteriores.
  * Sincronizar dados com repositórios remotos para baixar (*pull*) e enviar (*push*) código.
* **Configuração Inicial (linha de comando):**
  ```bash
  git config --global user.name "<Seu Nome>"
  git config --global user.email "<Seu Email>"
  ```
* **Uso com IDE (ex.: VS Code):**
  * Inicialização do repositório direto pela aba de *Controle de Código-Fonte*.
  * Registro de atualizações com mensagens de *commit*.
  * Publicação do repositório diretamente na conta pessoal do GitHub.

---

## 3. Boas Práticas de Versionamento

* **Commits Pequenos e Frequentes:** Facilitam a identificação de *bugs* e tornam a reversão de falhas mais simples.
* **Mensagens de Commit Claras:** Devem descrever com precisão o que foi alterado e o motivo.
* **Uso de Ramificações (*Branches*):** Manter a *branch* principal sempre estável, desenvolvendo novas *features* ou correções em ramificações isoladas.
* **Testes Automatizados:** Garantir a validação do código antes da realização do *merge* com a ramificação principal.

---

## 4. Atividades Práticas Propostas

1. **Integração IDE + GitHub:** Configurar a integração da IDE com a conta do GitHub utilizando o Git, testando autenticação, *commit*, *push* e *pull*.
2. **Ciclo de Teste de Repositório Local e Remoto:**
   * Criar um repositório de teste localmente e sincronizá-lo com o GitHub.
   * Deletar a pasta local do projeto.
   * Utilizar o comando `git clone` para clonar o repositório remoto e confirmar a restauração do projeto.
3. **Exploração no GitHub:** Pesquisar 5 projetos públicos de outros usuários no GitHub, realizar o clone via `git clone` para a máquina local e analisar a estrutura do código.

---

## Referências
* TANENBAUM, Andrew S.; BOS, Herbert. *Sistemas Operacionais Modernos*. 4. ed. Pearson, 2016.
* SILBERSCHATZ, A.; GALVIN, P. B.; GAGNE, G. *Fundamentos de Sistemas Operacionais*. 9. ed. LTC, 2015.
* STALLINGS, William. *Sistemas Operacionais: Conceitos e Projetos*. 8. ed. Pearson, 2015.
* DENARDIN, G. W.; BARRIQUELLO, C. H. *Sistemas Operacionais de Tempo Real e sua Aplicação em Sistemas Embarcados*. Editora da UFRGS, 2014.
resumo_aula_sistemas_operacionais.md
Exibindo resumo_aula_sistemas_operacionais.md.
