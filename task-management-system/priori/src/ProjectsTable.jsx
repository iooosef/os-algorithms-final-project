import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useConfig } from './util/ConfigContext';
import { useUser } from './auth/UserContext'; 

import { Icon } from '@iconify/react';
import Header from './Header';
import EditTaskModal from '../modals/EditTaskModal'
import ViewTaskModal from './ViewTaskModal'
import AddTaskModal from '../modals/AddTaskModal';
import PencilIco from './icons/PencilIco';
import BinIco from './icons/BinIco';
import DetailIco from './icons/DetailIco'
import AddIco from './icons/AddIco'

const ProjectsTable = () => {
    const { serverUrl, appName } = useConfig();
    const { user } = useUser();
    const initialized = useRef(false);

    const [ tickets, setTickets ] = useState();
    const [ currTicket, setCurrTicket ] = useState(0);
    const [ editModalOpen, setEditModalOpen ] = useState(false);
    const [ viewModalOpen, setViewModalOpen ] = useState(false);
    const [ addModalOpen, setAddModalOpen ] = useState(false);
    const [projects, setProjects] = useState(null)

    useEffect(() => {
        if (!serverUrl || !user) return;
        fetchTickets(user.id);
        fetchAllProjects();
        
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

    const fetchAllProjects = () => {
        fetch(`${serverUrl}/project`, {
            credentials: 'include',
        })
        .then(res => res.json())
        .then(data => {
            console.log("projects", data);
            setProjects(data);
        })
        .catch(err => console.error('Error fetching projects:', err));
    }

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
    }, []);

    return (
        <section className='w-screen h-screen p-4'>
            <Header activeHref='/projects' />
            
            <div class="border-base-content/25 w-full h-4/5 overflow-x-auto border">
                <div className='px-4 pt-4 pb-2 flex justify-between'>
                    <h1 className='text-2xl'>Projects Table</h1>
                    <button className='btn btn-primary'
                        onClick={() => {
                            setAddModalOpen(true);
                        }}>
                        Add a Project
                        <AddIco />
                    </button>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>PROJECT NAME</th>
                            <th>DESCRIPTION</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                    {projects && projects.map((project, index) => (
                        <tr key={project.ticket_id}>
                        <td>{project.project_id}</td>
                        <td>{project.name}</td>
                        <td>{`${project.description.slice(0, 30).trimEnd()}${project.description.length > 30 ? "..." : ""}`}</td>
                        <td className=' flex gap-4'>
                            <button className="btn btn-circle btn-text btn-sm text-accent" 
                                onClick={() => {
                                    setEditModalOpen(true);
                                    setCurrTicket(project.project_id);
                                }}>
                                <PencilIco />
                            </button>
                            <button className="btn btn-circle btn-text btn-sm text-info" aria-label="More"
                                onClick={() => {
                                    setViewModalOpen(true);
                                    setCurrTicket(project.project_id);
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
            <EditTaskModal openState={editModalOpen} id={currTicket} setOpenState={setEditModalOpen} />
            <ViewTaskModal openState={viewModalOpen} id={currTicket} setOpenState={setViewModalOpen} />
            <AddTaskModal openState={addModalOpen} id={currTicket} setOpenState={setAddModalOpen} />
        </section>
    )
}

export default ProjectsTable;