package com.titan.linuxdesktop

import android.content.Intent
import android.content.pm.PackageManager
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "TitanTermux")
class TitanTermuxPlugin : Plugin() {

    private val termuxPkg = "com.termux"
    private val x11Pkg = "com.termux.x11"
    private val homeDir = "/data/data/com.termux/files/home"

    @PluginMethod
    fun status(call: PluginCall) {
        val ret = JSObject()
        ret.put("termux", isInstalled(termuxPkg))
        ret.put("termuxX11", isInstalled(x11Pkg))
        call.resolve(ret)
    }

    @PluginMethod
    fun runCommand(call: PluginCall) {
        val path = call.getString("path")
        if (path.isNullOrEmpty()) {
            call.reject("Chemin manquant")
            return
        }
        val args = toStringArray(call.getArray("args"))
        try {
            val intent = Intent("com.termux.RUN_COMMAND")
                .setClassName(termuxPkg, "com.termux.app.RunCommandService")
                .putExtra("com.termux.RUN_COMMAND_PATH", path)
                .putExtra("com.termux.RUN_COMMAND_ARGUMENTS", args)
                .putExtra("com.termux.RUN_COMMAND_WORKDIR", homeDir)
                .putExtra("com.termux.RUN_COMMAND_BACKGROUND", true)
                .putExtra("com.termux.RUN_COMMAND_SESSION_ACTION", "0")
            context.startService(intent)
            call.resolve()
        } catch (e: SecurityException) {
            call.reject("Permission Termux refusée. Accorde 'Exécuter des commandes Termux' à l'application.")
        } catch (e: Exception) {
            call.reject("Impossible de contacter Termux : ${e.message}")
        }
    }

    @PluginMethod
    fun openPackage(call: PluginCall) {
        val pkg = call.getString("pkg") ?: ""
        val launch = context.packageManager.getLaunchIntentForPackage(pkg)
        if (launch != null) {
            launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(launch)
            call.resolve()
        } else {
            val store = Intent(Intent.ACTION_VIEW,
                android.net.Uri.parse("https://f-droid.org/packages/$pkg/"))
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(store)
            call.resolve()
        }
    }

    private fun isInstalled(pkg: String): Boolean = try {
        context.packageManager.getPackageInfo(pkg, 0)
        true
    } catch (e: PackageManager.NameNotFoundException) {
        false
    }

    private fun toStringArray(arr: JSArray?): Array<String> {
        if (arr == null) return emptyArray()
        return Array(arr.length()) { i -> arr.getString(i) }
    }
}
