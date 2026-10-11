// Dans android/app/src/main/java/com/titan/linuxdesktop/MainActivity.kt
package com.titan.linuxdesktop

import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: android.os.Bundle?) {
        registerPlugin(TitanTermuxPlugin::class.java)
        super.onCreate(savedInstanceState)
    }
}
