#!/data/data/com.termux/files/usr/bin/bash
# Lance le serveur X11, ouvre Termux X11 et démarre XFCE dans Debian.
DISPLAY_NUM=":1"
X_SOCKET="/data/data/com.termux/files/usr/tmp/.X11-unix/X1"

# Empêche Android de tuer Termux en arrière-plan
termux-wake-lock 2>/dev/null || true

# Redémarrage propre si une session précédente existe
pkill -f "termux-x11" 2>/dev/null || true
pkill -f "startxfce4" 2>/dev/null || true
sleep 1

termux-x11 "$DISPLAY_NUM" >/dev/null 2>&1 &

# Attendre que le serveur X soit prêt (max 15 s)
for i in $(seq 1 15); do
  [ -S "$X_SOCKET" ] && break
  sleep 1
done
if [ ! -S "$X_SOCKET" ]; then
  echo "Erreur : le serveur Termux X11 n'a pas démarré." >&2
  exit 1
fi

am start --user 0 -n com.termux.x11/.MainActivity >/dev/null 2>&1 || true
pulseaudio --start --exit-idle-time=-1 >/dev/null 2>&1 || true

proot-distro login debian --shared-tmp -- env DISPLAY="$DISPLAY_NUM" PULSE_SERVER=127.0.0.1 \
  dbus-launch --exit-with-session startxfce4 >/dev/null 2>&1 &
echo "Bureau démarré."
