package com.handyapp

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.os.Bundle;

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "HandyApp"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState);
    requestPermissions();
  }

  private fun requestPermissions() {
      val permissions = arrayOf(
          Manifest.permission.CAMERA,
          Manifest.permission.READ_EXTERNAL_STORAGE,
          Manifest.permission.WRITE_EXTERNAL_STORAGE
      )

      val requestCode = 1

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
          if (!hasPermissions(permissions)) {
              ActivityCompat.requestPermissions(this, permissions, requestCode)
          }
      }
  }

  private fun hasPermissions(permissions: Array<String>): Boolean {
      return permissions.all {
          ContextCompat.checkSelfPermission(this, it) == PackageManager.PERMISSION_GRANTED
      }
  }

}
