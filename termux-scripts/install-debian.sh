#!/data/data/com.termux/files/usr/bin/bash
# Installe Debian via proot-distro puis XFCE et les outils de base.
set -e
PREFIX_DIR=/data/data/com.termux/files/usr
mkdir -p "$HOME/titan"
# Détection fiable : le rootfs est-il déjà installé ?
if [ ! -d "$PREFIX_DIR/var/lib/proot-distro/installed-rootfs/debian" ]; then
  proot-distro install debian
fi
proot-distro login debian -- bash -c '
  set -e
  export DEBIAN_FRONTEND=noninteractive
  apt-get update
  apt-get upgrade -y
  apt-get install -y xfce4 xfce4-terminal dbus-x11 pulseaudio \
    firefox-esr pcmanfm nano git python3 nodejs
  apt-get clean
'
echo "Debian et XFCE installés."
