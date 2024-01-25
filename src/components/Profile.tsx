import React from 'react'
import { useHistory } from 'react-router-dom'

import sprite from '../assets/img/svg/svg-sprite.svg'
import { useAppDispatch, useAppSelector } from '../store'
import { slice as authSlice } from '../store/auth'

interface Props {
  close: () => void
}

const Profile: React.FC<Props> = ({ close }) => {
  // --- EXTERNAL STATE ---//

  const history = useHistory()

  const dispatch = useAppDispatch()

  const outlet = useAppSelector((state) => state.outlet.data)

  const pushToken = useAppSelector((state) => state.auth.pushToken)

  // --- CALLBACKS --- //

  const logout = () => {
    if (pushToken) dispatch(authSlice.actions.removeTokenStart(pushToken))
    dispatch(authSlice.actions.reset())
    history.push('/login')
  }

  // --- RENDERING --- //

  return (
    <>
      <div className="overlay overlay_active" onClick={close}></div>
      <div className="popup-page__content">
        <div className="profile-page__body">
          <div className="profile__img">
            <img src={`${outlet?.image}`} width="100px" height="100px" alt="" />
          </div>
          <div className="corner__name">{outlet?.title ?? ''}</div>
          <div className="popup-market">
            <div className="market__label">Рынок:</div>
            <span className="profile__data">{outlet?.market_title ?? ''}</span>
          </div>
          <div className="market__label">Время работы:</div>
          <span className="profile__data">
            {outlet?.work_hours_start ?? ''} - {outlet?.work_hours_end ?? ''}
          </span>
          <div className="market__label">телефон поддержки:</div>
          <a className="profile__data" href={`tel:${outlet?.support_phone.replace(/\D/g, '')}`}>
            {outlet?.support_phone}
          </a>
        </div>

        <button className="popup-page__logout" onClick={logout}>
          <svg width="24" height="24">
            <use xlinkHref={sprite + '#icon-logout'} />
          </svg>
          Выйти
        </button>
      </div>
    </>
  )
}

export default Profile
