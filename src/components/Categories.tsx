import React from 'react'

import sprite1 from '../assets/img/svg/svg-sprite.svg'
import sprite from '../assets/img/svg/svg-sprite-corner.svg'
import { useAppDispatch, useAppSelector } from '../store'
import { slice as menuSlice } from '../store/menu'
import { slice as outletSlice } from '../store/outlet'
import { slice as positionSlice } from '../store/positions'
import { translateEnabledToStatus, unitsTranslate } from '../utils'

import Header from './Header'

const Menu = () => {
  // --- EXTERNAL

  const dispatch = useAppDispatch()

  const menu = useAppSelector((state) => state.menu)

  const positions = useAppSelector((state) => state.positions)

  const activePositions = positions.list.filter((position) => position.is_active === true)

  const outlet = useAppSelector((state) => state.outlet)
  // --- LOCAL STATE--- //

  const [categoryId, setCategoryId] = React.useState<number | null>(null)

  // --- CONSTANTS --- //

  const filteredPositions = categoryId ? activePositions.filter((position) => position.category_id === categoryId) : []

  const selectedCategory = menu.list.find((category) => category.id === categoryId)

  // const enabledOutlet = translateEnabledToStatus(outlet.data?.is_available_for_orders)
  // console.log('1. enabledOutlet >>>', enabledOutlet)

  const enabledOutlet = outlet?.data?.is_available_for_orders ?? false

  // --- CALLBACKS --- //

  const updateCategoryId = (categoryId: number | null) => () => {
    setCategoryId(categoryId)
  }

  const togglePosition = (positionId: number) => () => {
    dispatch(positionSlice.actions.togglePosition(positionId))
  }

  const toggleOutletEnable = () => {
    dispatch(outletSlice.actions.toggleEnabledOutletStart())
  }

  const togglePositionEnable = (positionId: number) => () => {
    console.log(' 1  меняем >>>', positionId)
    dispatch(positionSlice.actions.toggleEnabledPositionStart(positionId))
  }

  const toggleOptionEnable =
    ({ positionId, optionId }: { positionId: number; optionId: number }) =>
    () => {
      console.log(' 1  меняем >>>', optionId, positionId)
      dispatch(positionSlice.actions.toggleEnabledOptionStart({ positionId, optionId }))
    }

  // --- EFFECTS ---  outlet.data?.is_available_for_orders ?? false//

  React.useEffect(() => {
    dispatch(menuSlice.actions.loadStart())
    dispatch(positionSlice.actions.loadStart())
  }, [])

  return (
    <>
      <Header />
      {categoryId === null ? (
        <section className="categories">
          <div className="container">
            <div className="categories__stop">
              <span className="stop__text">{translateEnabledToStatus(outlet.data?.is_available_for_orders)}</span>
              <label className="switch">
                <input type="checkbox" checked={enabledOutlet} onChange={toggleOutletEnable}></input>
                <span className="slider round"></span>
              </label>
            </div>
            <div className="categories__list">
              {menu.list.map((category) => (
                <div className="categories__card" key={category.id}>
                  <div className="categories__content">
                    <div className="categories__burger">
                      <svg width="24" height="24">
                        <use href={sprite + '#burger'} />
                      </svg>
                    </div>
                    <div className="categories__image">
                      <img src={`https://hungry.ninja${category.image}`} className="img" />
                    </div>
                    <div className="categories__name">{category.title}</div>
                  </div>
                  <div className="categories__nav" onClick={updateCategoryId(category.id)}>
                    <svg width="8" height="14">
                      <use href={sprite + '#arrow-right'} />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="categories">
          <div className="container">
            <div className="categorie__items">
              <div className="categorie__stop">
                <div className="categorie__back">
                  <svg width="12" height="14" onClick={updateCategoryId(null)}>
                    <use xlinkHref={sprite1 + '#icon-back'} />
                  </svg>
                </div>
                <div className="categorie__title">
                  <span className="categorie__name">{selectedCategory?.title}</span>
                </div>
              </div>
              {filteredPositions.map((position) => (
                <div className="categorie__wrapper" key={position.id}>
                  <div className="categorie__control" onClick={togglePosition(position.id)}>
                    <svg width="24" height="24">
                      <use
                        href={`${sprite}#${position.isOpened || position.options.length === 0 ? 'minus' : 'plus'}`}
                      />
                    </svg>
                  </div>
                  <div className="categorie__card simple-card">
                    <div className="card__container">
                      <div className="card__product">
                        <img className="card__img" src={`${position?.image}`} width="30px" height="30px" />
                        <span className="card__name">{position.title}</span>
                      </div>
                      <div className="card__information">
                        <div className="card__info">
                          <span className="card__price">{position.price} ₽</span>
                          <span className="card__weight">
                            {Number(position.measure)} {unitsTranslate(position.units)}
                          </span>
                        </div>

                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={position.is_available_for_orders}
                            onChange={togglePositionEnable(position.id)}
                          ></input>
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                    {position.isOpened
                      ? position.options.map((option) => (
                          <div className="card__option-item" key={option.id}>
                            <span className="option__name">
                              {option.group_title} - {option.title}
                            </span>
                            <div className="card__information">
                              <span className="card__price">{option.price} ₽</span>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={option.is_available_for_orders}
                                  onChange={toggleOptionEnable({ positionId: position.id, optionId: option.id })}
                                ></input>
                                <span className="slider round"></span>
                              </label>
                            </div>
                          </div>
                        ))
                      : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default Menu
