import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGrid from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';

import React from "react";

export default function Calendar() {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGrid, listPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek' // user can switch between the two
      }}
      events={[
        {
          id: '1',
          title: 'Meeting A',
          start: '2024-12-11'
        },
        {
          id: '2',
          title: 'Meeting B',
          start: '2024-12-11'
        },
        {
          id: '3',
          title: 'Meeting C',
          start: '2024-12-11'
        }
      ]
      }
    />
  )
}