import { registerPlugin } from '@capacitor/core';

export interface TermuxStatus {
  termux: boolean;
  termuxX11: boolean;
}

export interface TitanTermuxPlugin {
  status(): Promise<TermuxStatus>;
  runCommand(options: { path: string; args: string[] }): Promise<void>;
  openPackage(options: { pkg: string }): Promise<void>;
}

export const TitanTermux = registerPlugin<TitanTermuxPlugin>('TitanTermux');

export const TERMUX_HOME = '/data/data/com.termux/files/home';
const BASH = '/data/data/com.termux/files/usr/bin/bash';
export const TITAN_DIR = `${TERMUX_HOME}/titan`;

/** Lance un script du dossier ~/titan dans Termux (exécution en arrière-plan). */
export const runScript = (script: string, args: string[] = []) =>
  TitanTermux.runCommand({ path: BASH, args: [`${TITAN_DIR}/${script}`, ...args] });

/** Lance une commande shell libre dans Termux. */
export const runShell = (command: string) =>
  TitanTermux.runCommand({ path: BASH, args: ['-lc', command] });

/** Paquets autorisés : le nom affiché -> le nom apt Debian. */
export const PACKAGES: Record<string, string> = {
  'Firefox ESR': 'firefox-esr',
  PCManFM: 'pcmanfm',
  Nano: 'nano',
  Git: 'git',
  Python: 'python3',
  'Node.js': 'nodejs',
};
