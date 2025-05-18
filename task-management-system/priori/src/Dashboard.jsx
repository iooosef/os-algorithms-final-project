import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useConfig } from './util/ConfigContext';
import { useUser } from './auth/UserContext'; 

import { Icon } from '@iconify/react';
import Header from './Header';
import EditTicketModal from './modals/EditTicketModal'
import ViewTicketModal from './modals/ViewTicketModal'
import AddTicketModal from './modals/AddTicketModal';
import PencilIco from './icons/PencilIco';
import BinIco from './icons/BinIco';
import DetailIco from './icons/DetailIco'
import AddIco from './icons/AddIco'

const Dashboard = () => {
    const { serverUrl, appName } = useConfig();
    const { user } = useUser();
    const initialized = useRef(false);

    const [ tickets, setTickets ] = useState();
    const [ currTicket, setCurrTicket ] = useState(0);
    const [ editModalOpen, setEditModalOpen ] = useState(false);
    const [ viewModalOpen, setViewModalOpen ] = useState(false);
    const [ addModalOpen, setAddModalOpen ] = useState(false);

    useEffect(() => {
        if (!serverUrl || !user) return;
        fetchTickets(user.id);
        
    }, [serverUrl, editModalOpen, viewModalOpen])

    const fetchTickets = (id) => {
        fetch(`${serverUrl}/ticket/assigned-to?id=${id}`, {
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
        if (initialized.current) return;
        initialized.current = true;
    }, []);

    return (
        <section className='w-screen h-screen p-4'>
            <Header activeHref='/dashboard' />
            
            <div class="border-base-content/25 w-full h-4/5 overflow-x-auto border">
                <div className='px-4 pt-4 pb-2 flex justify-between'>
                    <h1 className='text-2xl'>Tickets Table</h1>
                    <button className='btn btn-primary'
                        onClick={() => {
                            setAddModalOpen(true);
                        }}>
                        Add a Ticket
                        <AddIco />
                    </button>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>TITLE</th>
                            <th>PRIORITY</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                    {tickets && tickets.map((ticket, index) => (
                        <tr key={ticket.ticket_id}>
                        <td>{index + 1}</td>
                        <td>{ticket.title}</td>
                        <td>
                            <span className={`badge text-xs ${
                                ticket.priority == 0 ? 'badge-error' : ticket.priority == 1 ? 'badge-warning'
                                    : ticket.priority == 2 ? 'badge-primary'
                                    : 'badge-accent'
                            }`}>
                                {ticket.priority == 0 ? 'ASAP' : ticket.priority == 1 ? 'High'
                                    : ticket.priority == 2 ? 'Medium'
                                    : 'Low'
                                }
                            </span>
                        </td>
                        <td>
                            <span className={`badge text-xs ${
                                ticket.status == 'Completed' ? 'badge-success' 
                                    : ticket.status == 'In Progress' ? 'badge-warning'
                                    : ticket.status == 'Paused' ? 'badge-secondary'
                                    : 'badge-info'
                            }`}>
                                {ticket.status}
                            </span>
                        </td>
                        <td className=' flex gap-4'>
                            <button className="btn btn-circle btn-text btn-sm text-accent" 
                                onClick={() => {
                                    setEditModalOpen(true);
                                    setCurrTicket(ticket.ticket_id);
                                }}>
                                <PencilIco />
                            </button>
                            <button className="btn btn-circle btn-text btn-sm text-info" aria-label="More"
                                onClick={() => {
                                    setViewModalOpen(true);
                                    setCurrTicket(ticket.ticket_id);
                                }}>
                                <DetailIco />
                            </button>
                            <button className="btn btn-circle btn-text btn-sm text-error" aria-label="Delete">
                                <BinIco />
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <EditTicketModal openState={editModalOpen} id={currTicket} setOpenState={setEditModalOpen} />
            <ViewTicketModal openState={viewModalOpen} id={currTicket} setOpenState={setViewModalOpen} />
            <AddTicketModal openState={addModalOpen} id={currTicket} setOpenState={setAddModalOpen} />
        </section>
    )
}

export default Dashboard;