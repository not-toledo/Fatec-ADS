# Resumo de Engenharia de Software II — Revisão de Requisitos de Software

---

## 1. O que é um Requisito?
Um **requisito** é uma condição ou capacidade obrigatória que deve ser satisfeita ou possuída por um sistema para resolver um problema ou atingir um objetivo.

* **Exemplo do mundo real:** Qual a condição para se dirigir legalmente?
  * Ter no mínimo 18 anos.
  * Tirar a Carteira Nacional de Habilitação (CNH).
  * Ter acesso a um veículo.

---

## 2. Requisitos Funcionais (RF)
* **Conceito:** Definem **o que** o sistema deve fazer. Representam as funcionalidades, serviços ou produtos finais oferecidos ao usuário. É diretamente aquilo que o cliente/usuário deseja obter.
* **Exemplo Prático (Emissão de Nota Fiscal):**
  * O usuário insere os dados da venda.
  * O sistema processa e **gera/emite a nota fiscal** para impressão ou envio por e-mail.
  * *O produto final (Requisito Funcional) é:* Emitir a nota fiscal.

---

## 3. Requisitos Não Funcionais (RNF)
* **Conceito:** Descrevem **como** o sistema deve realizar suas funções ou as restrições sob as quais o sistema deve operar. Não tratam do produto final em si, mas sim dos critérios de qualidade, processo, infraestrutura e ambiente.
* **Exemplo do mundo real (Obtenção da Habilitação):**
  * Realizar aulas teóricas.
  * Ser aprovado no teste teórico.
  * Concluir as aulas práticas de direção.
  * Ser aprovado no exame prático de direção.
* **Aplicação em TI (Emissão de Nota Fiscal):**
  * **Hardware/Infraestrutura:** Especificação de servidores, banco de dados ou conectividade.
  * **Segurança:** Criptografia dos dados fiscais e autenticação do emissor.
  * **Confiabilidade & Desempenho:** O sistema deve emitir a nota em até 3 segundos.
  * **Usabilidade:** Interface intuitiva para inserção rápida de dados.
* **Importância para o Desenvolvedor:** Compreender os RNFs é a chave para estruturar a arquitetura e as rotinas necessárias para entregar os RFs com qualidade.

---

## 4. Referências e Materiais de Estudo

### Bibliografia
* **PAULA FILHO, Wilson de Pádua.** *Engenharia de Software: Fundamentos, Métodos e Padrões*. Rio de Janeiro: Editora LTC.
* **SILVEIRA, Paulo et al.** *Introdução à Arquitetura e Desenvolvimento de Software*. São Paulo: Editora Campus.
* **TEIXEIRA, Fabricio.** *Introdução e boas práticas com UX Design*. São Paulo: Casa do Código.

### Artigos e Links Recomendados
* **Revista Visão Ágil:** Artigos e edições sobre metodologias ágeis.
* **Site Martin Fowler:** Artigos sobre arquitetura, padrões e engenharia de software.
* **Manifesto Ágil:** Princípios e valores do desenvolvimento ágil.
* **UX Design Brasil:** Leitura sobre experiência do usuário e criação de interfaces.

---

## 5. Atividades Práticas da Aula
1. **Exercício de Fixação em Sala:** Levantamento de Requisitos Funcionais e Não Funcionais para a criação de um aplicativo bancário.
2. **Trabalho Prático da Disciplina:**
   * Utilizar a proposta do projeto iniciada no semestre anterior ou estruturar um novo tema.
   * Realizar o levantamento completo dos Requisitos Funcionais (RF) e Não Funcionais (RNF).
   * Elaborar a documentação formal completa utilizando o template padrão do Word fornecido para a disciplina.
