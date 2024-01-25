import React from 'react'

const Loader: React.FC = () => {
  return (
    <>
      <div className="loader">
        <div className="fond">
          <div className="container_general">
            <div className="container_mixt">
              <div className="ballcolor ball_1">&nbsp;</div>
            </div>
            <div className="container_mixt">
              <div className="ballcolor ball_2">&nbsp;</div>
            </div>
            <div className="container_mixt">
              <div className="ballcolor ball_3">&nbsp;</div>
            </div>
            <div className="container_mixt">
              <div className="ballcolor ball_4">&nbsp;</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Loader
