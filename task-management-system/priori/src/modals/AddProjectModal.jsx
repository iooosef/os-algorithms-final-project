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
          <button className="btn btn-primary">Add Project</button>
        </div>
      </section>
    </div>
  )
}

export default AddProjectModal
