import React from 'react'

import imgLogoText from '../assets/img/logo-text.png'
import imgLogo from '../assets/img/logo1.png'
import { useAppDispatch, useAppSelector } from '../store'
import { Credentials, slice as authSlice } from '../store/auth'

const Login = () => {
  // --- EXTERNAL STATE --- //

  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  // ---
  const [{ login, password }, updateForm] = React.useReducer(
    (state: Credentials, changes: Partial<Credentials>) => ({
      ...state,
      ...changes,
    }),
    {
      login: '',
      password: '',
    },
  )

  const isReady =
    login.length > 0 && password.length > 0 && (auth.loginStatus === 'idle' || auth.loginStatus === 'error')

  const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateForm({ login: event.target.value })
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateForm({ password: event.target.value })
  }

  const handleSubmit = React.useCallback(() => {
    dispatch(authSlice.actions.loginStart({ login, password }))
  }, [login, password])

  return (
    <div className="page__container">
      <div className="page__content">
        <div className="main__container">
          <div className="main__content">
            <div className="main__logo">
              <img src={imgLogo} alt="logo" />
            </div>
            <div className="main__logo-text">
              <img src={imgLogoText} alt="logo-text" />
            </div>
            <div className="main__logo-text">АРМ корнера</div>
            <div className="input">
              <label className="input__label">
                <span className="input_error-text"></span>
              </label>
              <input
                className="input__input"
                type="text"
                value={login}
                name="login"
                placeholder="Логин"
                onChange={handleLoginChange}
              />
            </div>

            <div className="input">
              <label className="input__label">
                <span className="input_error-text"></span>
              </label>
              <input
                className="input__input"
                type="password"
                value={password}
                name="password"
                placeholder="Пароль"
                onChange={handlePasswordChange}
              />
            </div>
            <button className="main__button" type="button" onClick={handleSubmit} disabled={!isReady}>
              Войти
            </button>
            {auth.loginStatus === 'error' ? <p>{auth.errorMessage}</p> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
