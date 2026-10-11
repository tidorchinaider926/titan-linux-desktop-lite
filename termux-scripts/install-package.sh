#!/data/data/com.termux/files/usr/bin/bash
# Installe un paquet Debian uniquement s'il figure dans la liste autorisée.
set -e
ALLOWED="firefox-esr pcmanfm nano git python3 nodejs"
PKG="$1"
case " $ALLOWED " in
  *" $PKG "*) ;;
  *) echo "Paquet non autorisé : $PKG" >&2; exit 1 ;;
esac
proot-distro login debian -- bash -c "DEBIAN_FRONTEND=noninteractive apt-get install -y $PKG"
echo "$PKG installé."
