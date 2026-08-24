# Atividade 02 - Pesquisa e Comparativo de Sistemas Operacionais Derivative

## 1. Pesquisa: Sistemas Operacionais Derivados e Suas Bases

* **Android**: Desenvolvido pela Google para dispositivos móveis, utiliza o **Kernel Linux** como base para gerenciamento de memória, processos e drivers de hardware.
* **macOS**: Desenvolvido pela Apple para computadores Mac, é construído sobre o ecossistema **Unix (BSD / XNU / Darwin)**, aproveitando a estabilidade e a arquitetura POSIX do Unix.
* **Ubuntu**: Desenvolvido pela Canonical, é derivado diretamente do **Debian GNU/Linux**, aproveitando sua arquitetura de pacotes (`.deb`) e estabilidade de sistema.
* **SteamOS**: Desenvolvido pela Valve para a plataforma Steam Deck e jogos, utiliza o **Arch Linux** como base para obter um sistema leve, altamente customizável e com atualizações contínuas (rolling release).
* **ChromeOS**: Desenvolvido pela Google para Chromebooks, é baseado na distribuição **Gentoo Linux**, aproveitando sua estrutura enxuta e focada na execução de serviços web e contêineres.

---

## 2. Tabela Comparativa: Sistema Derivado vs. Sistema Base

| Sistema Operacional | Sistema Base | Principais Diferenças e Adaptações |
| :--- | :--- | :--- |
| **Android** | Kernel Linux | Substitui a biblioteca padrão C (`glibc`) pela `Bionic`, elimina o ecossistema GNU tradicional e utiliza a *Android Runtime* (ART) para executar aplicativos Java/Kotlin em vez de uma interface gráfica Linux padrão. |
| **macOS** | Unix (FreeBSD / Mach) | Adiciona a camada proprietária de interface gráfica (*Aqua*), APIs exclusivas como *Cocoa* e *Metal*, além do sistema de arquivos *APFS*, diferindo das variantes tradicionais do Unix focadas em servidores/CLI. |
| **Ubuntu** | Debian GNU/Linux | Possui ciclo de lançamentos fixo a cada 6 meses (com versões LTS), utilitários gráficos de instalação próprios, foco maior na facilidade de uso para o usuário final e repositórios com softwares proprietários pré-configurados. |
| **SteamOS 3.0** | Arch Linux | Implementa um sistema de arquivos de leitura compartilhada (*read-only rootfs*) para maior estabilidade, interface gráfica totalmente adaptada para o modo *Big Picture* da Steam e a camada de compatibilidade *Proton* para rodar jogos do Windows. |
| **ChromeOS** | Gentoo Linux | Mantém uma estrutura mínima focada quase exclusivamente no navegador Google Chrome, utiliza partição primária bloqueada por segurança e executa aplicações Android e Linux via contêineres e máquinas virtuais. |
