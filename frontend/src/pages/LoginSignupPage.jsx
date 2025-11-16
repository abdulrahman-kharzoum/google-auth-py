import React from 'react'
import GoogleAuthButton from '../components/GoogleAuthButton'

function LoginSignupPage({ onLoginSuccess, onLoginError }) {
  return (
    <div className="button-group">
      <GoogleAuthButton
        type="login"
        onLoginSuccess={onLoginSuccess}
        onLoginError={onLoginError}
      />
      <GoogleAuthButton
        type="signup"
        onLoginSuccess={onLoginSuccess}
        onLoginError={onLoginError}
      />
    </div>
  )
}

export default LoginSignupPage
