import React from 'react'
import { useHistory } from 'react-router-dom'

import sprite from '../assets/img/svg/svg-sprite-corner.svg'
import { useAppSelector } from '../store'

import Profile from './Profile'

const Header: React.FC = () => {
  // --- EXTERNAL STATE --- //

  const history = useHistory()

  history.location.pathname

  const outlet = useAppSelector((state) => state.outlet.data)

  const orders = useAppSelector((state) => state.orders.active.list)
  const readyOrders = useAppSelector((state) => state.orders.ready.list)

  // --- LOCAL STATE ---//

  const [showProfile, setShowProfile] = React.useState(false)

  // --- CONSTAINTS --- //

  const pathName = history.location.pathname

  // --- CALLBACKS --- //

  const openProfile = () => {
    setShowProfile(true)
  }

  const closeProfile = () => {
    setShowProfile(false)
  }

  const goToCategories = () => {
    history.push('/menu')
  }

  const goToOrders = () => {
    history.push('/orders')
  }

  const goToHistory = () => {
    history.push('/history')
  }

  // --- RENDERING --- //

  return (
    <>
      <header className="header">
        {showProfile ? <Profile close={closeProfile} /> : null}
        <div className="container">
          <div className="header-container">
            <div className="corner__title">
              <span className="corner-name">{outlet?.title ?? ''}</span>
              <div className="icon-login" onClick={openProfile}>
                <svg width="24" height="24">
                  <use href={sprite + '#icon-login'} />
                </svg>
              </div>
            </div>
          </div>
          <nav className="orders__tabs">
            <button className={`tabs-button ${pathName === '/orders' ? 'button--active' : ''}`} onClick={goToOrders}>
              <div className="tabs-button__info">
                <span className="tabs-button__text">Все заказы</span>
                <span className="tabs-button__counter">{orders.length + readyOrders.length}</span>
              </div>
            </button>
            <div className="buttons__wrapper">
              <button
                className={`tabs-button ${pathName === '/history' ? 'button--active' : ''}`}
                onClick={goToHistory}
              >
                <span className="tabs-button__text">История</span>
              </button>
              <button
                className={`tabs-button ${pathName === '/menu' ? 'button--active' : ''}`}
                onClick={goToCategories}
              >
                <span className="tabs-button__text">Стоп-лист</span>
              </button>
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}

export default Header
