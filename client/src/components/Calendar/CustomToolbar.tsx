import React from 'react'
import "./Calendar.css"
import { ToolbarProps } from 'react-big-calendar'
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import { APP_COLOR } from '../../consts';

export const CustomToolbar = ({ label, onNavigate }: ToolbarProps) => {

  const fontSize = 'clamp(0.6rem, 1vw + 1vh, 2.5rem)'

  return (
    <div
      style={{
        backgroundColor: APP_COLOR.ALICE_BLUE,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.4em 1em',
        fontWeight: 'bold',
        height: '8%',
        fontSize: fontSize,
        borderRadius: '35px 35px 0px 0px',
        color: 'black',
        fontFamily: '"Montserrat", sans-serif',
        textTransform: 'uppercase'
      }}
    >
      <button
        onClick={() => onNavigate('PREV')}
        className='chevron-button'>
        <ChevronLeft style={{ fontSize: fontSize }} />
      </button>

      <div>{label}</div>

      <button
        onClick={() => onNavigate('NEXT')}
        className='chevron-button'>
        <ChevronRight style={{ fontSize: fontSize }} />
      </button>
    </div>
  )
}
