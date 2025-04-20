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
          top: '0.25rem',
          left: '0.25rem',
          fontFamily: "Montserrat",
          fontSize: '1.2rem',
          position: "relative",
            justifySelf: "left",
            paddingLeft: "1rem",
            paddingTop: "0.5rem",
        }}
      >
        {Number(label)}
      </div>
    )
}
  