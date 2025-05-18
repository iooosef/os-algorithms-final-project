import React, { useEffect, useRef, useState } from 'react'
import { useConfig } from '../src/util/ConfigContext'
import { useUser } from '../src/auth/UserContext'

const EditTaskModal = (props) => {
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
          Edit Ticket No. {props?.id}
        </div>
        <div id='mdl-body' className='w-full pb-4 px-4'>
          {
            tix && (
              <form className='w-full flex flex-col gap-4'>

                <div>
                  <label className="label-text" htmlFor="title">Title</label>
                  <input type="text" className="input" id="title" value={tix.title}
                    onChange={(e) => setTix({ ...tix, title: e.target.value })} />
                </div>
                <div>
                  <label class="label-text" htmlFor="description"> Ticket Description </label>
                  <textarea class="textarea" id="description" value={tix.description}
                    onChange={(e) => setTix({ ...tix, description: e.target.value })}></textarea>
                </div>
                <div className='mb-4'>
                  <style>
                    {theCustomStyleForButton}
                  </style>
                  <h6 class="text-base text-base-content mb-1">Status</h6>
                  <div class="join drop-shadow">
                    <input class="join-item btn btn-soft join-btn-info" type="radio" name="radio-15" aria-label="Queued"
                       checked={tix.status === 'Queued'} onChange={() => setTix({ ...tix, status: 'Queued' })} />
                    <input class="join-item btn btn-soft join-btn-warning" type="radio" name="radio-15" aria-label="In Progress"
                       checked={tix.status === 'In Progress'} onChange={() => setTix({ ...tix, status: 'In Progress' })} />
                    <input class="join-item btn btn-soft join-btn-secondary" type="radio" name="radio-15" aria-label="Paused"
                       checked={tix.status === 'Paused'} onChange={() => setTix({ ...tix, status: 'Paused' })} />
                    <input class="join-item btn btn-soft join-btn-success" type="radio" name="radio-15" aria-label="Completed"
                       checked={tix.status === 'Completed'} onChange={() => setTix({ ...tix, status: 'Completed' })} />
                  </div>
                </div>

              </form>
            )
          }
        </div>
        <div id='mdl-footer' className='w-full pb-4 px-4 flex justify-end gap-4'>
          <button className="btn btn-soft btn-secondary" onClick={() => clickClose()}>Close</button>
          <button className="btn btn-primary">Save changes</button>
        </div>
      </section>
    </div>
  )
}

export default EditTaskModal
