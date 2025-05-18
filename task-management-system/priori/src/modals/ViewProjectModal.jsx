import React, { useEffect, useState } from 'react'
import { useConfig } from '../util/ConfigContext'

const ViewProjectModal = (props) => {
  const { serverUrl, appName } = useConfig()
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
  setProject(null);
}

  return (
    <div id='mdl-backdrop' className={`w-full h-full fixed left-0 top-0 flex justify-center items-center bg-black/50 ${props.openState ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <section className='w-full rounded-lg bg-white flex flex-col' style={{maxWidth: '32rem'}}>
        <div id='mdl-header' className='p-4 text-2xl font-semibold'>
          Ticket No. {props?.project_id} Details
        </div>
        <div id='mdl-body' className='w-full pb-4 px-4'>
          {
            project && (
              <form className='w-full flex flex-col gap-4'>

                <div>
                  <label className="label-text" htmlFor="name">Name</label>
                  <input type="text" className="input" id="name" value={project.name} readOnly/>
                </div>
                <div>
                  <label class="label-text" htmlFor="description"> Project Description </label>
                  <textarea class="textarea" id="description" value={project.description}  readOnly></textarea>
                </div>             
                <div className='flex justify-between w-full gap-4'>
                  <div className='w-full'>
                    <label className="label-text" htmlFor="createdBy"> Created By </label>
                    <input type="text" className="input" id="createdBy" value={users.find(user => user.id === project.created_by)?.username} readOnly/>
                  </div>
                </div>
                <div className='flex justify-between w-full gap-4'>
                  <div className='w-full'>
                    <label className="label-text" htmlFor="dueDate">Created at</label>
                    <input type="date" className="input" id="dueDate" value={new Date(project.created_at).toISOString().split("T")[0] ?? ''} readOnly />
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

export default ViewProjectModal
