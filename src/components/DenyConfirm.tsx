import React from 'react'

const DenyConfirm: React.FC = () => {
  return (
    <>
      <div className="overlay overlay_active" onClick={close}></div>
      <div className="deny__form">
        <div className="deny_text">Вы уверены, что вы хотите отклонить&nbsp;заказ?</div>
        <div className="deny_buttons">
          <button className="btn_deny">Да, отклонить</button>
          <button className="btn_accept">Нет</button>
        </div>
      </div>
    </>
  )
}

export default DenyConfirm
