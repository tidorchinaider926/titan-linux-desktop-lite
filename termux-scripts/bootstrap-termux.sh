#!/data/data/com.termux/files/usr/bin/bash
# Prépare Termux : dépôts X11, proot-distro, autorisation des intents externes.
set -e
pkg update -y
pkg upgrade -y
pkg install -y proot-distro x11-repo
pkg install -y termux-x11-nightly
mkdir -p "$HOME/.termux" "$HOME/titan"
grep -q 'allow-external-apps' "$HOME/.termux/termux.properties" 2>/dev/null \
  || echo 'allow-external-apps = true' >> "$HOME/.termux/termux.properties"
termux-reload-settings || true
termux-setup-storage || true
echo "Bootstrap terminé."
