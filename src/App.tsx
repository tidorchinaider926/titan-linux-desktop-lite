import { useEffect, useState } from 'react';
import { PACKAGES, TitanTermux, runScript, runShell, type TermuxStatus } from './termux';

const FAVORITES_KEY = 'titan.favorites';

export default function App() {
  const [status, setStatus] = useState<TermuxStatus | null>(null);
  const [message, setMessage] = useState('');
  const [command, setCommand] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]');
    } catch {
      return [];
    }
  });

  const refresh = async () => {
    try {
      setStatus(await TitanTermux.status());
    } catch {
      setMessage('Impossible de vérifier les applications installées.');
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const act = async (label: string, fn: () => Promise<void>) => {
    setMessage(`${label}…`);
    try {
      await fn();
      setMessage(`${label} : commande envoyée à Termux.`);
    } catch (e) {
      setMessage(`${label} échoué : ${(e as Error).message}`);
    }
  };

  const saveFavorite = () => {
    const cmd = command.trim();
    if (cmd && !favorites.includes(cmd)) setFavorites([...favorites, cmd]);
  };

  const ready = status?.termux && status?.termuxX11;

  return (
    <main className="app">
      <header>
        <h1>Titan Linux Desktop Lite</h1>
        <p className="muted">Bureau Debian + XFCE via Termux X11</p>
      </header>

      <section className="card">
        <h2>Prérequis</h2>
        <Row label="Termux" ok={status?.termux} onOpen={() => TitanTermux.openPackage({ pkg: 'com.termux' })} />
        <Row label="Termux X11" ok={status?.termuxX11} onOpen={() => TitanTermux.openPackage({ pkg: 'com.termux.x11' })} />
        {status && !ready && (
          <p className="warn">
            Installe les applications manquantes depuis F-Droid (recommandé) ou GitHub, puis ajoute
            <code> allow-external-apps = true</code> dans ~/.termux/termux.properties.
          </p>
        )}
        <button className="big" onClick={refresh}>Vérifier à nouveau</button>
      </section>

      <section className="card">
        <h2>Installation</h2>
        <button className="big primary" disabled={!ready}
          onClick={() => act('Installation de Debian', () => runScript('install-debian.sh'))}>
          Installer Debian + XFCE
        </button>
      </section>

      <section className="card">
        <h2>Bureau</h2>
        <div className="grid3">
          <button className="big primary" disabled={!ready}
            onClick={() => act('Démarrage', () => runScript('start-desktop.sh'))}>Démarrer</button>
          <button className="big" disabled={!ready}
            onClick={() => act('Arrêt', () => runScript('stop-desktop.sh'))}>Arrêter</button>
          <button className="big" disabled={!ready}
            onClick={() => act('Redémarrage', () => runScript('restart-desktop.sh'))}>Redémarrer</button>
        </div>
      </section>

      <section className="card">
        <h2>Paquets</h2>
        <div className="grid2">
          {Object.entries(PACKAGES).map(([label, apt]) => (
            <button key={apt} className="big" disabled={!ready}
              onClick={() => act(`Installation de ${label}`, () => runScript('install-package.sh', [apt]))}>
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Commandes</h2>
        <input className="field" value={command} placeholder="ex. ls -la ~/"
          onChange={(e) => setCommand(e.target.value)} />
        <div className="grid2">
          <button className="big primary" disabled={!status?.termux || !command.trim()}
            onClick={() => act('Commande', () => runShell(command.trim()))}>Exécuter</button>
          <button className="big" disabled={!command.trim()} onClick={saveFavorite}>Ajouter aux favoris</button>
        </div>
        {favorites.length > 0 && (
          <ul className="favorites">
            {favorites.map((f) => (
              <li key={f}>
                <button className="chip" disabled={!status?.termux}
                  onClick={() => act('Commande favorite', () => runShell(f))}>{f}</button>
                <button className="chip danger" onClick={() => setFavorites(favorites.filter((x) => x !== f))}>✕</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {message && <p className="status" role="status">{message}</p>}
    </main>
  );
}

function Row({ label, ok, onOpen }: { label: string; ok?: boolean; onOpen: () => void }) {
  return (
    <div className="row">
      <span>{label}</span>
      {ok === undefined ? <span className="muted">…</span>
        : ok ? <span className="ok">Installé</span>
        : <button className="chip" onClick={onOpen}>Ouvrir / installer</button>}
    </div>
  );
}
