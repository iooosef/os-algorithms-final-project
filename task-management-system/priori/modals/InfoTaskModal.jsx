import React, { useEffect, useRef, useState } from 'react'
import { useConfig } from '../src/util/ConfigContext'
import { useUser } from '../src/auth/UserContext'

const InfoTaskModal = (props) => {
  const { serverUrl } = useConfig()
  const modalRef = useRef()
  const [manuallyClosed, setManuallyClosed] = useState(false)
  const [tix, setTix] = useState(null)
  const [users, setUsers] = useState([])

  useEffect(() => {
  if (typeof HSOverlay !== 'undefined' && modalRef.current) {
    if (!serverUrl || !props.id) return
    const modal = new HSOverlay(modalRef.current)

    if (props.openState && !manuallyClosed) {
      modal.open()
      fetchTix(props.id)
      fetchAllUsers()
    } else {
      modal.close()
    }
  }
}, [props.openState, manuallyClosed, serverUrl])


  const fetchTix = (id) => {
    fetch(`${serverUrl}/ticket?id=${id}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setTix(data))
      .catch(err => console.error('Error fetching ticket:', err))
  }

  const fetchAllUsers = () => {
    fetch(`${serverUrl}/user`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Error fetching users:', err))
  }

  const getUsername = (userId) => {
    const user = users.find(u => u.id === userId)
    return user ? user.username : 'Unassigned'
  }

  if (!tix) return null

  return (
    <>
      <div
        id="info-modal"
        ref={modalRef}
        className="overlay modal overlay-open:opacity-100 overlay-open:duration-300 hidden"
        role="dialog"
        tabIndex="-1"
      >
        <div className="modal-dialog overlay-open:opacity-100 overlay-open:duration-300">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                Ticket details for Ticket No. {tix.ticket_id}
              </h3>
              <button
                type="button"
                className="btn btn-text btn-circle btn-sm absolute end-3 top-3"
                aria-label="Close"
                onClick={() => props.setInfoModalOpen(false)}
              >
                <span className="icon-[tabler--x] size-4"></span>
              </button>
            </div>
            <div className="modal-body pt-0">
              <div className="mb-4">
                <strong>Description:</strong>
                <p>{tix.description || 'No description'}</p>
              </div>
              <div className="mb-4">
                <strong>Priority:</strong>
                <p>
                  {['ASAP', 'High', 'Medium', 'Low'][tix.priority] || 'Unknown'}
                </p>
              </div>
              <div className="mb-4">
                <strong>Status:</strong>
                <p>{tix.status}</p>
              </div>
              <div className="mb-4">
                <strong>Assigned To:</strong>
                <p>{getUsername(tix.assigned_to)}</p>
              </div>
              <div className="mb-4">
                <strong>Due Date:</strong>
                <p>{tix.due_date || 'No due date'}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-soft btn-secondary"
                onClick={() => props.setInfoModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default InfoTaskModal
