/**
 * Monitor de Sistemas Operacionais — versão 2
 * Node.js + Express (única dependência externa: express)
 *
 * Executar:   npm install express && node server-v2.js
 * Acessar:    http://localhost:3000   (JSON em /api/sistema)
 *
 * Variáveis de ambiente opcionais:
 *   PORT=3000          porta do servidor
 *   HOST=127.0.0.1     endereço de escuta (use 0.0.0.0 só em rede confiável!)
 *   PING_HOST=1.1.1.1  servidor usado para medir latência e perda de pacotes
 *   PUBLIC_IP=false    desativa a consulta do IP público (api.ipify.org)
 *   SHOW_ENV=false     desativa a exibição de variáveis de ambiente
 *
 * Compatibilidade: Windows (PowerShell/WMI), Linux (/proc, /sys, df, lsblk)
 * e macOS (parcial). Onde o sistema não expõe um dado, o painel avisa.
 */
'use strict';

const express = require('express');
const os = require('os');
const fs = require('fs');
const https = require('https');
const { execFile, exec } = require('child_process');
const { promisify } = require('util');

const execFileP = promisify(execFile);
const execP = promisify(exec);

const IS_WIN = process.platform === 'win32';
const IS_LINUX = process.platform === 'linux';
const IS_MAC = process.platform === 'darwin';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const PING_HOST = process.env.PING_HOST || '1.1.1.1';
const PUBLIC_IP_ENABLED = process.env.PUBLIC_IP !== 'false';
const SHOW_ENV = process.env.SHOW_ENV !== 'false';

const app = express();

/* ====================================================================
 * 1. Utilitários
 * ==================================================================== */

function fmtBytes(bytes) {
  if (bytes === null || bytes === undefined || Number.isNaN(bytes)) return '—';
  const un = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let i = 0;
  let v = Number(bytes);
  while (v >= 1024 && i < un.length - 1) {
    v /= 1024;
    i++;
  }
  return v.toFixed(i === 0 ? 0 : 2) + ' ' + un[i];
}

function fmtTempo(seg) {
  seg = Math.max(0, Math.floor(seg));
  const d = Math.floor(seg / 86400);
  const h = Math.floor((seg % 86400) / 3600);
  const m = Math.floor((seg % 3600) / 60);
  const s = seg % 60;
  const p = [];
  if (d) p.push(d + 'd');
  if (d || h) p.push(h + 'h');
  p.push(m + 'min');
  p.push(s + 's');
  return p.join(' ');
}

const fmtTaxa = (bps) => (bps === null || bps === undefined ? '—' : fmtBytes(bps) + '/s');
const fmtNum = (n) => (n === null || n === undefined ? '—' : Number(n).toLocaleString('pt-BR'));
const arred = (n, c = 1) => Math.round(n * 10 ** c) / 10 ** c;
const numOuNull = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
};
const lista = (v) => (v === null || v === undefined ? [] : Array.isArray(v) ? v : [v]);

function lerArquivo(caminho) {
  try {
    const t = fs.readFileSync(caminho, 'utf8').trim();
    return t === '' ? null : t;
  } catch {
    return null;
  }
}

function fmtDuracaoMin(min) {
  if (min === null || min === undefined || !Number.isFinite(min) || min < 0) return null;
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return h + 'h ' + String(m).padStart(2, '0') + 'min';
}

/* ====================================================================
 * 2. Execução de comandos externos
 * ==================================================================== */

async function rodar(cmd, args = [], timeout = 8000) {
  try {
    const { stdout } = await execFileP(cmd, args, {
      timeout,
      windowsHide: true,
      maxBuffer: 32 * 1024 * 1024,
    });
    return stdout.toString();
  } catch {
    return null;
  }
}

// Executa um script PowerShell e devolve o resultado já convertido de JSON.
async function psJson(script, timeout = 20000) {
  const cmd =
    '[Console]::OutputEncoding=[System.Text.Encoding]::UTF8; ' +
    '$ErrorActionPreference="SilentlyContinue"; $ProgressPreference="SilentlyContinue"; ' +
    '& { ' + script + ' } | ConvertTo-Json -Depth 4 -Compress';
  const saida = await rodar(
    'powershell.exe',
    ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', cmd],
    timeout
  );
  if (!saida || !saida.trim()) return null;
  try {
    return JSON.parse(saida.replace(/^\uFEFF/, ''));
  } catch {
    return null;
  }
}

/* ====================================================================
 * 3. Cache "stale-while-revalidate"
 *    Os coletores lentos rodam em segundo plano; a API devolve sempre o
 *    último valor conhecido (ou null enquanto a 1ª coleta não termina).
 *    Só coleta enquanto alguém estiver com a página aberta.
 * ==================================================================== */

const cache = new Map();
const INDISPONIVEL = {
  indisponivel: true,
  motivo: 'não foi possível coletar (comando ausente ou sem permissão).',
};

function obter(nome, ttlMs, fn) {
  let e = cache.get(nome);
  if (!e) {
    e = { valor: null, ts: 0, rodando: false };
    cache.set(nome, e);
  }
  if (!e.rodando && Date.now() - e.ts >= ttlMs) {
    e.rodando = true;
    Promise.resolve()
      .then(fn)
      .then((v) => {
        e.valor = v === null || v === undefined ? INDISPONIVEL : v;
      })
      .catch((err) => {
        e.valor = { indisponivel: true, motivo: err.message };
      })
      .finally(() => {
        e.ts = Date.now();
        e.rodando = false;
      });
  }
  return e.valor;
}

// Versão "await" usada dentro de coletores (cache simples por TTL).
const memos = new Map();
async function memo(nome, ttlMs, fn) {
  const e = memos.get(nome);
  if (e && Date.now() - e.ts < ttlMs) return e.valor;
  const valor = await fn();
  memos.set(nome, { valor, ts: Date.now() });
  return valor;
}

/* ====================================================================
 * 4. Amostradores contínuos (CPU do sistema e do próprio processo)
 * ==================================================================== */

const somaTempos = (cpus) =>
  cpus.reduce(
    (acc, c) => {
      for (const k of Object.keys(c.times)) acc[k] = (acc[k] || 0) + c.times[k];
      return acc;
    },
    {}
  );

function usoEntre(a, b) {
  const total = Object.keys(b).reduce((s, k) => s + (b[k] - (a[k] || 0)), 0);
  const idle = b.idle - (a.idle || 0);
  return total > 0 ? Math.round((1 - idle / total) * 100) : 0;
}

let cpuAnterior = os.cpus();
let cpuUso = { total: 0, nucleos: cpuAnterior.map(() => 0) };

let procCpuAnterior = process.cpuUsage();
let procTsAnterior = process.hrtime.bigint();
let procCpuPct = 0; // % de UM núcleo

setInterval(() => {
  const atual = os.cpus();
  cpuUso = {
    total: usoEntre(somaTempos(cpuAnterior), somaTempos(atual)),
    nucleos: atual.map((c, i) => usoEntre(cpuAnterior[i].times, c.times)),
  };
  cpuAnterior = atual;

  const u = process.cpuUsage();
  const t = process.hrtime.bigint();
  const dCpu = u.user - procCpuAnterior.user + (u.system - procCpuAnterior.system); // µs
  const dT = Number(t - procTsAnterior) / 1000; // µs
  procCpuPct = dT > 0 ? (dCpu / dT) * 100 : 0;
  procCpuAnterior = u;
  procTsAnterior = t;
}, 1000).unref();

/* ====================================================================
 * 5. Sistema operacional
 * ==================================================================== */

async function coletarSOEstatico() {
  const r = {};
  try {
    if (IS_WIN) {
      const j = await psJson(
        '$o=Get-CimInstance Win32_OperatingSystem; $c=Get-CimInstance Win32_ComputerSystem; ' +
          '[pscustomobject]@{ nome=$o.Caption; build=$o.BuildNumber; versao=$o.Version; ' +
          'fab=$c.Manufacturer; modelo=$c.Model; usuario=$c.UserName }'
      );
      if (j) {
        r.nomeComercial = j.nome ? String(j.nome).trim() : null;
        r.build = j.build ? String(j.build) : null;
        r.versaoSO = j.versao || null;
        r.fabricante = j.fab || null;
        r.modelo = j.modelo || null;
        r.usuarioConsole = j.usuario || null;
      }
    } else if (IS_LINUX) {
      const t = lerArquivo('/etc/os-release');
      const m = t && t.match(/^PRETTY_NAME="?([^"\n]+)"?/m);
      r.nomeComercial = m ? m[1] : null;
      r.fabricante = lerArquivo('/sys/class/dmi/id/sys_vendor');
      r.modelo = lerArquivo('/sys/class/dmi/id/product_name');
    } else if (IS_MAC) {
      const nome = ((await rodar('sw_vers', ['-productName'])) || '').trim();
      const ver = ((await rodar('sw_vers', ['-productVersion'])) || '').trim();
      r.nomeComercial = (nome + ' ' + ver).trim() || null;
      r.build = ((await rodar('sw_vers', ['-buildVersion'])) || '').trim() || null;
    }
  } catch {
    /* ignora */
  }
  return r;
}

async function coletarLogados() {
  if (IS_WIN) {
    const est = cache.get('soEstatico');
    const u = est && est.valor && est.valor.usuarioConsole;
    return { usuarios: u ? [u] : [] };
  }
  const s = await rodar('who', []);
  if (s === null) return INDISPONIVEL;
  const usuarios = [...new Set(s.split('\n').map((l) => l.trim().split(/\s+/)[0]).filter(Boolean))];
  return { usuarios };
}

function montarSO() {
  const est = obter('soEstatico', 600000, coletarSOEstatico) || {};
  const logados = obter('logados', 15000, coletarLogados);
  let usuario = null;
  let shell = null;
  try {
    const ui = os.userInfo();
    usuario = ui.username;
    shell = ui.shell || null;
  } catch {
    /* ignora */
  }
  if (!shell) shell = IS_WIN ? process.env.ComSpec || null : process.env.SHELL || null;

  const offset = -new Date().getTimezoneOffset() / 60;
  const fuso =
    Intl.DateTimeFormat().resolvedOptions().timeZone +
    ' (UTC' + (offset >= 0 ? '+' : '') + offset + ')';

  const diretorios = [
    { rotulo: 'Home do usuário', caminho: os.homedir() },
    { rotulo: 'Temporários', caminho: os.tmpdir() },
    { rotulo: 'Diretório de execução', caminho: process.cwd() },
    { rotulo: 'Executável do Node.js', caminho: process.execPath },
  ];
  if (IS_WIN) {
    for (const [rot, v] of [
      ['Pasta do Windows', 'SystemRoot'],
      ['Arquivos de Programas', 'ProgramFiles'],
      ['Dados do aplicativo (AppData)', 'APPDATA'],
    ]) {
      if (process.env[v]) diretorios.push({ rotulo: rot, caminho: process.env[v] });
    }
  }

  return {
    hostname: os.hostname(),
    plataforma: os.platform(),
    tipo: os.type(),
    nomeComercial: est.nomeComercial || null,
    versao: typeof os.version === 'function' ? os.version() : null,
    build: est.build || null,
    kernel: os.release(),
    arquitetura: os.arch(),
    endianness: os.endianness() === 'LE' ? 'Little Endian' : 'Big Endian',
    fabricante: est.fabricante || null,
    modelo: est.modelo || null,
    uptime: fmtTempo(os.uptime()),
    inicio: new Date(Date.now() - os.uptime() * 1000).toLocaleString('pt-BR'),
    usuario,
    usuariosLogados: logados && logados.usuarios ? logados.usuarios : null,
    fusoHorario: fuso,
    localidade: Intl.DateTimeFormat().resolvedOptions().locale + (process.env.LANG ? ' · LANG=' + process.env.LANG : ''),
    shell,
    diretorios,
    ambienteDisponivel: SHOW_ENV,
  };
}

/* ====================================================================
 * 6. CPU
 * ==================================================================== */

async function coletarCpuEstatica() {
  const r = { fisicos: null };
  try {
    if (IS_WIN) {
      const l = lista(
        await psJson(
          'Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, MaxClockSpeed, L2CacheSize, L3CacheSize'
        )
      );
      if (l.length) {
        r.fisicos = l.reduce((s, p) => s + (p.NumberOfCores || 0), 0);
        r.soquetes = l.length;
        r.modeloCompleto = l[0].Name ? String(l[0].Name).trim() : null;
        r.clockMax = l[0].MaxClockSpeed ? l[0].MaxClockSpeed + ' MHz' : null;
        r.cacheL2 = l[0].L2CacheSize ? fmtBytes(l[0].L2CacheSize * 1024) : null;
        r.cacheL3 = l[0].L3CacheSize ? fmtBytes(l[0].L3CacheSize * 1024) : null;
      }
    } else if (IS_LINUX) {
      const t = lerArquivo('/proc/cpuinfo') || '';
      const pares = new Set();
      for (const bloco of t.split('\n\n')) {
        const p = bloco.match(/^physical id\s*:\s*(\d+)/m);
        const c = bloco.match(/^core id\s*:\s*(\d+)/m);
        if (p && c) pares.add(p[1] + ':' + c[1]);
      }
      r.fisicos = pares.size || null;
      const sock = new Set((t.match(/^physical id\s*:\s*\d+/gm) || []));
      r.soquetes = sock.size || null;
      const cache3 = (t.match(/^cache size\s*:\s*(.+)$/m) || [])[1];
      r.cacheL2 = cache3 ? cache3.trim() + ' (último nível)' : null;
    } else if (IS_MAC) {
      r.fisicos = parseInt(await rodar('sysctl', ['-n', 'hw.physicalcpu']), 10) || null;
    }
  } catch {
    /* ignora */
  }
  return r;
}

function montarCpu() {
  const cpus = os.cpus();
  const est = obter('cpuEstatica', 3600000, coletarCpuEstatica) || {};
  const t = somaTempos(cpus);
  const f = (ms) => fmtTempo((ms || 0) / 1000);
  const mhzMedia = cpus.length ? Math.round(cpus.reduce((s, c) => s + c.speed, 0) / cpus.length) : 0;

  return {
    modelo: est.modeloCompleto || (cpus[0] && cpus[0].model.trim()) || 'Desconhecido',
    arquitetura: os.arch(),
    endianness: os.endianness() === 'LE' ? 'Little Endian' : 'Big Endian',
    fisicos: est.fisicos || null,
    logicos: cpus.length,
    soquetes: est.soquetes || null,
    velocidadeMedia: mhzMedia ? mhzMedia + ' MHz' : '—',
    clockMax: est.clockMax || null,
    cacheL2: est.cacheL2 || null,
    cacheL3: est.cacheL3 || null,
    usoTotal: cpuUso.total,
    loadavg: os.loadavg().map((n) => n.toFixed(2)),
    loadavgDisponivel: !IS_WIN,
    tempos: { user: f(t.user), sys: f(t.sys), idle: f(t.idle), nice: f(t.nice), irq: f(t.irq) },
    nucleos: cpus.map((c, i) => ({
      id: i,
      mhz: c.speed + ' MHz',
      uso: cpuUso.nucleos[i] || 0,
      user: f(c.times.user),
      sys: f(c.times.sys),
      idle: f(c.times.idle),
      nice: f(c.times.nice),
      irq: f(c.times.irq),
    })),
  };
}

/* ====================================================================
 * 7. Memória
 * ==================================================================== */

function lerMeminfo() {
  const o = {};
  const t = lerArquivo('/proc/meminfo') || '';
  for (const l of t.split('\n')) {
    const m = l.match(/^(\w+)(?:\(\w+\))?:\s+(\d+)/);
    if (m) o[m[1]] = Number(m[2]) * 1024;
  }
  return o;
}

async function coletarMemWin() {
  return psJson(
    '$o=Get-CimInstance Win32_OperatingSystem; [pscustomobject]@{ vtotal=$o.TotalVirtualMemorySize; ' +
      'vlivre=$o.FreeVirtualMemory; pvirt=(Get-Process -Id ' + process.pid + ').VirtualMemorySize64 }'
  );
}

async function coletarVirtualMac() {
  const s = await rodar('ps', ['-o', 'vsz=', '-p', String(process.pid)]);
  return s ? { bytes: parseInt(s, 10) * 1024 } : null;
}

function virtualDoProcesso() {
  if (IS_LINUX) {
    const t = lerArquivo('/proc/self/status') || '';
    const m = t.match(/^VmSize:\s+(\d+)\s*kB/m);
    return m ? Number(m[1]) * 1024 : null;
  }
  if (IS_WIN) {
    const w = obter('memWin', 5000, coletarMemWin);
    return w && w.pvirt ? w.pvirt : null;
  }
  const v = obter('virtMac', 5000, coletarVirtualMac);
  return v && v.bytes ? v.bytes : null;
}

function montarMemoria() {
  const total = os.totalmem();
  let livre = os.freemem();
  let disponivel = livre;
  let cacheBuf = null;
  let swap = null;
  let virtualSistema = null;

  if (IS_LINUX) {
    try {
      const m = lerMeminfo();
      livre = m.MemFree !== undefined ? m.MemFree : livre;
      disponivel = m.MemAvailable !== undefined ? m.MemAvailable : disponivel;
      cacheBuf = (m.Cached || 0) + (m.Buffers || 0);
      if (m.SwapTotal) {
        swap = {
          total: fmtBytes(m.SwapTotal),
          usada: fmtBytes(m.SwapTotal - m.SwapFree),
          perc: Math.round(((m.SwapTotal - m.SwapFree) / m.SwapTotal) * 100),
        };
      }
    } catch {
      /* ignora */
    }
  } else if (IS_WIN) {
    const w = obter('memWin', 5000, coletarMemWin);
    if (w && w.vtotal) {
      const vt = w.vtotal * 1024;
      const vl = w.vlivre * 1024;
      virtualSistema = {
        total: fmtBytes(vt),
        usada: fmtBytes(vt - vl),
        livre: fmtBytes(vl),
        perc: Math.round(((vt - vl) / vt) * 100),
      };
    }
  }

  const usada = total - disponivel;
  const percUsada = Math.round((usada / total) * 100);
  const mem = process.memoryUsage();

  return {
    total: fmtBytes(total),
    usada: fmtBytes(usada),
    livre: fmtBytes(livre),
    disponivel: fmtBytes(disponivel),
    cacheBuffers: cacheBuf !== null ? fmtBytes(cacheBuf) : null,
    percUsada,
    percLivre: 100 - percUsada,
    swap,
    virtualSistema,
    processoRss: fmtBytes(mem.rss),
  };
}

/* ====================================================================
 * 8. Armazenamento
 * ==================================================================== */

const FS_IGNORADOS = new Set([
  'tmpfs', 'devtmpfs', 'squashfs', 'efivarfs', 'proc', 'sysfs', 'cgroup', 'cgroup2', 'devpts',
  'ramfs', 'fusectl', 'bpf', 'tracefs', 'debugfs', 'securityfs', 'pstore', 'configfs', 'mqueue',
  'hugetlbfs', 'autofs', 'binfmt_misc', 'rpc_pipefs', 'nsfs', 'fuse.gvfsd-fuse', 'fuse.portal',
]);
const MONTAGEM_IGNORADA = /^\/(proc|sys|dev|run|snap|etc\/(hosts|hostname|resolv\.conf))(\/|$)|^\/System\/Volumes\/(VM|Preboot|Update|xarts|iSCPreboot|Hardware)/;

function linhaParticao(dispositivo, fs_, montagem, total, usado, livre, extra = {}) {
  return {
    dispositivo,
    sistemaArquivos: fs_ || '—',
    montagem,
    total: fmtBytes(total),
    usado: fmtBytes(usado),
    livre: fmtBytes(livre),
    perc: total ? Math.round((usado / total) * 100) : 0,
    tipo: '—',
    ...extra,
  };
}

async function coletarDiscos() {
  const res = { particoes: [], fisicos: [] };

  if (IS_WIN) {
    const tipos = { 2: 'Removível / USB', 3: 'Disco local', 4: 'Unidade de rede', 5: 'CD/DVD', 6: 'Disco RAM' };
    const ld = lista(
      await psJson('Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID, VolumeName, FileSystem, DriveType, Size, FreeSpace')
    );
    for (const d of ld) {
      if (!d.Size) continue;
      res.particoes.push(
        linhaParticao(
          d.DeviceID + (d.VolumeName ? ' (' + d.VolumeName + ')' : ''),
          d.FileSystem,
          d.DeviceID + '\\',
          d.Size,
          d.Size - d.FreeSpace,
          d.FreeSpace,
          { tipo: tipos[d.DriveType] || 'Desconhecido' }
        )
      );
    }
    const fis = lista(
      await psJson(
        '$pd = Get-PhysicalDisk; Get-Disk | ForEach-Object { $x=$_; ' +
          '$p = $pd | Where-Object { [string]$_.DeviceId -eq [string]$x.Number }; ' +
          '[pscustomobject]@{ Nome=$x.FriendlyName; Tamanho=$x.Size; Particoes=$x.NumberOfPartitions; ' +
          'Estilo=[string]$x.PartitionStyle; Barramento=[string]$x.BusType; Midia=[string]$p.MediaType; Saude=[string]$x.HealthStatus } }'
      )
    );
    for (const d of fis) {
      res.fisicos.push({
        nome: d.Nome,
        tamanho: fmtBytes(d.Tamanho),
        tipo: d.Midia && d.Midia !== 'Unspecified' ? d.Midia : '—',
        conexao: d.Barramento || '—',
        particoes: d.Particoes,
        estilo: d.Estilo || '—',
        saude: d.Saude || '—',
        removivel: /usb/i.test(d.Barramento || ''),
      });
    }
  } else {
    // Mapeia partição -> disco físico (Linux, via lsblk)
    const mapaDisco = {};
    if (IS_LINUX) {
      const bruto = await rodar('lsblk', ['-J', '-b', '-o', 'NAME,TYPE,SIZE,ROTA,TRAN,RM,MODEL']);
      try {
        const j = JSON.parse(bruto);
        const verdadeiro = (v) => v === true || v === 1 || v === '1';
        const andar = (no, disco) => {
          if (no.type === 'disk') disco = no;
          mapaDisco[no.name] = disco;
          (no.children || []).forEach((c) => andar(c, disco));
        };
        (j.blockdevices || []).forEach((n) => andar(n, null));
        for (const d of j.blockdevices || []) {
          if (d.type !== 'disk') continue;
          const nvme = d.tran === 'nvme' || /^nvme/.test(d.name);
          res.fisicos.push({
            nome: '/dev/' + d.name,
            modelo: (d.model || '').trim() || '—',
            tamanho: fmtBytes(Number(d.size)),
            tipo: nvme ? 'SSD (NVMe)' : verdadeiro(d.rota) ? 'HDD' : 'SSD',
            conexao: d.tran || '—',
            particoes: (d.children || []).filter((c) => c.type === 'part').length,
            removivel: verdadeiro(d.rm) || d.tran === 'usb',
          });
        }
      } catch {
        /* lsblk indisponível */
      }
    }

    const df = await rodar('df', IS_LINUX ? ['-PT', '-B1'] : ['-Pk']);
    if (df) {
      const vistos = new Set();
      for (const l of df.split('\n').slice(1)) {
        let m;
        let disp, tipoFs, total, usado, livre, mont;
        if (IS_LINUX) {
          m = l.match(/^(\S+)\s+(\S+)\s+(\d+)\s+(\d+)\s+(\d+)\s+\d+%\s+(.*)$/);
          if (!m) continue;
          [, disp, tipoFs, total, usado, livre, mont] = m;
        } else {
          m = l.match(/^(\S+)\s+(\d+)\s+(\d+)\s+(\d+)\s+\d+%\s+(.*)$/);
          if (!m) continue;
          [, disp, total, usado, livre, mont] = m;
          total *= 1024;
          usado *= 1024;
          livre *= 1024;
          tipoFs = null;
        }
        total = Number(total);
        usado = Number(usado);
        livre = Number(livre);
        if (!total || FS_IGNORADOS.has(tipoFs) || MONTAGEM_IGNORADA.test(mont)) continue;
        if (disp.startsWith('/dev/')) {
          if (vistos.has(disp)) continue;
          vistos.add(disp);
        }
        const disco = mapaDisco[disp.replace('/dev/', '').replace('mapper/', '')];
        let tipo = '—';
        if (disco) {
          const nvme = disco.tran === 'nvme' || /^nvme/.test(disco.name);
          const rodando = disco.rota === true || disco.rota === 1 || disco.rota === '1';
          tipo = (nvme ? 'SSD (NVMe)' : rodando ? 'HDD' : 'SSD') + (disco.tran === 'usb' ? ' · USB' : '');
        } else if (/^(nfs|cifs|smb|fuse\.sshfs)/.test(tipoFs || '')) {
          tipo = 'Rede';
        }
        res.particoes.push(linhaParticao(disp, tipoFs, mont, total, usado, livre, { tipo }));
      }
    }
  }

  // Alternativa mínima caso nenhuma partição tenha sido detectada
  if (!res.particoes.length) {
    try {
      const raiz = IS_WIN ? 'C:\\' : '/';
      const st = fs.statfsSync(raiz);
      const total = st.blocks * st.bsize;
      const livre = st.bavail * st.bsize;
      res.particoes.push(linhaParticao(raiz, null, raiz, total, total - livre, livre));
    } catch {
      return null;
    }
  }
  return res;
}

/* ====================================================================
 * 9. Rede
 * ==================================================================== */

let redeAnterior = { ts: 0, bytes: {} };

function hexParaIp(h) {
  return [6, 4, 2, 0].map((i) => parseInt(h.substr(i, 2), 16)).join('.');
}

function lerDns() {
  const t = lerArquivo('/etc/resolv.conf') || '';
  return (t.match(/^nameserver\s+(\S+)/gm) || []).map((l) => l.split(/\s+/)[1]);
}

function redeLinux() {
  const out = { gateway: null, interfaceUsada: null, dns: lerDns(), interfaces: {} };
  const dev = (lerArquivo('/proc/net/dev') || '').split('\n').slice(2);
  for (const l of dev) {
    const m = l.match(/^\s*([^:]+):\s*(.*)$/);
    if (!m) continue;
    const v = m[2].trim().split(/\s+/).map(Number);
    const nome = m[1].trim();
    const velRaw = Number(lerArquivo('/sys/class/net/' + nome + '/speed'));
    out.interfaces[nome] = {
      rxBytes: v[0], rxPkts: v[1], rxErr: v[2], rxDrop: v[3],
      txBytes: v[8], txPkts: v[9], txErr: v[10], txDrop: v[11],
      status: lerArquivo('/sys/class/net/' + nome + '/operstate'),
      velocidade: velRaw > 0 ? velRaw + ' Mbps' : null,
    };
  }
  const rotas = (lerArquivo('/proc/net/route') || '').split('\n').slice(1);
  for (const l of rotas) {
    const c = l.split(/\s+/);
    if (c[1] === '00000000' && c[2] && c[2] !== '00000000') {
      out.gateway = hexParaIp(c[2]);
      out.interfaceUsada = c[0];
      break;
    }
  }
  return out;
}

async function redeMac() {
  const out = { gateway: null, interfaceUsada: null, dns: lerDns(), interfaces: {} };
  const rota = (await rodar('route', ['-n', 'get', 'default'])) || '';
  out.gateway = (rota.match(/gateway:\s*(\S+)/) || [])[1] || null;
  out.interfaceUsada = (rota.match(/interface:\s*(\S+)/) || [])[1] || null;
  const ns = (await rodar('netstat', ['-ibn'])) || '';
  for (const l of ns.split('\n').slice(1)) {
    const c = l.trim().split(/\s+/);
    if (c.length < 10 || !/^<Link#/.test(c[2])) continue;
    const n = c.length;
    out.interfaces[c[0]] = {
      rxPkts: Number(c[n - 7]), rxErr: Number(c[n - 6]), rxBytes: Number(c[n - 5]),
      txPkts: Number(c[n - 4]), txErr: Number(c[n - 3]), txBytes: Number(c[n - 2]),
      rxDrop: null, txDrop: null, status: null, velocidade: null,
    };
  }
  return out;
}

async function redeWindows() {
  const j = await psJson(
    '$a=@(Get-NetAdapter | Select-Object Name, Status, LinkSpeed); ' +
      '$s=@(Get-NetAdapterStatistics | Select-Object Name, ReceivedBytes, SentBytes, ReceivedUnicastPackets, ' +
      'SentUnicastPackets, ReceivedDiscardedPackets, ReceivedPacketErrors, OutboundDiscardedPackets, OutboundPacketErrors); ' +
      '$c=@(Get-NetIPConfiguration | ForEach-Object { [pscustomobject]@{ Name=$_.InterfaceAlias; ' +
      'Gateway=(@($_.IPv4DefaultGateway.NextHop) -join ","); Dns=(@($_.DNSServer.ServerAddresses) -join ",") } }); ' +
      '[pscustomobject]@{ adaptadores=$a; estatisticas=$s; config=$c }'
  );
  if (!j) return null;
  const out = { gateway: null, interfaceUsada: null, dns: [], interfaces: {} };
  for (const a of lista(j.adaptadores)) {
    out.interfaces[a.Name] = { status: a.Status, velocidade: a.LinkSpeed || null };
  }
  for (const s of lista(j.estatisticas)) {
    Object.assign(out.interfaces[s.Name] || (out.interfaces[s.Name] = {}), {
      rxBytes: s.ReceivedBytes, txBytes: s.SentBytes,
      rxPkts: s.ReceivedUnicastPackets, txPkts: s.SentUnicastPackets,
      rxErr: s.ReceivedPacketErrors, txErr: s.OutboundPacketErrors,
      rxDrop: s.ReceivedDiscardedPackets, txDrop: s.OutboundDiscardedPackets,
    });
  }
  const ativa = lista(j.config).find((c) => c.Gateway);
  if (ativa) {
    out.gateway = ativa.Gateway;
    out.interfaceUsada = ativa.Name;
    out.dns = (ativa.Dns || '').split(',').filter(Boolean);
  }
  return out;
}

async function coletarRedeStats() {
  const st = IS_LINUX ? redeLinux() : IS_MAC ? await redeMac() : await redeWindows();
  if (!st) return null;

  // Taxa de transferência (bytes/s) = diferença entre duas amostras
  const agora = Date.now();
  const dt = (agora - redeAnterior.ts) / 1000;
  const novo = {};
  for (const [nome, i] of Object.entries(st.interfaces)) {
    if (i.rxBytes === undefined) continue;
    novo[nome] = { rx: i.rxBytes, tx: i.txBytes };
    const ant = redeAnterior.bytes[nome];
    if (ant && dt > 0) {
      i.rxTaxa = Math.max(0, (i.rxBytes - ant.rx) / dt);
      i.txTaxa = Math.max(0, (i.txBytes - ant.tx) / dt);
    }
  }
  redeAnterior = { ts: agora, bytes: novo };
  return st;
}

async function coletarLatencia() {
  const args = IS_WIN
    ? ['-n', '4', '-w', '1000', PING_HOST]
    : IS_MAC
      ? ['-c', '4', '-W', '1000', PING_HOST]
      : ['-c', '4', '-W', '1', PING_HOST];
  const s = await rodar('ping', args, 12000);
  if (!s) return { indisponivel: true, motivo: 'ping indisponível ou sem resposta de ' + PING_HOST };
  let media = null;
  let perda = null;
  if (IS_WIN) {
    const ultima = s.trim().split(/\r?\n/).pop() || '';
    const m = ultima.match(/(\d+)\s*ms\s*$/i);
    media = m ? Number(m[1]) : null;
    const p = s.match(/\((\d+)%/);
    perda = p ? Number(p[1]) : null;
  } else {
    const m = s.match(/=\s*[\d.]+\/([\d.]+)\//);
    media = m ? Number(m[1]) : null;
    const p = s.match(/([\d.]+)%\s+packet loss/);
    perda = p ? Number(p[1]) : null;
  }
  return { host: PING_HOST, media: media !== null ? media + ' ms' : '—', perda: perda !== null ? perda + '%' : '—' };
}

function obterIpPublico() {
  return new Promise((resolve) => {
    const falha = (motivo) => resolve({ indisponivel: true, motivo });
    const req = https.get('https://api.ipify.org?format=text', { timeout: 4000 }, (res) => {
      let corpo = '';
      res.on('data', (d) => (corpo += d));
      res.on('end', () => {
        const ip = corpo.trim();
        /^[0-9a-fA-F:.]{3,45}$/.test(ip) ? resolve({ ip }) : falha('resposta inesperada');
      });
    });
    req.on('timeout', () => {
      req.destroy();
      falha('tempo esgotado');
    });
    req.on('error', () => falha('sem acesso à internet'));
  });
}

function montarRede() {
  const st = obter('redeStats', 2000, coletarRedeStats);
  if (st === null || st.indisponivel) return st;

  const lat = obter('latencia', 15000, coletarLatencia);
  const ip = PUBLIC_IP_ENABLED ? obter('ipPublico', 300000, obterIpPublico) : { desativado: true };
  const ifs = os.networkInterfaces();
  let rxTotal = 0;
  let txTotal = 0;

  const interfaces = Object.keys(ifs).map((nome) => {
    const lista_ = ifs[nome];
    const s = st.interfaces[nome] || {};
    const interno = lista_.some((i) => i.internal);
    if (!interno) {
      rxTotal += s.rxTaxa || 0;
      txTotal += s.txTaxa || 0;
    }
    return {
      nome,
      interno,
      mac: lista_[0].mac,
      status: s.status || null,
      velocidade: s.velocidade || null,
      enderecos: lista_.map((i) => ({
        familia: typeof i.family === 'number' ? 'IPv' + i.family : i.family,
        endereco: i.address,
        mascara: i.netmask,
      })),
      rx: s.rxBytes !== undefined ? { bytes: fmtBytes(s.rxBytes), pacotes: fmtNum(s.rxPkts), erros: fmtNum(s.rxErr), descartes: fmtNum(s.rxDrop) } : null,
      tx: s.txBytes !== undefined ? { bytes: fmtBytes(s.txBytes), pacotes: fmtNum(s.txPkts), erros: fmtNum(s.txErr), descartes: fmtNum(s.txDrop) } : null,
      rxTaxa: s.rxTaxa !== undefined ? fmtTaxa(s.rxTaxa) : null,
      txTaxa: s.txTaxa !== undefined ? fmtTaxa(s.txTaxa) : null,
    };
  });

  let usada = st.interfaceUsada;
  if (!usada) {
    const cand = interfaces.find((i) => !i.interno && i.enderecos.some((e) => e.familia === 'IPv4'));
    usada = cand ? cand.nome : null;
  }

  return {
    interfaceUsada: usada,
    gateway: st.gateway,
    dns: st.dns,
    ipPublico: ip,
    latencia: lat,
    rxTaxaTotal: fmtTaxa(rxTotal),
    txTaxaTotal: fmtTaxa(txTotal),
    interfaces,
  };
}

/* ====================================================================
 * 10. Processos do sistema (estilo Gerenciador de Tarefas)
 * ==================================================================== */

let procAnterior = { ts: 0, mapa: new Map() };
let mapaUsuarios = null;

function nomeUsuarioUid(uid) {
  if (!mapaUsuarios) {
    mapaUsuarios = {};
    for (const l of (lerArquivo('/etc/passwd') || '').split('\n')) {
      const p = l.split(':');
      if (p.length > 2) mapaUsuarios[p[2]] = p[0];
    }
  }
  return mapaUsuarios[uid] || String(uid);
}

function csvCampos(linha) {
  const out = [];
  const re = /"((?:[^"]|"")*)"/g;
  let m;
  while ((m = re.exec(linha))) out.push(m[1].replace(/""/g, '"'));
  return out;
}

async function coletarUsuariosWin() {
  const s = await rodar('tasklist', ['/v', '/fo', 'csv', '/nh'], 30000);
  if (!s) return null;
  const mapa = {};
  for (const l of s.split(/\r?\n/)) {
    const c = csvCampos(l);
    if (c.length >= 7) mapa[c[1]] = /^N\/?[AD]$/i.test(c[6]) ? null : c[6];
  }
  return { mapa };
}

async function coletarProcessos() {
  const nCores = os.cpus().length || 1;
  const agora = Date.now();
  const dt = (agora - procAnterior.ts) / 1000;
  const novo = new Map();
  const itens = [];
  let aproximado = false;

  if (IS_LINUX) {
    for (const pid of fs.readdirSync('/proc').filter((n) => /^\d+$/.test(n))) {
      try {
        const stat = fs.readFileSync('/proc/' + pid + '/stat', 'utf8');
        const fim = stat.lastIndexOf(')');
        const nome = stat.slice(stat.indexOf('(') + 1, fim);
        const r = stat.slice(fim + 2).split(' ');
        const ticks = Number(r[11]) + Number(r[12]); // utime + stime (100 Hz)
        const ant = procAnterior.mapa.get(pid);
        novo.set(pid, ticks);
        const pct = ant !== undefined && dt > 0 ? ((ticks - ant) / 100 / dt / nCores) * 100 : 0;
        itens.push({
          pid: Number(pid),
          nome,
          usuario: nomeUsuarioUid(fs.statSync('/proc/' + pid).uid),
          cpu: arred(Math.max(0, pct), 1),
          mem: Number(r[21]) * 4096,
        });
      } catch {
        /* processo encerrou durante a leitura */
      }
    }
  } else if (IS_WIN) {
    const l = lista(await psJson('Get-Process | Select-Object Id, ProcessName, CPU, WorkingSet64'));
    const usuarios = obter('usuariosWin', 30000, coletarUsuariosWin);
    const mapaU = usuarios && usuarios.mapa ? usuarios.mapa : {};
    for (const p of l) {
      const cpuSeg = typeof p.CPU === 'number' ? p.CPU : null;
      const ant = procAnterior.mapa.get(p.Id);
      if (cpuSeg !== null) novo.set(p.Id, cpuSeg);
      const pct = cpuSeg !== null && ant !== undefined && dt > 0 ? ((cpuSeg - ant) / dt / nCores) * 100 : 0;
      itens.push({
        pid: p.Id,
        nome: p.ProcessName,
        usuario: mapaU[String(p.Id)] || null,
        cpu: arred(Math.max(0, pct), 1),
        mem: p.WorkingSet64 || 0,
      });
    }
  } else {
    aproximado = true; // macOS: %CPU do ps é uma média, não instantânea
    const s = (await rodar('ps', ['-axo', 'pid=,user=,pcpu=,rss=,comm='])) || '';
    for (const l of s.split('\n')) {
      const m = l.match(/^\s*(\d+)\s+(\S+)\s+([\d.]+)\s+(\d+)\s+(.*)$/);
      if (m) {
        itens.push({
          pid: Number(m[1]),
          nome: m[5].split('/').pop(),
          usuario: m[2],
          cpu: arred(Number(m[3]) / nCores, 1),
          mem: Number(m[4]) * 1024,
        });
      }
    }
  }

  procAnterior = { ts: agora, mapa: novo };
  if (!itens.length) return null;
  itens.sort((a, b) => b.cpu - a.cpu || b.mem - a.mem);
  return {
    total: itens.length,
    aproximado,
    itens: itens.slice(0, 800).map((p) => ({ ...p, memBytes: p.mem, mem: fmtBytes(p.mem) })),
  };
}

/* ====================================================================
 * 11. Processo Node.js
 * ==================================================================== */

async function coletarNpm() {
  try {
    const { stdout } = await execP('npm --version', { timeout: 8000, windowsHide: true });
    return { versao: stdout.trim() };
  } catch {
    return null;
  }
}

function montarNode() {
  const mem = process.memoryUsage();
  const virt = virtualDoProcesso();
  const npm = obter('npm', 3600000, coletarNpm);
  const v = process.versions;
  return {
    pid: process.pid,
    ppid: process.ppid,
    titulo: process.title,
    execPath: process.execPath,
    cwd: process.cwd(),
    argv: process.argv.slice(1),
    uptime: fmtTempo(process.uptime()),
    cpuProc: arred(procCpuPct, 1),
    memoria: {
      rss: fmtBytes(mem.rss),
      heapTotal: fmtBytes(mem.heapTotal),
      heapUsado: fmtBytes(mem.heapUsed),
      external: fmtBytes(mem.external),
      arrayBuffers: fmtBytes(mem.arrayBuffers),
      virtual: virt ? fmtBytes(virt) : null,
    },
    handles: typeof process._getActiveHandles === 'function' ? process._getActiveHandles().length : null,
    requests: typeof process._getActiveRequests === 'function' ? process._getActiveRequests().length : null,
    versoes: {
      node: v.node,
      npm: npm && npm.versao ? npm.versao : null,
      v8: v.v8,
      openssl: v.openssl,
      libuv: v.uv,
      zlib: v.zlib,
      abi: v.modules,
    },
  };
}

/* ====================================================================
 * 12. GPU
 * ==================================================================== */

async function gpuAlternativa() {
  if (IS_WIN) {
    const l = lista(await psJson('Get-CimInstance Win32_VideoController | Select-Object Name, AdapterRAM, DriverVersion'));
    if (l.length) {
      return {
        fonte: 'WMI (Windows)',
        limitado: true,
        gpus: l.map((g) => ({
          nome: g.Name,
          vramTotal: g.AdapterRAM ? fmtBytes(g.AdapterRAM) : null,
          driver: g.DriverVersion || null,
        })),
      };
    }
  } else if (IS_LINUX) {
    const s = await rodar('lspci', []);
    if (s) {
      const l = s
        .split('\n')
        .filter((x) => /VGA|3D|Display/i.test(x))
        .map((x) => ({ nome: x.replace(/^\S+\s+[^:]+:\s*/, '') }));
      if (l.length) return { fonte: 'lspci', limitado: true, gpus: l };
    }
  } else if (IS_MAC) {
    const s = await rodar('system_profiler', ['SPDisplaysDataType', '-json'], 15000);
    try {
      const j = JSON.parse(s);
      const l = (j.SPDisplaysDataType || []).map((g) => ({
        nome: g.sppci_model,
        vramTotal: g.spdisplays_vram || g.spdisplays_vram_shared || null,
      }));
      if (l.length) return { fonte: 'system_profiler', limitado: true, gpus: l };
    } catch {
      /* ignora */
    }
  }
  return {
    indisponivel: true,
    motivo: 'nenhuma GPU detectada (sem nvidia-smi, lspci ou WMI disponíveis).',
  };
}

async function coletarGpu() {
  const nv = await rodar(
    'nvidia-smi',
    [
      '--query-gpu=name,memory.total,memory.used,driver_version,temperature.gpu,utilization.gpu,clocks.gr,power.draw,fan.speed',
      '--format=csv,noheader,nounits',
    ],
    5000
  );
  if (nv && nv.trim() && !/failed|not found/i.test(nv)) {
    const gpus = nv
      .trim()
      .split(/\r?\n/)
      .map((linha) => {
        const c = linha.split(',').map((s) => s.trim());
        const total = numOuNull(c[1]);
        const usada = numOuNull(c[2]);
        return {
          nome: c[0],
          vramTotal: total !== null ? fmtBytes(total * 1048576) : null,
          vramUsada: usada !== null ? fmtBytes(usada * 1048576) : null,
          vramPerc: total && usada !== null ? Math.round((usada / total) * 100) : null,
          driver: c[3],
          temperatura: numOuNull(c[4]),
          uso: numOuNull(c[5]),
          clock: numOuNull(c[6]),
          potencia: numOuNull(c[7]),
          ventoinha: numOuNull(c[8]),
        };
      });
    return { fonte: 'nvidia-smi', gpus };
  }
  return memo('gpuAlt', 3600000, gpuAlternativa);
}

/* ====================================================================
 * 13. Sensores de temperatura
 * ==================================================================== */

async function coletarSensores() {
  const itens = [];

  if (IS_LINUX) {
    try {
      for (const z of fs.readdirSync('/sys/class/thermal').filter((n) => n.startsWith('thermal_zone'))) {
        const t = Number(lerArquivo('/sys/class/thermal/' + z + '/temp'));
        const tipo = lerArquivo('/sys/class/thermal/' + z + '/type');
        if (Number.isFinite(t)) itens.push({ nome: 'Zona térmica: ' + (tipo || z), temp: t / 1000 });
      }
    } catch {
      /* ignora */
    }
    try {
      for (const h of fs.readdirSync('/sys/class/hwmon')) {
        const base = '/sys/class/hwmon/' + h;
        const nome = lerArquivo(base + '/name') || h;
        for (const f of fs.readdirSync(base).filter((x) => /^temp\d+_input$/.test(x))) {
          const v = Number(lerArquivo(base + '/' + f));
          const rot = lerArquivo(base + '/' + f.replace('_input', '_label'));
          if (Number.isFinite(v)) itens.push({ nome: nome + (rot ? ' — ' + rot : ''), temp: v / 1000 });
        }
      }
    } catch {
      /* ignora */
    }
  } else if (IS_WIN) {
    const j = await psJson(
      '$z=@(Get-CimInstance -Namespace root/wmi -ClassName MSAcpi_ThermalZoneTemperature | Select-Object InstanceName, CurrentTemperature); ' +
        '$d=@(Get-PhysicalDisk | ForEach-Object { $c = $_ | Get-StorageReliabilityCounter; ' +
        '[pscustomobject]@{ Nome=$_.FriendlyName; Temperatura=$c.Temperature } }); ' +
        '[pscustomobject]@{ zonas=$z; discos=$d }'
    );
    if (j) {
      for (const z of lista(j.zonas)) {
        if (z.CurrentTemperature) {
          itens.push({
            nome: 'Zona térmica ACPI (' + String(z.InstanceName || '').split('\\').pop() + ')',
            temp: z.CurrentTemperature / 10 - 273.15,
          });
        }
      }
      for (const d of lista(j.discos)) {
        if (typeof d.Temperatura === 'number' && d.Temperatura > 0) {
          itens.push({ nome: 'Disco: ' + d.Nome, temp: d.Temperatura });
        }
      }
    }
  }

  return itens.length
    ? { itens: itens.map((i) => ({ nome: i.nome, temp: arred(i.temp, 1) })) }
    : {
        indisponivel: true,
        motivo:
          'o sistema não expõe sensores a este processo. No Windows costuma ser necessário executar como administrador ou usar ferramentas como LibreHardwareMonitor; macOS não oferece API pública.',
      };
}

function montarSensores(gpu) {
  const base = obter('sensores', IS_WIN ? 10000 : 3000, coletarSensores);
  const extras = [];
  if (gpu && gpu.gpus) {
    for (const g of gpu.gpus) {
      if (g.temperatura !== null && g.temperatura !== undefined) extras.push({ nome: 'GPU: ' + g.nome, temp: g.temperatura });
    }
  }
  if (base === null) return extras.length ? { itens: extras } : null;
  if (base.indisponivel) return extras.length ? { itens: extras } : base;
  return { itens: [...extras, ...base.itens] };
}

/* ====================================================================
 * 14. Bateria
 * ==================================================================== */

function bateriaLinux() {
  const base = '/sys/class/power_supply';
  let nomes;
  try {
    nomes = fs.readdirSync(base);
  } catch {
    return { presente: false };
  }
  const bat = nomes.find((n) => lerArquivo(base + '/' + n + '/type') === 'Battery');
  if (!bat) return { presente: false };
  const b = base + '/' + bat;
  const pega = (...ns) => {
    for (const n of ns) {
      const v = lerArquivo(b + '/' + n);
      if (v !== null) return Number(v);
    }
    return null;
  };
  const status = lerArquivo(b + '/status');
  const agora = pega('energy_now', 'charge_now');
  const cheia = pega('energy_full', 'charge_full');
  const taxa = pega('power_now', 'current_now');
  let min = null;
  if (taxa > 0 && agora !== null) {
    if (status === 'Discharging') min = (agora / taxa) * 60;
    else if (status === 'Charging' && cheia !== null) min = ((cheia - agora) / taxa) * 60;
  }
  const rede = nomes.some(
    (n) => lerArquivo(base + '/' + n + '/type') === 'Mains' && lerArquivo(base + '/' + n + '/online') === '1'
  );
  return {
    presente: true,
    percentual: pega('capacity'),
    status,
    carregando: status === 'Charging',
    fonteConectada: rede,
    tempoRestante: fmtDuracaoMin(min),
  };
}

async function bateriaWindows() {
  const l = lista(await psJson('Get-CimInstance Win32_Battery | Select-Object EstimatedChargeRemaining, BatteryStatus, EstimatedRunTime'));
  if (!l.length) return { presente: false };
  const b = l[0];
  const carregando = [6, 7, 8, 9].includes(b.BatteryStatus);
  const descarregando = [1, 4, 5].includes(b.BatteryStatus);
  return {
    presente: true,
    percentual: b.EstimatedChargeRemaining,
    status: descarregando ? 'Descarregando' : carregando ? 'Carregando' : 'Conectada à energia',
    carregando,
    fonteConectada: !descarregando,
    tempoRestante: descarregando && b.EstimatedRunTime < 71582788 ? fmtDuracaoMin(b.EstimatedRunTime) : null,
  };
}

async function bateriaMac() {
  const s = await rodar('pmset', ['-g', 'batt']);
  if (!s || !/InternalBattery/.test(s)) return { presente: false };
  const m = s.match(/(\d+)%;\s*([^;]+);\s*(?:(\d+:\d+) remaining)?/);
  const [h, mi] = m && m[3] ? m[3].split(':').map(Number) : [null, null];
  return {
    presente: true,
    percentual: m ? Number(m[1]) : null,
    status: m ? m[2].trim() : null,
    carregando: m ? /^charging/i.test(m[2].trim()) : false,
    fonteConectada: /AC Power/.test(s),
    tempoRestante: h !== null ? fmtDuracaoMin(h * 60 + mi) : null,
  };
}

async function coletarBateria() {
  return IS_LINUX ? bateriaLinux() : IS_WIN ? bateriaWindows() : IS_MAC ? bateriaMac() : { presente: false };
}

/* ====================================================================
 * 15. Placa-mãe e BIOS
 * ==================================================================== */

async function coletarPlaca() {
  if (IS_LINUX) {
    const f = (n) => lerArquivo('/sys/class/dmi/id/' + n);
    const r = {
      fabricante: f('board_vendor'),
      modelo: f('board_name'),
      versao: f('board_version'),
      biosFabricante: f('bios_vendor'),
      biosVersao: f('bios_version'),
      biosData: f('bios_date'),
    };
    return Object.values(r).some(Boolean)
      ? r
      : { indisponivel: true, motivo: 'DMI indisponível (máquina virtual, contêiner ou sem permissão).' };
  }
  if (IS_WIN) {
    const j = await psJson(
      '$b=Get-CimInstance Win32_BaseBoard; $s=Get-CimInstance Win32_BIOS; ' +
        '[pscustomobject]@{ fabricante=$b.Manufacturer; modelo=$b.Product; versao=$b.Version; ' +
        'biosFabricante=$s.Manufacturer; biosVersao=$s.SMBIOSBIOSVersion; ' +
        'biosData=$s.ReleaseDate.ToString("dd/MM/yyyy") }'
    );
    return j || null;
  }
  if (IS_MAC) {
    const s = await rodar('system_profiler', ['SPHardwareDataType', '-json'], 15000);
    try {
      const h = JSON.parse(s).SPHardwareDataType[0];
      return {
        fabricante: 'Apple',
        modelo: h.machine_model || h.machine_name,
        biosFabricante: 'Apple',
        biosVersao: h.boot_rom_version || null,
      };
    } catch {
      return null;
    }
  }
  return null;
}

/* ====================================================================
 * 16. Montagem da resposta e rotas
 * ==================================================================== */

function coletarTudo() {
  const gpu = obter('gpu', 3000, coletarGpu);
  return {
    atualizadoEm: new Date().toLocaleString('pt-BR'),
    plataforma: process.platform,
    so: montarSO(),
    cpu: montarCpu(),
    memoria: montarMemoria(),
    disco: obter('discos', 15000, coletarDiscos),
    rede: montarRede(),
    processos: obter('processos', 3000, coletarProcessos),
    node: montarNode(),
    gpu,
    sensores: montarSensores(gpu),
    bateria: obter('bateria', 15000, coletarBateria),
    placa: obter('placa', 3600000, coletarPlaca),
  };
}

app.get('/api/sistema', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json(coletarTudo());
});

// Variáveis de ambiente (valores com nomes sensíveis ficam mascarados)
const SENSIVEL = /(key|token|secret|pass|pwd|auth|credential|cookie|session|private|api)/i;
app.get('/api/ambiente', (req, res) => {
  if (!SHOW_ENV) return res.status(403).json({ erro: 'Exibição desativada (SHOW_ENV=false).' });
  res.set('Cache-Control', 'no-store');
  const vars = Object.keys(process.env)
    .sort((a, b) => a.localeCompare(b))
    .map((nome) => ({
      nome,
      valor: SENSIVEL.test(nome) ? '••••••••' : process.env[nome],
      mascarada: SENSIVEL.test(nome),
    }));
  res.json(vars);
});

app.get('/', (req, res) => res.send(PAGINA));

/* ====================================================================
 * 17. Interface (HTML + CSS + JS do navegador)
 * ==================================================================== */

const PAGINA = String.raw`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Monitor de Sistemas Operacionais</title>
<style>
  :root{
    --bg:#eaf6ff; --card:#fff; --borda:#cde7fa; --prim:#4aa8e8; --prim-esc:#2b7fbf;
    --suave:#d9eeff; --texto:#1e3a52; --mudo:#5d7b94; --alerta:#f0b24a; --perigo:#e66a6a;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;color:var(--texto);min-height:100vh;
    background:linear-gradient(180deg,#d6eeff 0%,var(--bg) 240px);padding:24px}
  header,nav,main{max-width:1240px;margin:0 auto}
  header{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:16px}
  h1{font-size:1.6rem;color:var(--prim-esc)}
  .atual{font-size:.85rem;color:var(--mudo)}
  nav{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px}
  nav button{border:1px solid var(--borda);background:#fff;color:var(--prim-esc);padding:8px 14px;
    border-radius:999px;cursor:pointer;font-size:.9rem;transition:.15s}
  nav button:hover{background:var(--suave)}
  nav button.ativa{background:var(--prim);border-color:var(--prim);color:#fff}
  .grade{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:18px}
  .card{background:var(--card);border:1px solid var(--borda);border-radius:14px;padding:18px 20px;
    box-shadow:0 4px 14px rgba(74,168,232,.12);min-width:0}
  .card.largo{grid-column:1/-1}
  .card h2{font-size:1.05rem;color:var(--prim-esc);margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid var(--suave)}
  .linha{display:flex;justify-content:space-between;gap:14px;padding:5px 0;font-size:.92rem;border-bottom:1px dashed var(--suave)}
  .linha:last-child{border-bottom:none}
  .linha span:first-child{color:var(--mudo);white-space:nowrap}
  .linha span:last-child{font-weight:600;text-align:right;word-break:break-all}
  .barra{background:var(--suave);border-radius:999px;height:12px;overflow:hidden;margin:6px 0 4px}
  .barra>div{height:100%;border-radius:999px;background:var(--prim);transition:width .6s ease}
  .barra>div.alerta{background:var(--alerta)} .barra>div.perigo{background:var(--perigo)}
  .rotulo{font-size:.82rem;color:var(--mudo);display:flex;justify-content:space-between;gap:10px;margin-top:8px}
  .mini{display:flex;align-items:center;gap:8px;min-width:110px}
  .mini .barra{flex:1;margin:0;height:9px} .mini span{font-size:.78rem;width:34px;text-align:right}
  .tabela-scroll{overflow-x:auto}
  table{width:100%;border-collapse:collapse;font-size:.84rem}
  th{text-align:left;background:var(--suave);color:var(--prim-esc);padding:8px;white-space:nowrap}
  td{padding:7px 8px;border-bottom:1px solid var(--suave);vertical-align:top}
  .mudo{color:var(--mudo);font-size:.9rem}
  .nota{color:var(--mudo);font-size:.78rem;margin-top:10px}
  .tag{background:var(--suave);color:var(--prim-esc);padding:2px 8px;border-radius:999px;font-size:.74rem;white-space:nowrap}
  .controles{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px}
  .controles input,.controles select,.btn{border:1px solid var(--borda);border-radius:8px;padding:8px 10px;
    font-size:.9rem;color:var(--texto);background:#fff}
  .controles input{flex:1;min-width:220px}
  .btn{cursor:pointer;background:var(--prim);color:#fff;border-color:var(--prim)}
  code{background:var(--bg);padding:1px 6px;border-radius:5px;font-size:.82rem;word-break:break-all}
  .erro{color:var(--perigo);text-align:center;margin:20px}
</style>
</head>
<body>
<header>
  <h1>🖥️ Monitor de Sistemas Operacionais</h1>
  <div class="atual">Atualizado em: <span id="hora">—</span> · a cada 2 s</div>
</header>
<nav id="nav"></nav>
<main id="main"></main>

<script>
var ABAS=[['resumo','📈 Resumo'],['so','🖥️ Sistema'],['cpu','⚙️ CPU'],['ram','🧠 Memória'],['disco','💾 Armazenamento'],
  ['rede','🌐 Rede'],['proc','📊 Processos'],['node','🟢 Node.js'],['gpu','🎮 GPU'],['sensores','🌡️ Sensores'],['hw','🧩 Hardware']];
var aba=(location.hash||'#resumo').slice(1), dados=null, envHtml='', ultimo={};

/* ---------- helpers de HTML ---------- */
function esc(t){return String(t===null||t===undefined||t===''?'—':t).replace(/[&<>"']/g,function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function nd(v){return (v===null||v===undefined||v==='')?'—':v;}
function L(r,v){return '<div class="linha"><span>'+esc(r)+'</span><span>'+esc(v)+'</span></div>';}
function cls(p){return p>=90?'perigo':p>=70?'alerta':'';}
function pc(p){return Math.max(0,Math.min(100,Math.round(p||0)));}
function B(r,p,extra){p=pc(p);return '<div class="rotulo"><span>'+esc(r)+'</span><span>'+(extra?esc(extra)+' · ':'')+p+'%</span></div>'+
  '<div class="barra"><div class="'+cls(p)+'" style="width:'+p+'%"></div></div>';}
function mini(p){p=pc(p);return {h:'<div class="mini"><div class="barra"><div class="'+cls(p)+'" style="width:'+p+'%"></div></div><span>'+p+'%</span></div>'};}
function C(t,c,largo){return '<section class="card'+(largo?' largo':'')+'"><h2>'+t+'</h2>'+c+'</section>';}
function T(cols,rows,vazio){
  if(!rows.length)return '<p class="mudo">'+esc(vazio||'Sem dados.')+'</p>';
  var h='<div class="tabela-scroll"><table><thead><tr>'+cols.map(function(c){return '<th>'+esc(c)+'</th>';}).join('')+'</tr></thead><tbody>';
  rows.forEach(function(r){h+='<tr>'+r.map(function(c){return '<td>'+(c&&typeof c==='object'?c.h:esc(c))+'</td>';}).join('')+'</tr>';});
  return h+'</tbody></table></div>';
}
function E(x,titulo,largo,fn){
  if(x===null||x===undefined)return C(titulo,'<p class="mudo">Coletando dados…</p>',largo);
  if(x.indisponivel)return C(titulo,'<p class="mudo">Indisponível: '+esc(x.motivo)+'</p>',largo);
  return C(titulo,fn(x),largo);
}

/* ---------- abas ---------- */
function rResumo(d){
  var c=d.cpu,m=d.memoria,s=d.so,h='';
  h+=C('⚙️ CPU',B('Uso total',c.usoTotal)+L('Modelo',c.modelo)+L('Núcleos (físicos / lógicos)',nd(c.fisicos)+' / '+c.logicos)+
    L('Load average',c.loadavgDisponivel?c.loadavg.join(' / '):'não suportado no Windows'));
  h+=C('🧠 Memória RAM',B('Em uso',m.percUsada,m.usada+' de '+m.total)+L('Disponível',m.disponivel)+L('Node.js (RSS)',m.processoRss));
  h+=E(d.disco,'💾 Armazenamento',false,function(x){return x.particoes.slice(0,4).map(function(p){
    return B(p.montagem+' — '+p.usado+' de '+p.total,p.perc);}).join('');});
  h+=E(d.rede,'🌐 Rede',false,function(x){return L('Interface em uso',x.interfaceUsada)+L('Gateway',x.gateway)+
    L('↓ Download',x.rxTaxaTotal)+L('↑ Upload',x.txTaxaTotal)+
    L('Latência',x.latencia&&x.latencia.media)+L('Perda de pacotes',x.latencia&&x.latencia.perda);});
  h+=C('🖥️ Sistema',L('Sistema',s.nomeComercial||s.tipo)+L('Hostname',s.hostname)+L('Uptime',s.uptime)+L('Usuário',s.usuario)+L('Fuso horário',s.fusoHorario));
  h+=E(d.gpu,'🎮 GPU',false,function(x){return x.gpus.map(function(g){return L(g.nome,g.uso!=null?g.uso+'% de uso':nd(g.vramTotal));}).join('');});
  return h;
}

function rSO(d){
  var s=d.so,h='';
  h+=C('📋 Identificação',L('Sistema',s.nomeComercial||s.tipo)+L('Versão',s.versao)+L('Build',s.build)+L('Kernel / release',s.kernel)+
    L('Plataforma',s.plataforma)+L('Arquitetura',s.arquitetura)+L('Endianness',s.endianness)+L('Hostname',s.hostname)+
    L('Fabricante do equipamento',s.fabricante)+L('Modelo do equipamento',s.modelo));
  h+=C('👤 Sessão e região',L('Uptime',s.uptime)+L('Ligado desde',s.inicio)+L('Usuário atual',s.usuario)+
    L('Usuários logados',s.usuariosLogados?(s.usuariosLogados.length+(s.usuariosLogados.length?' ('+s.usuariosLogados.join(', ')+')':'')):null)+
    L('Fuso horário',s.fusoHorario)+L('Localidade',s.localidade)+L('Shell padrão',s.shell));
  h+=C('📁 Diretórios importantes',T(['Local','Caminho'],s.diretorios.map(function(x){return [x.rotulo,{h:'<code>'+esc(x.caminho)+'</code>'}];})),true);
  var corpo=envHtml||(s.ambienteDisponivel?'<p class="mudo">Valores de variáveis com nomes como KEY, TOKEN, SECRET ou PASSWORD ficam mascarados.</p><button class="btn" onclick="carregarEnv()">Carregar variáveis de ambiente</button>':'<p class="mudo">Exibição desativada no servidor (SHOW_ENV=false).</p>');
  h+=C('🔐 Variáveis de ambiente',corpo,true);
  return h;
}

function rCPU(d){
  var c=d.cpu,h='';
  h+=C('⚙️ Processador',L('Modelo completo',c.modelo)+L('Arquitetura',c.arquitetura)+L('Endianness',c.endianness)+
    L('Núcleos físicos',c.fisicos)+L('Núcleos lógicos',c.logicos)+L('Soquetes',c.soquetes)+
    L('Frequência média atual',c.velocidadeMedia)+L('Frequência máxima',c.clockMax)+L('Cache L2',c.cacheL2)+L('Cache L3',c.cacheL3)+
    L('Carga média (1 / 5 / 15 min)',c.loadavgDisponivel?c.loadavg.join(' / '):'não suportada no Windows'));
  h+=C('📈 Utilização',B('Uso total da CPU',c.usoTotal)+
    '<div class="nota">Tempo acumulado de todos os núcleos desde a inicialização:</div>'+
    L('user',c.tempos.user)+L('system',c.tempos.sys)+L('idle',c.tempos.idle)+L('nice',c.tempos.nice)+L('irq',c.tempos.irq));
  h+=C('🧮 Detalhe por núcleo',T(['Núcleo','Frequência','Uso','user','system','idle','nice','irq'],
    c.nucleos.map(function(n){return ['#'+n.id,n.mhz,mini(n.uso),n.user,n.sys,n.idle,n.nice,n.irq];})),true);
  h+='<p class="nota" style="grid-column:1/-1">No Windows, nice e irq podem aparecer zerados e a frequência por núcleo costuma ser a nominal.</p>';
  return h;
}

function rRAM(d){
  var m=d.memoria,h='';
  h+=C('🧠 Memória física',B('Em uso',m.percUsada,m.usada)+B('Livre / disponível',m.percLivre,m.disponivel)+
    L('Total',m.total)+L('Usada',m.usada)+L('Livre',m.livre)+L('Disponível',m.disponivel)+
    L('Cache + buffers',m.cacheBuffers)+L('Usada pelo Node.js (RSS)',m.processoRss));
  if(m.swap)h+=C('💽 Swap',B('Uso do swap',m.swap.perc,m.swap.usada+' de '+m.swap.total));
  if(m.virtualSistema){var v=m.virtualSistema;h+=C('🗂️ Memória virtual (commit)',B('Em uso',v.perc,v.usada+' de '+v.total)+L('Livre',v.livre));}
  return h;
}

function rDisco(d){
  var h='';
  h+=E(d.disco,'💾 Partições e volumes',true,function(x){
    return T(['Unidade / dispositivo','Montagem','Sist. de arquivos','Tipo','Total','Usado','Livre','Uso'],
      x.particoes.map(function(p){return [p.dispositivo,p.montagem,p.sistemaArquivos,{h:'<span class="tag">'+esc(p.tipo)+'</span>'},p.total,p.usado,p.livre,mini(p.perc)];}));});
  if(d.disco&&!d.disco.indisponivel){
    h+=C('🔌 Discos físicos',T(['Disco','Modelo','Capacidade','Mídia','Conexão','Partições','Removível / USB'],
      d.disco.fisicos.map(function(f){return [f.nome,f.modelo||f.estilo,f.tamanho,f.tipo,f.conexao,f.particoes,f.removivel?'Sim':'Não'];}),
      'Discos físicos não detectados (no Linux requer lsblk; no Windows, o módulo Storage).'),true);
    h+='<p class="nota" style="grid-column:1/-1">O tipo SSD/HDD é estimado pelo sistema (em máquinas virtuais pode aparecer incorreto).</p>';
  }
  return h;
}

function rRede(d){
  var h='';
  h+=E(d.rede,'🌐 Conexão',false,function(x){
    var ip=x.ipPublico;
    var ipTxt=ip&&ip.ip?ip.ip:(ip&&ip.desativado?'desativado (PUBLIC_IP=false)':(ip===null?'consultando…':'indisponível'));
    var lat=x.latencia;
    return L('Interface em uso',x.interfaceUsada)+L('Gateway padrão',x.gateway)+L('DNS',(x.dns||[]).join(', '))+L('IP público',ipTxt)+
      L('Servidor de teste',lat&&lat.host)+L('Latência média',lat&&lat.media)+L('Perda de pacotes',lat&&lat.perda)+
      L('↓ Download agora',x.rxTaxaTotal)+L('↑ Upload agora',x.txTaxaTotal);});
  if(d.rede&&!d.rede.indisponivel){
    h+=C('🔗 Interfaces',T(['Interface','Status','Velocidade','Endereços','MAC','↓ Recebido','↑ Enviado','Pacotes ↓/↑','Erros ↓/↑','Descartes ↓/↑','Taxa ↓/↑'],
      d.rede.interfaces.map(function(i){
        var ends=i.enderecos.map(function(e){return esc(e.familia)+': <code>'+esc(e.endereco)+'</code>';}).join('<br>');
        var par=function(k){return i.rx&&i.tx?i.rx[k]+' / '+i.tx[k]:'—';};
        return [{h:esc(i.nome)+(i.interno?' <span class="tag">interna</span>':'')},i.status,i.velocidade,{h:ends},i.mac,
          i.rx?i.rx.bytes:'—',i.tx?i.tx.bytes:'—',par('pacotes'),par('erros'),par('descartes'),
          i.rxTaxa?i.rxTaxa+' / '+i.txTaxa:'—'];})),true);
  }
  return h;
}

function rNode(d){
  var n=d.node,m=n.memoria,v=n.versoes,h='';
  h+=C('🟢 Processo',L('PID',n.pid)+L('PPID',n.ppid)+L('Título',n.titulo)+L('Uptime',n.uptime)+L('Diretório atual',n.cwd)+
    L('Executável do Node',n.execPath)+L('Argumentos',n.argv.join(' ')));
  h+=C('📊 Recursos',B('CPU do processo (de 1 núcleo)',n.cpuProc)+L('RSS',m.rss)+L('Heap total',m.heapTotal)+L('Heap usado',m.heapUsado)+
    L('External',m.external)+L('ArrayBuffers',m.arrayBuffers)+L('Memória virtual',m.virtual)+
    L('Handles ativos',n.handles)+L('Requests ativos',n.requests));
  h+=C('🧱 Versões',L('Node.js',v.node)+L('npm',v.npm)+L('V8',v.v8)+L('OpenSSL',v.openssl)+L('libuv',v.libuv)+L('zlib',v.zlib)+L('ABI dos módulos',v.abi));
  return h;
}

function rGPU(d){
  return E(d.gpu,'🎮 GPU',true,function(x){
    var h=x.gpus.map(function(g){
      var s=L('Modelo',g.nome)+L('Driver',g.driver)+L('VRAM total',g.vramTotal);
      if(g.uso!=null)s+=B('Uso da GPU',g.uso);
      if(g.vramPerc!=null)s+=B('VRAM',g.vramPerc,g.vramUsada+' de '+g.vramTotal);
      if(g.temperatura!=null)s+=L('Temperatura',g.temperatura+' °C');
      if(g.clock!=null)s+=L('Clock do núcleo',g.clock+' MHz');
      if(g.potencia!=null)s+=L('Consumo',g.potencia+' W');
      if(g.ventoinha!=null)s+=L('Ventoinha',g.ventoinha+'%');
      return '<div style="margin-bottom:14px">'+s+'</div>';}).join('');
    h+='<p class="nota">Fonte: '+esc(x.fonte)+(x.limitado?' — dados limitados (uso, temperatura e clock exigem nvidia-smi ou ferramentas do fabricante). No Windows, a VRAM via WMI é limitada a 4 GB.':'')+'</p>';
    return h;});
}

function rSensores(d){
  return E(d.sensores,'🌡️ Temperaturas',true,function(x){
    return T(['Sensor','Temperatura'],x.itens.map(function(i){
      var p=Math.min(100,Math.round(i.temp));var c=i.temp>=85?'perigo':i.temp>=70?'alerta':'';
      return [i.nome,{h:'<div class="mini"><div class="barra"><div class="'+c+'" style="width:'+p+'%"></div></div><span style="width:56px">'+i.temp+' °C</span></div>'}];}));});
}

function rHW(d){
  var h='',s=d.so;
  h+=E(d.placa,'🧩 Placa-mãe e BIOS',false,function(x){return L('Fabricante',x.fabricante)+L('Modelo',x.modelo)+L('Versão',x.versao)+
    L('Fabricante da BIOS',x.biosFabricante)+L('Versão da BIOS',x.biosVersao)+L('Data da BIOS',x.biosData);});
  h+=C('💻 Equipamento',L('Fabricante',s.fabricante)+L('Modelo',s.modelo));
  h+=E(d.bateria,'🔋 Bateria',false,function(b){
    if(!b.presente)return '<p class="mudo">Nenhuma bateria detectada (provavelmente um desktop).</p>';
    return B('Carga',b.percentual)+L('Estado',b.status)+L('Carregando',b.carregando?'Sim':'Não')+
      L('Fonte conectada',b.fonteConectada?'Sim':'Não')+L('Tempo restante',b.tempoRestante);});
  return h;
}

var RENDERS={resumo:rResumo,so:rSO,cpu:rCPU,ram:rRAM,disco:rDisco,rede:rRede,node:rNode,gpu:rGPU,sensores:rSensores,hw:rHW};

/* ---------- processos (controles fixos + tabela atualizada) ---------- */
function rProc(d){
  var cont=document.getElementById('aba-proc');
  if(!document.getElementById('proc-corpo')){
    cont.innerHTML='<div class="card largo"><h2>📊 Processos em execução</h2><div class="controles">'+
      '<input id="busca" placeholder="Filtrar por nome, PID ou usuário" oninput="renderAba()">'+
      '<select id="ordem" onchange="renderAba()"><option value="cpu">Ordenar: CPU</option><option value="mem">Ordenar: Memória</option>'+
      '<option value="nome">Ordenar: Nome</option><option value="pid">Ordenar: PID</option></select>'+
      '<select id="limite" onchange="renderAba()"><option>25</option><option selected>50</option><option>100</option><option>300</option></select>'+
      '</div><div id="proc-corpo"></div></div>';
  }
  var corpo=document.getElementById('proc-corpo'),p=d.processos;
  if(p===null){corpo.innerHTML='<p class="mudo">Coletando dados…</p>';return;}
  if(p.indisponivel){corpo.innerHTML='<p class="mudo">Indisponível: '+esc(p.motivo)+'</p>';return;}
  var q=document.getElementById('busca').value.toLowerCase(),o=document.getElementById('ordem').value,lim=Number(document.getElementById('limite').value);
  var l=p.itens.filter(function(i){return !q||String(i.nome).toLowerCase().indexOf(q)>=0||String(i.pid).indexOf(q)>=0||String(i.usuario||'').toLowerCase().indexOf(q)>=0;});
  l.sort(function(a,b){return o==='mem'?b.memBytes-a.memBytes:o==='nome'?String(a.nome).localeCompare(String(b.nome)):o==='pid'?a.pid-b.pid:(b.cpu-a.cpu||b.memBytes-a.memBytes);});
  var tot=0;p.itens.forEach(function(i){tot+=i.cpu;});
  corpo.innerHTML='<p class="mudo" style="margin-bottom:10px">'+p.total+' processos · exibindo '+Math.min(lim,l.length)+' de '+l.length+' · CPU total dos processos: '+Math.round(tot)+'%'+
    (p.aproximado?' · (CPU = média do ps no macOS)':'')+'</p>'+
    T(['PID','Nome','Usuário','CPU','Memória'],l.slice(0,lim).map(function(i){return [i.pid,i.nome,i.usuario,i.cpu.toFixed(1)+'%',i.mem];}),'Nenhum processo encontrado.');
}

/* ---------- ciclo principal ---------- */
function montarNav(){
  document.getElementById('nav').innerHTML=ABAS.map(function(a){
    return '<button class="'+(a[0]===aba?'ativa':'')+'" onclick="irPara(\''+a[0]+'\')">'+a[1]+'</button>';}).join('');
  document.getElementById('main').innerHTML=ABAS.map(function(a){
    return '<div id="aba-'+a[0]+'" class="'+(a[0]==='proc'?'':'grade')+'" style="display:'+(a[0]===aba?'':'none')+'"></div>';}).join('');
  ultimo={};
}
function irPara(a){aba=a;location.hash=a;montarNav();renderAba();}
function renderAba(){
  if(!dados)return;
  if(aba==='proc'){rProc(dados);return;}
  var fn=RENDERS[aba]||rResumo,html=fn(dados);
  if(html!==ultimo[aba]){document.getElementById('aba-'+aba).innerHTML=html;ultimo[aba]=html;}
}
function carregarEnv(){
  fetch('/api/ambiente').then(function(r){return r.json();}).then(function(v){
    if(v.erro){envHtml='<p class="mudo">'+esc(v.erro)+'</p>';}
    else envHtml=T(['Variável','Valor'],v.map(function(x){return [x.nome,{h:'<code>'+esc(x.valor)+'</code>'+(x.mascarada?' <span class="tag">oculto</span>':'')}];}));
    renderAba();
  });
}
function atualizar(){
  fetch('/api/sistema').then(function(r){return r.json();}).then(function(d){
    dados=d;document.getElementById('hora').textContent=d.atualizadoEm;renderAba();
  }).catch(function(){
    document.getElementById('main').insertAdjacentHTML('afterbegin','<p class="erro">Não foi possível obter os dados do servidor.</p>');
  }).then(function(){setTimeout(atualizar,2000);});
}
if(!ABAS.some(function(a){return a[0]===aba;}))aba='resumo';
montarNav();atualizar();
</script>
</body>
</html>`;

/* ====================================================================
 * 18. Inicialização
 * ==================================================================== */

coletarTudo(); // dispara as primeiras coletas em segundo plano

app.listen(PORT, HOST, () => {
  console.log('Monitor de Sistemas Operacionais v2 em http://' + (HOST === '0.0.0.0' ? 'localhost' : HOST) + ':' + PORT);
  if (HOST !== '127.0.0.1' && HOST !== 'localhost') {
    console.log('⚠️  Servidor exposto na rede: este painel mostra informações sensíveis da máquina.');
  }
});
