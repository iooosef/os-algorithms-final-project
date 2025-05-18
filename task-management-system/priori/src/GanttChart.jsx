import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useConfig } from './util/ConfigContext';
import { useUser } from './auth/UserContext'; 

import Gantt from 'frappe-gantt'
import Header from './Header';

export default function GanttChart() {
    const { serverUrl, appName } = useConfig();
    const { user } = useUser();
    const initialized = useRef(false);
    
    const ganttRef = useRef(null);
    const ganttInstance = useRef(null);
    const [ tickets, setTickets ] = useState();
    useEffect(() => {
        if (!serverUrl || !user) return;
        fetchTickets(user.id);        
    }, [serverUrl])

    const fetchTickets = (id) => {
        fetch(`${serverUrl}/ticket/assigned-to-all?id=${id}`, {
            credentials: 'include',
        })
        .then(res => res.json())
        .then(data => {
            console.log(data); // should log an array of ticket objects
            setTickets(data);
        })
        .catch(err => console.error('Error fetching tickets:', err));
    }

    useEffect(() => {
        if (!tickets) return;
        const tasks = tickets.map(ticket => ({
            id: String(ticket.ticket_id),
            name: ticket.title,
            start: ticket.created_at.split(' ')[0],
            end: ticket.due_date.split(' ')[0],
            progress:
                ticket.status === 'Completed' ? 100 :
                ticket.status === 'Queued' ? 0 : 50
        }));

        if (ganttRef.current) {
            ganttRef.current.innerHTML = '';  // Clear previous chart
            new Gantt(ganttRef.current, tasks, {
                readonly_dates: true,
                container_height: 600,
                view_mode: 'Day'
            });
        }
    }, [tickets]);


    return (
        <section className='w-screen h-screen p-4 relative'>
            <Header activeHref='/gantt' />
            <div className='absolute w-full left-0 z-0 p-4'>
                
                <div ref={ganttRef} id="gantt" className='z-0 w-full'/>
            </div>
        </section>
    )

}