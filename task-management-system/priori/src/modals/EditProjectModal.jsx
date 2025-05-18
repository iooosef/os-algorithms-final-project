import React, { useEffect, useRef, useState } from 'react'
import { useConfig } from '../util/ConfigContext'
import { useUser } from '../auth/UserContext'

const EditProjectModal = (props) => {
  const { serverUrl, appName } = useConfig()
  const { user } = useUser()
  const modalRef = useRef()
const [project, setProject] = useState(null)
const [users, setUsers] = useState(null)

useEffect(() => {
  if (!serverUrl || !props.id) return;
  // const modal = new HSOverlay(modalRef.current)

  if (props.openState) {
    // modal.open()
    console.log("id", props)
    fetchProject(props.id)
    fetchAllUsers()
  } else {
    // modal.close()
  }
}, [props.openState, serverUrl])

useEffect(() => {
}, [serverUrl])

const fetchProject = (id) => {
    fetch(`${serverUrl}/project?id=${id}`, {
        credentials: 'include',
    })
    .then(res => res.json())
    .then(data => {
        console.log(data); // should log an array of ticket objects
        setProject(data);
    })
    .catch(err => console.error('Error fetching project:', err));
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
  setProject(null);
}

  return (
    <div id='mdl-backdrop' className={`w-full h-full fixed left-0 top-0 flex justify-center items-center bg-black/50 ${props.openState ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <section className='w-full rounded-lg bg-white flex flex-col' style={{maxWidth: '32rem'}}>
        <div id='mdl-header' className='p-4 text-2xl font-semibold'>
          Edit Ticket No. {props?.id}
        </div>
        <div id='mdl-body' className='w-full pb-4 px-4'>
          {
            project && (
              <form className='w-full flex flex-col gap-4'>

                <div>
                  <label className="label-text" htmlFor="name">Name</label>
                  <input type="text" className="input" id="name" value={project.name}
                    onChange={(e) => setProject({ ...project, name: e.target.value })} />
                </div>
                <div>
                  <label class="label-text" htmlFor="description"> Project Description </label>
                  <textarea class="textarea" id="description" value={project.description}
                    onChange={(e) => setProject({ ...project, description: e.target.value })}></textarea>
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

export default EditProjectModal
