import React from 'react'
import { ToolbarProps } from 'react-big-calendar'
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import { APP_COLOR } from '../../consts';

export const CustomToolbar = ({ label, onNavigate }: ToolbarProps) => {
  return (
    <div
      style={{
        backgroundColor: APP_COLOR.ALICE_BLUE,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.8rem 1.8rem',
        fontWeight: 'bold',
        fontSize: '1.8rem',
        borderRadius: '35px 35px 0px 0px',
        color: 'black',
        fontFamily: 'Montserrat',
        textTransform: 'uppercase'
      }}
    >
      <button
        onClick={() => onNavigate('PREV')}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <ChevronLeft />
      </button>

      <div>{label}</div>

      <button
        onClick={() => onNavigate('NEXT')}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <ChevronRight />
      </button>
    </div>
  )
}
