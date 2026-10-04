# Manual Prático: Aplicação `cloud-so-app` – Análise de Sistemas Operacionais e Computação em Nuvem

**Disciplina:** Sistemas Operacionais / Nuvem  
**Projeto:** `cloud-so-app`  
**Autor:** Estudante de Tecnologia  

---

## Sumário
1. [Visão Geral e Objetivos](#1-visão-geral-e-objetivos)
2. [Pré-requisitos e Instalação de Ferramentas](#2-pré-requisitos-e-instalação-de-ferramentas)
3. [Desenvolvimento da Aplicação (`cloud-so-app`)](#3-desenvolvimento-da-aplicação-cloud-so-app)
4. [Publicação e Deploy no Render](#4-publicação-e-deploy-no-render)
5. [Testes e Comparação de Ambientes (Local vs. Cloud)](#5-testes-e-comparação-de-ambientes-local-vs-cloud)
6. [Análise Técnica dos Conceitos de Sistemas Operacionais](#6-análise-técnica-dos-conceitos-de-sistemas-operacionais)
7. [Conclusão](#7-conclusão)

---

## 1. Visão Geral e Objetivos

Este manual documenta o processo de desenvolvimento, implantação e análise conceitual da aplicação web **`cloud-so-app`**. O objetivo é demonstrar a interação entre o sistema operacional (SO) hospedeiro e aplicações executadas em ambiente local versus ambiente de nuvem (*PaaS* - Platform as a Service).

A aplicação utiliza o **Node.js** e o módulo nativo `os` para extrair dados em tempo real sobre hardware, gerenciamento de memória e estado de execução do sistema operacional.

---

## 2. Pré-requisitos e Instalação de Ferramentas

Para executar o projeto localmente e realizar o deploy, foram utilizadas as seguintes ferramentas:

1. **Node.js e NPM:**
   - Faça o download da versão LTS no site oficial [nodejs.org](https://nodejs.org/).
   - Verifique a instalação via terminal:
     ```bash
     node -v
     npm -v
     ```
2. **Git:**
   - Faça o download e instalação no site [git-scm.com](https://git-scm.com/).
   - Configure seu nome de usuário e e-mail:
     ```bash
     git config --global user.name "Seu Nome"
     git config --global user.email "seu-email@exemplo.com"
     ```
3. **VS Code (ou IDE de sua preferência):**
   - Editor de código recomendado para desenvolvimento em JavaScript/Node.js.

---

## 3. Desenvolvimento da Aplicação (`cloud-so-app`)

### Step-by-Step da Criação

1. **Criação do Diretório e Inicialização do Projeto:**
   ```bash
   mkdir cloud-so-app
   cd cloud-so-app
   npm init -y
   ```

2. **Instalação da Dependência Express:**
   ```bash
   npm install express
   ```

3. **Criação do Arquivo de Entrada (`index.js`):**
   Crie o arquivo `index.js` com o seguinte código, utilizando o módulo nativo `os` para captura das métricas do SO:

   ```javascript
   const express = require('express');
   const os = require('os');

   const app = express();

   app.get('/', (req, res) => {
     res.send(`
       <!DOCTYPE html>
       <html lang="pt-br">
       <head>
         <meta charset="UTF-8">
         <title>Monitor de Sistemas Operacionais</title>
         <style>
           body { font-family: Arial, sans-serif; margin: 40px; background-color: #f4f4f9; color: #333; }
           h1 { color: #0056b3; }
           p { font-size: 1.1rem; line-height: 1.5; }
         </style>
       </head>
       <body>
         <h1>Monitor de Sistemas Operacionais</h1>
         <p><strong>Hostname:</strong> ${os.hostname()}</p>
         <p><strong>Plataforma:</strong> ${os.platform()}</p>
         <p><strong>Arquitetura:</strong> ${os.arch()}</p>
         <p><strong>Memória Total:</strong> ${Math.round(os.totalmem()/1024/1024)} MB</p>
         <p><strong>Memória Livre:</strong> ${Math.round(os.freemem()/1024/1024)} MB</p>
         <p><strong>CPUs:</strong> ${os.cpus().length}</p>
         <p><strong>Uptime:</strong> ${Math.round(os.uptime()/60)} minutos</p>
       </body>
       </html>
     `);
   });

   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
   ```

4. **Teste Local:**
   Execute o servidor:
   ```bash
   node index.js
   ```
   Acesse no navegador: `http://localhost:3000`

---

## 4. Publicação e Deploy no Render

### 1. Envio para o GitHub
1. Crie um novo repositório público no GitHub com o nome `cloud-so-app`.
2. Adicione um arquivo `.gitignore` para ignorar a pasta `node_modules`:
   ```text
   node_modules/
   ```
3. Suba os arquivos para o repositório remotos:
   ```bash
   git init
   git add .
   git commit -m "Commit inicial da aplicação cloud-so-app"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/cloud-so-app.git
   git push -u origin main
   ```

### 2. Configuração e Publicação no Render
1. Acesse [dashboard.render.com](https://dashboard.render.com/) e crie uma conta (ou faça login via GitHub).
2. Clique no botão **New** e selecione a opção **Web Service**.
3. Conecte sua conta do GitHub e escolha o repositório `cloud-so-app`.
4. Preencha as configurações do serviço:
   - **Name:** `cloud-so-app`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Instance Type:** `Free`
5. Clique em **Create Web Service**.
6. Aguarde a finalização do processo de build e deploy. A URL fornecida pelo Render estará no padrão `https://cloud-so-app-xxx.onrender.com`.

---

## 5. Testes e Comparação de Ambientes (Local vs. Cloud)

Após publicar o projeto, foram extraídas as métricas do sistema executado no ambiente de máquina física (local) e na nuvem (instância gerenciada pelo Render):

| Métricas do Sistema | Ambiente Local (Físico / Bare Metal) | Ambiente Nuvem (Render / PaaS Container) |
| :--- | :--- | :--- |
| **Hostname** | Nome da máquina local (Ex: `DESKTOP-8A9C2`) | Hash do container / pod (Ex: `srv-c123456789`) |
| **Plataforma** | `win32` ou `darwin` (Windows / macOS) | `linux` (Kernel Linux isolado) |
| **Arquitetura** | `x64` | `x64` |
| **Memória Total** | ~16.384 MB (16 GB física) | ~512 MB (Cota limite da instância Free) |
| **Memória Livre** | ~6.144 MB (Recursos variáveis) | ~120 MB (Alocação dinâmica restrita) |
| **CPUs (Núcleos)** | 8 a 16 vCPUs (Processador host local) | 1 vCPU (Compartilhada via Hypervisor) |
| **Uptime** | Varia (Horas/Dias de uso do SO local) | Poucos minutos (Resetado a cada *deploy* ou *cold-start*) |

### Análise das Diferenças
- **Ambiente Local:** Exibe diretamente a quantidade bruta de recursos físicos da máquina host do desenvolvedor.
- **Ambiente Cloud (Render):** Exibe as especificações do **container virtualizado** ou da **VM limitada**. Os recursos visualizados representam as cotações atribuídas ao plano do provedor e não os limites do hardware físico do datacenter.

---

## 6. Análise Técnica dos Conceitos de Sistemas Operacionais

Relacionando a prática com o conteúdo ministrado na disciplina de Sistemas Operacionais e Computação em Nuvem:

1. **Processos e Threads (`process.env` e Event Loop):**
   A aplicação roda como um processo isolado gerenciado pelo SO. O Node.js executa sobre a engine V8 de maneira single-threaded para instruções assíncronas, requisitando chamadas de sistema (System Calls) para ler dados do kernel do SO.
2. **Gerenciamento de Memória (`os.totalmem()` e `os.freemem()`):**
   O SO faz a paginação e alocação dinâmica da memória RAM. Em ambiente de nuvem, o **Cgroups** do Kernel Linux impõe um teto rígido (*RAM limit*) para prevenir consumo excessivo entre instâncias em ambientes *multi-tenant*.
3. **Uso e Gerenciamento de CPU (`os.cpus()`):**
   A CPU detectada na nuvem é fruto de um escalonamento de tempo (*time-sharing*) gerenciado pelo Hypervisor. O Render atribui "fatias de tempo" de um núcleo virtualizado para o container.
4. **Sistema Operacional Hospedeiro e Virtualização:**
   Enquanto a execução local roda sobre o SO nativo da máquina, na nuvem a aplicação executa dentro de uma **mídia de virtualização leve (Containers Linux)** sobre um SO Hospedeiro (*Host OS*) da infraestrutura do provedor.
5. **Modelos de Nuvem (PaaS e Elasticidade):**
   A hospedagem no Render enquadra-se no modelo **PaaS (Platform as a Service)**, onde o desenvolvedor não gerencia patches de SO ou atualizações do Hypervisor. A infraestrutura atende aos princípios do NIST: *Autoatendimento sob demanda*, *Pool de recursos* e *Elasticidade*.

---

## 7. Conclusão

A elaboração da aplicação `cloud-so-app` permitiu visualizar na prática a abstração que os Sistemas Operacionais modernos e a Computação em Nuvem realizam sobre o hardware subjacente. A leitura das variáveis do SO via Node.js comprovou o funcionamento dos containers Linux em plataformas PaaS, demonstrando o isolamento de processos, limitação elástica de recursos (memória/CPU) e a transparência operacional oferecida pela nuvem.