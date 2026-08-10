# 📚 História dos Sistemas Operacionais

> **Base:** capítulo 1 de *Sistemas Operacionais Modernos*, 4ª edição, Andrew S. Tanenbaum e Herbert Bos.
> Este resumo reorganiza os conceitos históricos do capítulo em linguagem de revisão.

## 🎯 Objetivo

- Entender por que os sistemas operacionais surgiram.
- Relacionar a evolução do hardware com a evolução dos SOs.
- Identificar as cinco gerações apresentadas no capítulo.
- Associar cada geração aos principais problemas e soluções.
- Compreender a trajetória de batch, multiprogramação, timesharing, PCs e mobilidade.

## 🗂️ Sumário

1. Antes dos sistemas operacionais
2. Primeira geração — válvulas
3. Segunda geração — transistores e batch
4. Terceira geração — CIs e multiprogramação
5. Quarta geração — computadores pessoais
6. Quinta geração — computadores móveis
7. UNIX, Linux e Android
8. Windows
9. Redes e sistemas distribuídos
10. Linha do tempo
11. Comparações
12. Mapas mentais
13. Fluxogramas
14. Revisão
15. Checklist

---

## 1. 🕰️ Antes dos sistemas operacionais

- Charles Babbage projetou a Máquina Analítica.
- A máquina era mecânica e não chegou a funcionar plenamente.
- A tecnologia disponível não permitia fabricar seus componentes com precisão suficiente.
- A Máquina Analítica não possuía sistema operacional.
- Babbage percebeu que uma máquina programável precisaria de software.
- Ada Lovelace é apresentada no capítulo como a primeira programadora.
- A história mostra que software e hardware evoluíram juntos.
- Antes dos SOs, o programador precisava lidar diretamente com a máquina.
- A crescente complexidade dos computadores criou a necessidade de abstrações.
- O SO surgiu para facilitar o uso e administrar recursos.

### 💡 Ideia central

- Quanto mais complexo o hardware, maior a necessidade de software de sistema.
- O SO não surgiu pronto.
- Ele foi resultado de uma evolução gradual.

---

## 2. 🔌 Primeira geração — 1945–1955: válvulas

### Características

- A primeira geração é apresentada aproximadamente entre 1945 e 1955.
- A tecnologia predominante era a válvula.
- Os computadores eram enormes.
- Eram caros.
- Eram pouco confiáveis.
- A programação era extremamente próxima do hardware.
- Código de máquina era utilizado.
- Linguagens de programação ainda não eram comuns.
- Não existia um SO moderno.
- A operação era essencialmente manual.

### 🖥️ Exemplos históricos

- John Atanasoff e Clifford Berry construíram um computador digital funcional.
- O equipamento utilizava válvulas.
- Konrad Zuse construiu o Z3.
- O Colossus foi construído em Bletchley Park.
- Howard Aiken participou da construção do Mark I.
- ENIAC foi construído por William Mauchley e J. Presper Eckert.

### ⚙️ Programação

- Um grupo de especialistas podia projetar a máquina.
- O mesmo grupo podia programar.
- O mesmo grupo podia operar.
- O mesmo grupo podia realizar manutenção.
- A programação podia envolver painéis e cabos.
- O programador controlava diretamente a máquina.
- O processo era demorado.
- Uma falha física podia interromper a execução.

### 🔥 Válvulas

- Computadores usavam milhares de válvulas.
- As válvulas podiam queimar.
- A confiabilidade era baixa.
- A manutenção era constante.
- O tempo de máquina era precioso.
- A operação exigia especialistas.

### 🗃️ Cartões perfurados

- No início da década de 1950, cartões perfurados melhoraram o processo.
- Programas podiam ser registrados em cartões.
- Os cartões podiam ser lidos pela máquina.
- Isso reduziu parte da programação por painéis.
- Ainda não existia a abstração fornecida por um SO moderno.

### 🎯 Resumo

- **Período:** 1945–1955.
- **Hardware:** válvulas.
- **Programação:** código de máquina e operação manual.
- **Usuários:** especialistas.
- **SO moderno:** inexistente.
- **Problema central:** enorme esforço manual e baixa confiabilidade.

---

## 3. 🧱 Segunda geração — 1955–1965: transistores e batch

### Transistores

- O transistor mudou radicalmente a computação.
- A confiabilidade aumentou.
- Computadores passaram a ser comercializados.
- Surgiu uma separação mais clara entre funções profissionais.
- Projetistas passaram a ser diferentes de operadores.
- Programadores passaram a ser diferentes do pessoal de manutenção.
- Mainframes passaram a ocupar salas específicas.
- O custo das máquinas continuava elevado.

### 🏢 Mainframes

- Grandes empresas utilizavam essas máquinas.
- Agências governamentais também podiam utilizá-las.
- Universidades estavam entre os usuários.
- As máquinas eram caras.
- O tempo de processamento era um recurso valioso.

### ⏳ Problema do processamento

- Programadores escreviam programas em FORTRAN ou assembly.
- Programas podiam ser perfurados em cartões.
- Os cartões eram entregues a operadores.
- O programador precisava esperar.
- Operadores gastavam tempo transportando materiais.
- O computador podia ficar ocioso durante essas atividades.
- O custo do desperdício era alto.

## 3.1 📦 Batch

- Batch significa processamento em lote.
- Várias tarefas eram reunidas.
- Um lote era preparado antes da execução.
- Um computador menor podia ler cartões.
- As tarefas podiam ser gravadas em fita magnética.
- Um computador maior realizava o processamento.
- A saída podia ser gravada em outra fita.
- O processamento seguinte podia começar automaticamente.
- Isso reduzia intervenção manual.
- O aproveitamento da máquina melhorava.

### 🔄 Fluxo batch

```text
Programador
    ↓
Cartões
    ↓
Leitura
    ↓
Fita de entrada
    ↓
Computador principal
    ↓
Fita de saída
    ↓
Impressão
```

### 🧾 Cartões de controle

- `$JOB` identificava a tarefa.
- `$FORTRAN` orientava o carregamento do compilador.
- `$LOAD` indicava o carregamento do programa.
- `$RUN` indicava a execução.
- `$END` indicava o fim.
- Esses comandos são antecessores históricos de mecanismos de controle de tarefas.

### 💻 FMS e IBSYS

- FMS significa Fortran Monitor System.
- IBSYS foi o sistema operacional da IBM para o 7094.
- FORTRAN era importante na computação científica.
- Assembly também era utilizada.
- O objetivo era processar tarefas com maior eficiência.

### 🎯 Resumo

- **Período:** 1955–1965.
- **Hardware:** transistores.
- **Computadores:** mainframes.
- **Técnica:** batch.
- **Linguagens:** FORTRAN e assembly.
- **Problema central:** desperdício do tempo de máquina.
- **Solução:** automatizar a execução em lotes.

---

## 4. 🧩 Terceira geração — 1965–1980: CIs e multiprogramação

### Circuitos integrados

- A terceira geração é apresentada aproximadamente entre 1965 e 1980.
- Circuitos integrados passaram a ser fundamentais.
- O custo/desempenho melhorou.
- Os computadores ficaram mais sofisticados.
- Os sistemas operacionais também ficaram mais complexos.

### IBM System/360

- A IBM possuía linhas científicas e comerciais diferentes.
- Manter duas linhas era caro.
- Clientes queriam poder crescer sem abandonar seus programas.
- O System/360 tentou resolver esses problemas.
- A família possuía modelos de diferentes tamanhos.
- Os modelos compartilhavam arquitetura e conjunto de instruções.
- A compatibilidade de software era uma meta importante.
- O sistema atendia computação científica.
- Também atendia computação comercial.

### ⚠️ Complexidade do OS/360

- O sistema operacional precisava funcionar em máquinas muito diferentes.
- Precisava lidar com diferentes quantidades de memória.
- Precisava lidar com diferentes periféricos.
- Precisava atender ambientes científicos.
- Precisava atender ambientes comerciais.
- Essas exigências eram conflitantes.
- O resultado foi um sistema enorme.
- O projeto envolveu milhares de programadores.
- O código possuía milhões de linhas de assembly.
- Havia muitos erros.
- A experiência mostrou o custo da compatibilidade em grande escala.

## 4.1 🔀 Multiprogramação

- Multiprogramação mantém vários programas disponíveis.
- Mais de um programa pode permanecer na memória.
- Se um programa espera por E/S, outro pode utilizar a CPU.
- Isso reduz o tempo ocioso do processador.
- O SO precisa controlar os programas.
- O SO precisa proteger os espaços de memória.
- O SO precisa decidir quando cada programa executa.
- O gerenciamento de recursos torna-se mais sofisticado.

### 🧠 Problema → solução

```text
Programa espera E/S
        ↓
CPU poderia ficar ociosa
        ↓
Outro programa é executado
        ↓
Maior utilização da CPU
```

## 4.2 ⏱️ Timesharing

- O compartilhamento de tempo surgiu para melhorar a interação.
- O usuário não precisava esperar um lote inteiro.
- Vários usuários podiam compartilhar o computador.
- O processador era dividido em intervalos.
- O tempo de resposta tornou-se importante.

### CTSS

- CTSS foi desenvolvido no MIT.
- Era um sistema de propósito geral.
- Teve importância na comunidade científica.
- Representa um marco na história do compartilhamento de tempo.

### MULTICS

- Pesquisadores do MIT trabalharam com Bell Labs e General Electric.
- O projeto recebeu o nome MULTICS.
- MULTICS significa MULTIplexed Information and Computing Service.
- O projeto influenciou a história posterior dos SOs.
- O Bell Labs posteriormente deixou o projeto.
- Ken Thompson continuou interessado no problema.

## 4.3 🐧 UNIX

- Ken Thompson desenvolveu uma versão mais enxuta inspirada no MULTICS.
- O trabalho inicial ocorreu em um PDP-7.
- O UNIX tornou-se uma influência importante.
- A história posterior inclui diversas versões e famílias.
- Berkeley UNIX tornou-se uma linha importante.
- System V também aparece na evolução.
- O UNIX influenciou sistemas posteriores.

### 🎯 Resumo

- **Período:** 1965–1980.
- **Hardware:** circuitos integrados.
- **Marco:** System/360.
- **Técnicas:** multiprogramação e timesharing.
- **Projetos:** CTSS e MULTICS.
- **Continuidade:** UNIX.
- **Problema central:** administrar sistemas muito mais complexos.

---

## 5. 🖥️ Quarta geração — 1980–presente: computadores pessoais

### Computação pessoal

- O computador deixou de ser exclusivo de grandes instituições.
- Microcomputadores ampliaram o acesso.
- O usuário individual passou a ser importante.
- O SO precisava oferecer uma experiência mais acessível.
- Interfaces de comando continuaram relevantes.
- Interfaces gráficas ganharam importância.

## 5.1 💾 CP/M

- CP/M foi importante nos primeiros microcomputadores.
- Era baseado em comandos.
- O usuário digitava instruções.
- Foi uma referência no mercado antes da consolidação do MS-DOS.

## 5.2 💿 MS-DOS

- A IBM desenvolveu o IBM PC no início dos anos 1980.
- A Microsoft inicialmente sugeriu a Digital Research.
- A Digital Research era uma fornecedora importante.
- A negociação não aconteceu como esperado.
- A Microsoft adquiriu um DOS da Seattle Computer Products.
- O sistema foi adaptado.
- O produto foi renomeado MS-DOS.
- O MS-DOS passou a dominar o mercado do IBM PC.
- A distribuição junto aos fabricantes foi um fator importante.

### ⌨️ Interface

- CP/M e MS-DOS utilizavam comandos.
- O usuário precisava conhecer a sintaxe.
- A interface era textual.
- O usuário tinha controle direto por comandos.

## 5.3 🪟 Windows

- A história apresentada no livro divide o Windows em quatro eras.
- MS-DOS.
- Windows baseado no MS-DOS.
- Windows baseado em NT.
- Windows moderno.

### Windows baseado no MS-DOS

- Mantinha relação forte com o MS-DOS.
- Facilitava a transição dos usuários.
- A familiaridade da interface era importante.

### Windows baseado em NT

- Representou uma mudança técnica importante.
- A família NT tornou-se base de versões posteriores.
- O livro diferencia Windows 95/98/Me da família NT/2000/XP/Vista/7.
- Interfaces semelhantes não significam arquiteturas iguais.
- Compatibilidade é uma força importante na evolução de SOs.

### 🧠 Lição

- Sistemas operacionais são difíceis de desenvolver.
- Por isso, tendem a evoluir durante muitos anos.
- Uma interface pode permanecer familiar enquanto a base técnica muda.
- A evolução incremental ajuda a preservar compatibilidade.

---

## 6. 📱 Quinta geração — 1990–presente: computadores móveis

### Mobilidade

- A computação móvel mudou a relação entre usuário e computador.
- O computador passou a acompanhar o usuário.
- Telefones ganharam capacidade computacional.
- Aplicativos passaram a ser centrais.
- Comunicação e computação foram combinadas.

### 📞 Smartphones

- O capítulo menciona o Nokia N9000 em meados dos anos 1990.
- O aparelho combinava telefone e PDA.
- Em 1997, a Ericsson usou o termo smartphone para o GS88 Penelope.
- Smartphones criaram um novo mercado para SOs.

## 6.1 📲 Symbian

- Symbian teve forte presença na primeira década dos smartphones.
- Foi usado por Nokia.
- Também foi usado por Samsung.
- Sony Ericsson e Motorola também utilizaram Symbian.
- Sua participação caiu posteriormente.
- Em 2011, a Nokia abandonou o Symbian como plataforma principal.

## 6.2 🍎 iOS

- O iOS foi lançado com o primeiro iPhone em 2007.
- A entrada da Apple mudou a competição móvel.
- A plataforma estava associada ao ecossistema do iPhone.

## 6.3 🤖 Android

- O Android foi lançado pelo Google em 2008.
- É baseado no núcleo Linux.
- Possuía uma abordagem aberta para fabricantes.
- Fabricantes podiam adaptar o sistema ao hardware.
- Uma grande comunidade de desenvolvedores contribuiu para o ecossistema.
- Android cresceu rapidamente no mercado.

### 🔋 Problemas específicos do mobile

- Bateria é um recurso limitado.
- O SO precisa controlar consumo.
- Aplicativos podem ser usados em interações curtas.
- A troca entre aplicativos precisa ser rápida.
- O sistema precisa gerenciar processos de forma proativa.
- Aplicativos podem ser iniciados e interrompidos automaticamente.
- Segurança e isolamento de aplicativos são importantes.
- O sistema precisa funcionar com recursos limitados.

### 🎯 Resumo

- **Período:** 1990–presente.
- **Foco:** mobilidade.
- **Sistemas:** Symbian, BlackBerry OS, iOS e Android.
- **Android:** baseado em Linux.
- **Problemas:** bateria, processos, responsividade e segurança.
- **Mudança central:** o computador acompanha o usuário.

---

## 7. 🐧 UNIX, Linux e Android

- UNIX começou como projeto associado a Ken Thompson.
- MULTICS influenciou esse desenvolvimento.
- O PDP-7 foi importante para o UNIX inicial.
- UNIX evoluiu para várias famílias.
- System V é uma família histórica.
- Berkeley UNIX é outra linha importante.
- MINIX foi criado por Andrew S. Tanenbaum.
- MINIX é descrito como um pequeno clone do UNIX.
- Linux possui uma base de código própria.
- Linux foi fortemente inspirado pelo UNIX.
- Linux é usado em estações de trabalho.
- Linux é usado em servidores.
- Linux também é usado em supercomputadores.
- Android utiliza o núcleo Linux.
- Android possui uma arquitetura própria no espaço de usuário.

### 🔗 Influência histórica

```text
MULTICS
   ↓
UNIX
   ↓
Famílias UNIX / BSD / System V
   ↓
MINIX
   ↓
Linux
   ↓
Android
```

> O diagrama representa influências históricas e conceituais; não significa que cada sistema seja simplesmente uma versão do anterior.

---

## 8. 🪟 História resumida do Windows

```text
MS-DOS
   ↓
Windows baseado no MS-DOS
   ↓
Windows NT
   ↓
Windows 2000 / XP / Vista / 7
   ↓
Windows 8 / 8.1
```

- O livro estudado foi publicado em 2016.
- Seu estudo de caso de Windows termina no Windows 8.1.
- Portanto, versões posteriores não fazem parte da narrativa histórica do capítulo.
- A família Windows passou por mudanças profundas.
- Compatibilidade ajudou a preservar a experiência dos usuários.
- A arquitetura interna mudou mesmo quando a interface parecia familiar.

---

## 9. 🌐 Sistemas de rede e distribuídos

### Sistema operacional de rede

- Usuários sabem que existem vários computadores.
- É possível acessar máquinas remotas.
- Arquivos podem ser copiados entre máquinas.
- Cada máquina possui seu próprio SO.
- Cada máquina possui usuários locais.
- A rede adiciona mecanismos de acesso remoto.

### Sistema operacional distribuído

- Procura apresentar vários processadores como um sistema integrado.
- Usuários podem não saber onde um programa está executando.
- Usuários podem não saber onde um arquivo está localizado.
- O SO administra essa complexidade.
- Algoritmos de escalonamento ficam mais complexos.
- Atrasos de comunicação podem afetar decisões.
- Informações sobre o estado do sistema podem estar desatualizadas.

### Comparação

| Rede | Distribuído |
|---|---|
| Máquinas percebidas separadamente | Busca uma visão integrada |
| Usuário sabe onde está conectando | Localização pode ser transparente |
| Cada máquina tem seu SO | Recursos podem ser coordenados |
| Acesso remoto é explícito | Distribuição pode ficar escondida |

---

## 10. 🗓️ Linha do tempo

| Período | Geração | Tecnologia | Ideia principal |
|---|---|---|---|
| 1945–1955 | 1ª | Válvulas | Operação manual |
| 1955–1965 | 2ª | Transistores | Batch |
| 1965–1980 | 3ª | CIs | Multiprogramação |
| 1980–presente | 4ª | PCs | Computação pessoal |
| 1990–presente | 5ª | Mobilidade | Smartphones |

### Marcos

- Máquina Analítica → computação programável.
- Década de 1940 → computadores eletrônicos.
- Década de 1950 → transistores.
- Década de 1950 → batch.
- Década de 1960 → circuitos integrados.
- Década de 1960 → timesharing.
- CTSS → compartilhamento de tempo.
- MULTICS → projeto influente.
- UNIX → nova etapa histórica.
- System/360 → família compatível.
- Década de 1980 → PCs.
- MS-DOS → IBM PC.
- Windows → expansão das interfaces gráficas.
- Década de 1990 → computação móvel.
- 2007 → iOS no primeiro iPhone.
- 2008 → Android.

---

## 11. 📊 Comparação das gerações

| Aspecto | 1ª | 2ª | 3ª | 4ª | 5ª |
|---|---|---|---|---|---|
| Hardware | Válvulas | Transistores | CIs | Microcomputadores | Dispositivos móveis |
| Interação | Manual | Batch | Interativa | CLI/GUI | Touch/apps |
| Público | Especialistas | Instituições | Múltiplos usuários | Pessoas | Usuários móveis |
| Foco | Controlar máquina | Automatizar | Compartilhar | Popularizar | Mobilidade |
| Técnica | Manual | Batch | Multiprogramação | Interface pessoal | Gerenciamento móvel |

### Evolução do objetivo

- 1ª: **controlar a máquina**.
- 2ª: **automatizar tarefas**.
- 3ª: **compartilhar recursos**.
- 4ª: **popularizar a computação**.
- 5ª: **levar a computação para qualquer lugar**.

---

## 12. 🧠 Mapa mental

```text
HISTÓRIA DOS SISTEMAS OPERACIONAIS
│
├── 1ª GERAÇÃO
│   ├── 1945–1955
│   ├── Válvulas
│   ├── Manual
│   └── Sem SO moderno
│
├── 2ª GERAÇÃO
│   ├── 1955–1965
│   ├── Transistores
│   ├── Mainframes
│   └── Batch
│
├── 3ª GERAÇÃO
│   ├── 1965–1980
│   ├── Circuitos integrados
│   ├── System/360
│   ├── Multiprogramação
│   ├── Timesharing
│   ├── CTSS
│   ├── MULTICS
│   └── UNIX
│
├── 4ª GERAÇÃO
│   ├── 1980–presente
│   ├── PCs
│   ├── CP/M
│   ├── MS-DOS
│   └── Windows
│
└── 5ª GERAÇÃO
    ├── 1990–presente
    ├── Smartphones
    ├── Symbian
    ├── iOS
    └── Android
```

---

## 13. 🔄 Fluxograma

```text
Hardware complexo
      ↓
Operação manual
      ↓
Válvulas
      ↓
Transistores
      ↓
Batch
      ↓
Circuitos integrados
      ↓
Multiprogramação
      ↓
Timesharing
      ↓
UNIX
      ↓
Microprocessadores
      ↓
Computadores pessoais
      ↓
MS-DOS / Windows
      ↓
Computação móvel
      ↓
Smartphones
      ↓
iOS / Android
```

---

## 14. 🧩 Problema → solução

| Problema | Solução histórica |
|---|---|
| Programação manual | Cartões perfurados |
| Baixa confiabilidade | Transistores |
| Tempo desperdiçado por operadores | Batch |
| CPU ociosa durante E/S | Multiprogramação |
| Espera excessiva do usuário | Timesharing |
| Linhas incompatíveis de computadores | System/360 |
| Computação restrita a instituições | PCs |
| Interface difícil | Interfaces gráficas |
| Computação presa a um local | Mobilidade |
| Bateria limitada | Gerenciamento de energia |
| Muitos aplicativos móveis | Gerenciamento de processos |
| Necessidade de isolamento | Mecanismos de segurança |

### 🎯 Regra de estudo

- Não memorize somente datas.
- Memorize **problema → tecnologia → solução → consequência**.

---

## 15. ⚠️ Confusões comuns

- Batch não é a mesma coisa que multiprogramação.
- Transistor é tecnologia de hardware.
- Circuito integrado é tecnologia de hardware.
- Multiprogramação é técnica de gerenciamento.
- Timesharing é compartilhamento de tempo.
- UNIX não é Linux.
- Linux não é simplesmente uma cópia do UNIX.
- Android utiliza Linux, mas possui arquitetura própria.
- Windows não é apenas uma interface gráfica.
- Rede e sistema distribuído não são sinônimos.
- As cinco gerações se sobrepõem.
- As datas são referências históricas, não fronteiras absolutas.

---

## 16. 🎓 Questões de revisão

### 1. Qual tecnologia marcou a primeira geração?
- Válvulas.

### 2. Qual era o principal problema das válvulas?
- Baixa confiabilidade e grande esforço operacional.

### 3. O que mudou com o transistor?
- A confiabilidade aumentou e computadores puderam ser comercializados de forma mais ampla.

### 4. O que é batch?
- Processamento de tarefas agrupadas em lotes.

### 5. Por que batch foi importante?
- Reduziu intervenção manual e desperdício de tempo de máquina.

### 6. Qual tecnologia marcou a terceira geração?
- Circuitos integrados.

### 7. Qual computador é um marco da terceira geração?
- IBM System/360.

### 8. O que é multiprogramação?
- Manter vários programas disponíveis para uso do processador.

### 9. Qual problema a multiprogramação resolve?
- Reduz a ociosidade da CPU quando um programa espera E/S.

### 10. O que é timesharing?
- Compartilhamento do tempo de processamento entre usuários ou tarefas.

### 11. Qual sistema do MIT é citado na história do timesharing?
- CTSS.

### 12. O que foi MULTICS?
- Um projeto de sistema de computação compartilhada que influenciou a evolução dos SOs.

### 13. Quem é associado ao UNIX inicial?
- Ken Thompson.

### 14. Qual máquina foi importante para o UNIX inicial?
- PDP-7.

### 15. Qual geração corresponde aos PCs?
- Quarta geração.

### 16. Qual sistema dominou o IBM PC?
- MS-DOS.

### 17. Qual sistema era um concorrente importante do MS-DOS?
- CP/M.

### 18. Quais eras do Windows aparecem no estudo?
- MS-DOS, Windows baseado no MS-DOS, Windows baseado em NT e Windows moderno.

### 19. Qual geração corresponde à computação móvel?
- Quinta geração.

### 20. Qual sistema dominou muitos smartphones na primeira década?
- Symbian.

### 21. Quando o iOS foi lançado?
- 2007, com o primeiro iPhone.

### 22. Quando o Android foi lançado pelo Google?
- 2008.

### 23. Em que núcleo o Android é baseado?
- Linux.

### 24. Por que bateria é um problema de SO móvel?
- Porque energia é limitada e precisa ser administrada.

### 25. Qual é a diferença entre rede e distribuído?
- Rede expõe múltiplas máquinas; distribuído busca apresentar os recursos de forma integrada.

---

## 17. 📋 Checklist

- [ ] Sei explicar o período anterior aos SOs.
- [ ] Sei explicar a primeira geração.
- [ ] Sei explicar válvulas.
- [ ] Sei explicar transistores.
- [ ] Sei definir batch.
- [ ] Sei identificar FMS.
- [ ] Sei identificar IBSYS.
- [ ] Sei explicar System/360.
- [ ] Sei definir multiprogramação.
- [ ] Sei explicar timesharing.
- [ ] Sei identificar CTSS.
- [ ] Sei explicar MULTICS.
- [ ] Sei relacionar MULTICS e UNIX.
- [ ] Sei identificar Ken Thompson.
- [ ] Sei identificar PDP-7.
- [ ] Sei explicar a quarta geração.
- [ ] Sei explicar CP/M.
- [ ] Sei explicar MS-DOS.
- [ ] Sei resumir a evolução do Windows.
- [ ] Sei explicar a quinta geração.
- [ ] Sei identificar Symbian.
- [ ] Sei identificar iOS.
- [ ] Sei identificar Android.
- [ ] Sei explicar a relação Android/Linux.
- [ ] Sei explicar os desafios da bateria.
- [ ] Sei diferenciar rede e distribuído.
- [ ] Sei reconstruir a linha do tempo sem consultar.

---

## 18. 🧪 Método de estudo

### Etapa 1
- Memorize as cinco gerações.
- Associe cada uma à tecnologia principal.

### Etapa 2
- Para cada geração, identifique o problema.
- Depois identifique a solução.

### Etapa 3
- Estude os sistemas históricos.
- FMS.
- IBSYS.
- OS/360.
- CTSS.
- MULTICS.
- UNIX.
- MINIX.
- Linux.
- CP/M.
- MS-DOS.
- Windows.
- Symbian.
- iOS.
- Android.

### Etapa 4
- Refaça o mapa mental.
- Refaça o fluxograma.
- Responda as questões.
- Faça o checklist.
- Revise somente os pontos em que errou.

---

## 19. 🏁 Resumo final

- A evolução dos SOs acompanha a evolução do hardware.
- A primeira geração era essencialmente manual.
- A segunda geração introduziu transistores e batch.
- A terceira geração introduziu CIs, multiprogramação e timesharing.
- MULTICS influenciou a história do UNIX.
- UNIX influenciou várias famílias posteriores.
- A quarta geração levou o SO para computadores pessoais.
- MS-DOS teve papel central no IBM PC.
- Windows evoluiu de uma base ligada ao MS-DOS para a família NT e sistemas posteriores.
- A quinta geração levou os SOs para dispositivos móveis.
- Symbian teve grande presença inicial.
- iOS entrou com o iPhone em 2007.
- Android chegou em 2008 e é baseado em Linux.
- Sistemas móveis acrescentaram preocupações com bateria, processos e segurança.
- A história é marcada por problemas técnicos e soluções sucessivas.
- A melhor forma de estudar é compreender a relação entre causa e consequência.

### 🧠 Frase para memorizar

> **Os sistemas operacionais evoluíram porque os computadores ficaram mais complexos, mais acessíveis e mais móveis — e alguém precisava administrar tudo isso.**

---

## 20. 📚 Referência

- TANENBAUM, Andrew S.; BOS, Herbert. *Sistemas Operacionais Modernos*. 4. ed. São Paulo: Pearson, 2016.
- Fonte fornecida para este trabalho: `Sistemas Operacionais Modernos.pdf`.
