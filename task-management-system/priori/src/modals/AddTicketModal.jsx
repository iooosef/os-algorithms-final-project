import React, { useEffect, useRef, useState } from 'react'
import { useConfig } from '../util/ConfigContext'
import { useUser } from '../auth/UserContext'

const AddTicketModal = (props) => {
  const { serverUrl, appName } = useConfig()
  const { user } = useUser()
  const modalRef = useRef()
const [tix, setTix] = useState(null)
const [users, setUsers] = useState(null)
const [projects, setProjects] = useState(null)

const theCustomStyleForButton = `
.join-item.btn {
  &.join-btn-info,
  &.join-btn-warning,
  &.join-btn-success,
  &.join-btn-error {
    --btn-shadow: 0 0 0 0 oklch(0% 0 0 / 0), 0 0 0 0 oklch(0% 0 0 / 0);
    isolation: isolate;

    &:is(input[type="checkbox"], input[type="radio"]):checked {
      color: var(--color-primary-content);
      outline-color: inherit;
      background: inherit;
    }
  }

  &.join-btn-info:is(:checked) {
    background: var(--color-info) !important;
    outline-color: var(--color-info) !important;
  }

  &.join-btn-warning:is(:checked) {
    background: var(--color-warning) !important;
    outline-color: var(--color-warning) !important;
  }

  &.join-btn-secondary:is(:checked) {
    background: var(--color-secondary) !important;
    outline-color: var(--color-secondary) !important;
  }

  &.join-btn-success:is(:checked) {
    background: var(--color-success) !important;
    outline-color: var(--color-success) !important;
  }
}`;

useEffect(() => {
  if (!serverUrl) return;

  if (props.openState) {
    console.log("id", props)
    fetchAllUsers()
    fetchAllProjects()
  }
}, [props.openState, serverUrl])

const fetchAllUsers = () => {
    fetch(`${serverUrl}/user`, {
        credentials: 'include',
    })
    .then(res => res.json())
    .then(data => {
        console.log(data); // should log an array of ticket objects
        setUsers(data);
    })
    .catch(err => console.error('Error fetching tickets:', err));
}

const fetchAllProjects = () => {
    fetch(`${serverUrl}/project`, {
        credentials: 'include',
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        setProjects(data);
    })
    .catch(err => console.error('Error fetching projects:', err));
}

const clickClose = () => {
  props.setOpenState(false);
  setTix(null);
}

  return (
    <div id='mdl-backdrop' className={`w-full h-full fixed left-0 top-0 flex justify-center items-center bg-black/50 ${props.openState ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <section className='w-full rounded-lg bg-white flex flex-col' style={{maxWidth: '32rem'}}>
        <div id='mdl-header' className='p-4 text-2xl font-semibold'>
          Add a New Ticket
        </div>
        <div id='mdl-body' className='w-full pb-4 px-4'>
          <form className='w-full flex flex-col gap-4'>

            <div>
              <label class="label-text" for="projectId">Project</label>
              <select className="select" id="projectId"
                onChange={(e) => setTix({ ...tix, project_id: e.target.value })} >
                  <option value="" disabled selected>Select a project</option>
                {projects?.map((project) => (
                  <option key={project.project_id} value={project.project_id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-text" htmlFor="title">Title</label>
              <input type="text" className="input" id="title"
                onChange={(e) => setTix({ ...tix, title: e.target.value })} />
            </div>
            <div>
              <label class="label-text" htmlFor="description"> Ticket Description </label>
              <textarea class="textarea" id="description" 
                onChange={(e) => setTix({ ...tix, description: e.target.value })}></textarea>
            </div>
            <div>
              <h6 class="text-base text-base-content mb-1">Priority</h6>
              <ul class="border-base-content/25 divide-base-content/25 rounded-box flex w-full flex-col border 
                *:w-full *:cursor-pointer max-sm:divide-y sm:flex-row sm:divide-x">
                <li>
                  <label class="flex items-center gap-2 p-3">
                    <input type="radio" name="priority" class="radio radio-error ms-3"
                     onChange={() => setTix({ ...tix, priority: 0 })} />
                    <span class="label-text text-base"> ASAP </span>
                  </label>
                </li>
                <li>
                  <label class="flex items-center gap-2 p-3">
                    <input type="radio" name="priority" class="radio radio-warning ms-3"
                     onChange={() => setTix({ ...tix, priority: 1 })} />
                    <span class="label-text text-base"> High </span>
                  </label>
                </li>
                <li>
                  <label class="flex items-center gap-2 p-3">
                    <input type="radio" name="priority" class="radio radio-primary ms-3"
                     onChange={() => setTix({ ...tix, priority: 2 })} />
                    <span class="label-text text-base"> Medium </span>
                  </label>
                </li>
                <li>
                  <label class="flex items-center gap-2 p-3">
                    <input type="radio" name="priority" class="radio radio-accent ms-3"
                     onChange={() => setTix({ ...tix, priority: 3 })} />
                    <span class="label-text text-base"> Low </span>
                  </label>
                </li>
              </ul>
            </div>
            <div>
              <style>
                {theCustomStyleForButton}
              </style>
            </div>
            <div>
              <label class="label-text" for="assignedTo">Assigned to</label>
              <select className="select" id="assignedTo"
                onChange={(e) => setTix({ ...tix, assignedTo: e.target.value })} >
                  <option value="" disabled selected>Select a user</option>
                {users?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-text" htmlFor="dueDate">Due Date</label>
              <input type="date" className="input" id="dueDate"
                onChange={(e) => setTix({ ...tix, due_date: e.target.value })} />
            </div>

          </form>
        </div>
        <div id='mdl-footer' className='w-full pb-4 px-4 flex justify-end gap-4'>
          <button className="btn btn-soft btn-secondary" onClick={() => clickClose()}>Close</button>
          <button className="btn btn-primary">Add Ticket</button>
        </div>
      </section>
    </div>
  )
}

export default AddTicketModal
