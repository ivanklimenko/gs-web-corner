import React from 'react'
import { useHistory } from 'react-router-dom'

//import imgLogo from '../assets/img/logo1.png'
import sprite1 from '../assets/img/svg/svg-sprite.svg'
import sprite from '../assets/img/svg/svg-sprite-corner.svg'

//import { useAppSelector } from '../store'
import CompleteOrders from './CompleteOrders'
import Header from './Header'

const Category = () => {
  const history = useHistory()

  const goToCategories = () => {
    history.push('/menu')
  }

  // const products = useAppSelector((state) => state.order.products)

  return (
    <>
      <Header />
      <section className="categories">
        <div className="container">
          <div className="categorie__stop">
            <svg width="12" height="14" onClick={goToCategories}>
              <use xlinkHref={sprite1 + '#icon-back'} />
            </svg>
            <span className="categorie__name">Горячие блюда</span>
            <label className="switch">
              <input type="checkbox"></input>
              <span className="slider round"></span>
            </label>
          </div>

          <div className="categorie__items">
            {products.map((position) => (
              <div className="categorie__wrapper" key={position.id}>
                <div className="categorie__control">
                  <svg width="24" height="24">
                    <use href={sprite + '#minus'} />
                  </svg>
                </div>
                <div className="categorie__card simple-card">
                  <div className="card__container">
                    <span className="card__name">{position.title}</span>
                    <div className="card__information">
                      <span className="card__price">{position.price} ₽</span>
                      <label className="switch">
                        <input type="checkbox"></input>
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                  {position.options.map((option) => (
                    <div className="card__option-item" key={option.id}>
                      <span className="option__name">{option.title}</span>
                      <div className="card__information">
                        <span className="card__price">{option.price} ₽</span>
                        <label className="switch">
                          <input type="checkbox"></input>
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="categorie__wrapper">
              <div className="categorie__control">
                <svg
                  className="minus"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.2">
                    <path
                      d="M21 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V21C2 21.2652 2.10536 21.5196 2.29289 21.7071C2.48043 21.8946 2.73478 22 3 22H21C21.2652 22 21.5196 21.8946 21.7071 21.7071C21.8946 21.5196 22 21.2652 22 21V3C22 2.73478 21.8946 2.48043 21.7071 2.29289C21.5196 2.10536 21.2652 2 21 2ZM20 20H4V4H20V20Z"
                      fill="#19647E"
                    />
                    <rect x="17" y="11" width="2" height="10" rx="1" transform="rotate(90 17 11)" fill="#28AFB0" />
                  </g>
                </svg>
              </div>
              <div className="categorie__card simple-card categorie__card--inactive">
                <div className="card__container">
                  <span className="card__name">Сырная вафля с копченой курицей и томатами</span>
                  <div className="card__information">
                    <span className="card__price">2 169 ₽</span>
                    <label className="switch">
                      <input type="checkbox"></input>
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="categorie__wrapper">
              <div className="categorie__control">
                <svg
                  className="plus"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V21C2 21.2652 2.10536 21.5196 2.29289 21.7071C2.48043 21.8946 2.73478 22 3 22H21C21.2652 22 21.5196 21.8946 21.7071 21.7071C21.8946 21.5196 22 21.2652 22 21V3C22 2.73478 21.8946 2.48043 21.7071 2.29289C21.5196 2.10536 21.2652 2 21 2ZM20 20H4V4H20V20Z"
                    fill="#19647E"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 7C11.4477 7 11 7.44772 11 8V11L8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H11V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V13H16C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11L13 11V8C13 7.44772 12.5523 7 12 7Z"
                    fill="#28AFB0"
                  />
                </svg>
              </div>
              <div className="categorie__card options-card">
                <div className="card__container">
                  <span className="card__name">Сырная вафля с копченой курицей и томатами</span>
                  <div className="card__information">
                    <span className="card__price">2 169 ₽</span>
                    <label className="switch">
                      <input type="checkbox"></input>
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
                <div className="card__options">
                  <button className="options__title">дополнительные опции</button>
                </div>
              </div>
            </div>
            <div className="categorie__wrapper">
              <div className="categorie__control">
                <svg
                  className="minus"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.2">
                    <path
                      d="M21 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V21C2 21.2652 2.10536 21.5196 2.29289 21.7071C2.48043 21.8946 2.73478 22 3 22H21C21.2652 22 21.5196 21.8946 21.7071 21.7071C21.8946 21.5196 22 21.2652 22 21V3C22 2.73478 21.8946 2.48043 21.7071 2.29289C21.5196 2.10536 21.2652 2 21 2ZM20 20H4V4H20V20Z"
                      fill="#19647E"
                    />
                    <rect x="17" y="11" width="2" height="10" rx="1" transform="rotate(90 17 11)" fill="#28AFB0" />
                  </g>
                </svg>
              </div>
              <div className="categorie__card options-card options-card--expanded">
                <div className="card__container">
                  <span className="card__name">Сырная вафля с копченой курицей и томатами</span>
                  <div className="card__information">
                    <span className="card__price">2 169 ₽</span>
                    <label className="switch">
                      <input type="checkbox"></input>
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
                <div className="card__option-item">
                  <span className="option__name">Сыр</span>
                  <div className="card__information">
                    <span className="card__price">500 ₽</span>
                    <label className="switch">
                      <input type="checkbox"></input>
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
                <div className="card__option-item card__option-item--inactive">
                  <span className="option__name">вафля</span>
                  <div className="card__information">
                    <span className="card__price">200 ₽</span>
                    <label className="switch">
                      <input type="checkbox"></input>
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="complete">
        <CompleteOrders />
      </section>
    </>
  )
}

export default Category
