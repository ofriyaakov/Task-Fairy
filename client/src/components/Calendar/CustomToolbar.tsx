import React from 'react'
import { ToolbarProps } from 'react-big-calendar'
import { format } from 'date-fns'
import {ChevronLeft, ChevronRight} from "@mui/icons-material";

export const CustomToolbar = ({ label, onNavigate }: ToolbarProps) => {
  return (
    <div
      style={{
        backgroundColor: '#DDEEFB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        fontWeight: 'bold',
        fontSize: '28px',
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
