# 📘 Aula 01 - Apresentação & Revisão de Lógica de Programação

**Data:** Abertura do Semestre  
**Disciplina:** Estrutura de Dados  
**Professor:** Prof. Me. Adriano Daniel  
**Linguagem de Referência:** C++

---

## 1. O que é um Algoritmo?

Um algoritmo é uma sequência lógica e finita de instruções para resolver um determinado problema. Qualquer tarefa que siga um padrão pode ser representada por um algoritmo.

### As 3 Fases Fundamentais de um Algoritmo:
1. **Entrada (Input):** Dados iniciais fornecidos pelo usuário ou sistema (ex: teclado com `cin`).
2. **Processamento:** Cálculos, comparações e lógica executados pelo processador/memória.
3. **Saída (Output):** O resultado do processamento exibido ao usuário (ex: tela/vídeo com `cout`).

---

## 2. Conceito de Memória e Variáveis

* **O que é uma variável?** É um espaço reservado na memória RAM que funciona como um container (ou gaveteiro) rotulado para armazenar dados cujo valor pode mudar durante a execução do programa.
* **Exemplo:** `nome = "Bob"`, `idade = 35`.

### Operadores Básicos em C++
* **Aritméticos:** `+`, `-`, `*`, `/`, `%`
* **Relacionais:** `<`, `<=`, `>`, `>=`, `==`, `!=`
* **Lógicos:** `&&` (AND), `||` (OR), `!` (NOT)
* **Atribuição:** `=`, `+=`, `-=`, `*=`, `/=`

---

## 3. Representação de Algoritmos (Fluxogramas)

Formas comuns de descrever a lógica antes da codificação: Português Estruturado, Fluxogramas (Diagrama de Bloco) e UML.

### Principais Símbolos do Fluxograma:
* **Elipse (Terminal):** Indica o INÍCIO ou FIM do fluxo.
* **Paralelogramo / Trapezoide:** Entrada de dados via teclado.
* **Retângulo:** Processamento / Cálculos em geral.
* **Seta:** Indica o fluxo e a direção dos dados.
* **Símbolo de Vídeo/Display:** Saída de dados na tela.

---

## 🏋️‍♂️ Exercícios / Práticas Propostas na Aula

1. **Conversão de Temperatura (Fahrenheit para Celsius):**
   $$\text{Celsius} = \frac{(\text{Fahrenheit} - 32) \times 5}{9}$$

2. **Cálculo da Área do Triângulo:**
   $$\text{Área} = \frac{\text{Base} \times \text{Altura}}{2}$$

3. **Cálculo de Salário (Bruto x Líquido):**
   $$\text{Salário Bruto} = \text{Horas Trabalhadas} \times \text{Valor Hora}$$
   $$\text{INSS} = \text{Salário Bruto} \times 0.12$$
   $$\text{Salário Líquido} = \text{Salário Bruto} - \text{INSS}$$
