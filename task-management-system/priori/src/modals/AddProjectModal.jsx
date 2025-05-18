import React, { useEffect, useRef, useState } from 'react'
import { useConfig } from '../util/ConfigContext'
import { useUser } from '../auth/UserContext'

const AddProjectModal = (props) => {
  const { serverUrl, appName } = useConfig()
const [project, setProject] = useState(null)

useEffect(() => {
  if (!serverUrl) return;

  if (props.openState) {
    console.log("id", props)
  }
}, [props.openState, serverUrl])

const clickClose = () => {
  props.setOpenState(false);
  setProject(null);
}

const addProject = () => {
  if (!serverUrl || !project) return;

  const payload = {
    name: project.name,
    description: project.description
  };

  fetch(`${serverUrl}/project`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data?.project_id) {
      alert('Project successfully created!');
      clickClose();
    } else {
      alert('Failed to create project.');
    }
  })
  .catch(err => console.error('Error creating project:', err));
};

  return (
    <div id='mdl-backdrop' className={`w-full h-full fixed left-0 top-0 flex justify-center items-center bg-black/50 ${props.openState ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <section className='w-full rounded-lg bg-white flex flex-col' style={{maxWidth: '32rem'}}>
        <div id='mdl-header' className='p-4 text-2xl font-semibold'>
          Add a New Project
        </div>
        <div id='mdl-body' className='w-full pb-4 px-4'>
          <form className='w-full flex flex-col gap-4'>

            <div>
              <label className="label-text" htmlFor="name">Name</label>
              <input type="text" className="input" id="name" 
                onChange={(e) => setProject({ ...project, name: e.target.value })} />
            </div>
            <div>
              <label class="label-text" htmlFor="description"> Project Description </label>
              <textarea class="textarea" id="description" 
                onChange={(e) => setProject({ ...project, description: e.target.value })}></textarea>
            </div>

          </form>
        </div>
        <div id='mdl-footer' className='w-full pb-4 px-4 flex justify-end gap-4'>
          <button className="btn btn-soft btn-secondary" onClick={() => clickClose()}>Close</button>
          <button className="btn btn-primary" onClick={() => addProject()}>Add Project</button>
        </div>
      </section>
    </div>
  )
}

export default AddProjectModal
