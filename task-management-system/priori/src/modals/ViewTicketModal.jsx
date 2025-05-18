import React, { useEffect, useRef, useState } from 'react'
import { useConfig } from '../util/ConfigContext'
import { useUser } from '../auth/UserContext'

const ViewTicketModal = (props) => {
  const { serverUrl, appName } = useConfig()
  const { user } = useUser()
  const modalRef = useRef()
const [tix, setTix] = useState(null)
const [users, setUsers] = useState(null)

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
  if (!serverUrl || !props.id) return;
  // const modal = new HSOverlay(modalRef.current)

  if (props.openState) {
    // modal.open()
    console.log("id", props)
    fetchTix(props.id)
    fetchAllUsers()
  } else {
    // modal.close()
  }
}, [props.openState, serverUrl])

useEffect(() => {
}, [serverUrl])

const fetchTix = (id) => {
    fetch(`${serverUrl}/ticket?id=${id}`, {
        credentials: 'include',
    })
    .then(res => res.json())
    .then(data => {
        console.log(data); // should log an array of ticket objects
        setTix(data);
    })
    .catch(err => console.error('Error fetching tickets:', err));
}

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

const clickClose = () => {
  props.setOpenState(false);
  setTix(null);
}

  return (
    <div id='mdl-backdrop' className={`w-full h-full fixed left-0 top-0 flex justify-center items-center bg-black/50 ${props.openState ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <section className='w-full rounded-lg bg-white flex flex-col' style={{maxWidth: '32rem'}}>
        <div id='mdl-header' className='p-4 text-2xl font-semibold'>
          Ticket No. {props?.id} Details
        </div>
        <div id='mdl-body' className='w-full pb-4 px-4'>
          {
            tix && (
              <form className='w-full flex flex-col gap-4'>

                <div>
                  <label className="label-text" htmlFor="title">Title</label>
                  <input type="text" className="input" id="title" value={tix.title} readOnly/>
                </div>
                <div>
                  <label class="label-text" htmlFor="description"> Ticket Description </label>
                  <textarea class="textarea" id="description" value={tix.description}  readOnly></textarea>
                </div>
                <div className='flex gap-4 justify-between'>
                  <div className='w-full'>
                    <label class="label-text"> Priority </label>
                    <button type="button" class={`btn w-full ${                        
                        tix.priority == 0 ? 'btn-error'
                          : tix.priority == 1 ? 'btn-warning'
                          : tix.priority == 2 ? 'btn-primary' : 'btn-accent'
                      }`}> 
                      {
                        tix.priority == 0 ? 'ASAP'
                          : tix.priority == 1 ? 'High'
                          : tix.priority == 2 ? 'Medium' : 'Low'
                      }
                    </button>
                  </div>                  
                  <div className='w-full'>
                    <label class="label-text"> Status </label>
                    <button type="button" class={`btn w-full ${                        
                        tix.status == 'Queued' ? 'btn-info'
                          : tix.status == 'In Progress' ? 'btn-warning'
                          : tix.status == 'Paused' ? 'btn-secondary' : 'btn-success'
                      }`}> 
                      { tix.status }
                    </button>
                  </div>
                </div>                
                <div className='flex justify-between w-full gap-4'>
                  <div className='w-full'>
                    <label className="label-text" htmlFor="title"> Assigned to </label>
                    <input type="text" className="input" id="title" value={users.find(user => user.id === tix.assigned_to)?.username} readOnly/>
                  </div>
                  <div className='w-full'>
                    <label className="label-text" htmlFor="title"> Created by </label>
                    <input type="text" className="input" id="title" value={users.find(user => user.id === tix.created_by)?.username} readOnly/>
                  </div>
                </div>
                <div className='flex justify-between w-full gap-4'>
                  <div className='w-full'>
                    <label className="label-text" htmlFor="dueDate">Created at</label>
                    <input type="date" className="input" id="dueDate" value={new Date(tix.created_at).toISOString().split("T")[0] ?? ''} readOnly />
                  </div>
                  <div className='w-full'>
                    <label className="label-text" htmlFor="dueDate">Due Date</label>
                    <input type="date" className="input" id="dueDate" value={tix.due_date} readOnly />
                  </div>
                </div>

              </form>
            )
          }
        </div>
        <div id='mdl-footer' className='w-full pb-4 px-4 flex justify-end gap-4'>
          <button className="btn btn-soft btn-secondary" onClick={() => clickClose()}>Close</button>
        </div>
      </section>
    </div>
  )
}

export default ViewTicketModal
