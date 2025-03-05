package com.buyro


import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen;
import android.graphics.Color // Import for Color
import androidx.core.content.ContextCompat // Import for ContextCompat
import android.os.Bundle;
class MainActivity : ReactActivity() {
   override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreen.show(this, R.id.lottie); // here
    SplashScreen.setAnimationFinished(true); // If you want the animation dialog to be forced to close when hide is called, use this code
    super.onCreate(savedInstanceState)
      
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "buyro"

  /**
   * Returns the instance of the [ReactActivityDelegate]. zWe use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
  
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
