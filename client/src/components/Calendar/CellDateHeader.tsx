import React from 'react'

type CellDateHeaderProps = {
    label: number
  }

export const CellDateHeader: React.FC<CellDateHeaderProps> = ({ label }) => {
    return (
      <div
        style={{
          fontWeight: 'bold',
          color: 'black',
          top: 4,
          left: 4,
          fontFamily: "Montserrat",
          fontSize: '18px',
          position: "relative",
            justifySelf: "left",
            paddingLeft: "1rem",
            paddingTop: "0.5rem",
        }}
      >
        {Number(label)} {/*removes leading zero just in case*/}
      </div>
    )
}
  