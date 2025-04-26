import React from 'react'
import { APP_COLOR } from '../../consts'

type CellDateHeaderProps = {
    label: number
  }

export const CellDateHeader: React.FC<CellDateHeaderProps> = ({ label }) => {
    return (
      <div
        style={{
          fontWeight: 'bold',
          color: APP_COLOR.BLACK,
          fontFamily: '"Montserrat", sans-serif',
          fontSize: 'clamp(0.5rem, 0.7vh + 0.7vw, 2rem)',
          position: "relative",
          justifySelf: "left",
          paddingLeft: "0.4em",
          paddingTop: "0.25em",
        }}
      >
        {Number(label)}
      </div>
    )
}
  