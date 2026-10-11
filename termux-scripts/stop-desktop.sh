#!/data/data/com.termux/files/usr/bin/bash
# Arrête XFCE et le serveur X11.
pkill -f "startxfce4" 2>/dev/null || true
proot-distro login debian -- pkill -f xfce4-session 2>/dev/null || true
pkill -f "termux-x11" 2>/dev/null || true
echo "Bureau arrêté."
