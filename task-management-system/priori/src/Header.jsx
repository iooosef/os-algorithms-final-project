import React, { useEffect, useRef, useState } from 'react'
import { useUser } from './auth/UserContext'; 
import { useNavigate } from 'react-router-dom';
import { BurgerIco } from './icons/BurgerIco';
import { useConfig } from './util/ConfigContext'
import 'flyonui'
const Header = (props) => {
  const { serverUrl, appName } = useConfig()
    const { user } = useUser();
    const navigate = useNavigate();
    return (
        <header class="w-full dropdown relative flex justify-between mb-4">
            <div className='flex items-center'>
                {appName && <h1 className='font-bold text-xl'>
                    {appName}
                </h1>}
            </div>
            <div class="dropdown relative inline-flex">
            <button id="dropdown-avatar" type="button" class="dropdown-toggle btn btn-outline btn-primary flex items-center gap-2 rounded-full" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                <div class="avatar">
                    <BurgerIco />
                </div>
                {user && user.username}
            </button>
            <ul class="dropdown-menu dropdown-open:opacity-100 hidden min-w-60" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-footer">
                <li>                    
                    <a class={`dropdown-item ${props.activeHref === '/dashboard' ? 'dropdown-active' : ''}`} href="/dashboard">Your Tickets</a>
                </li>
                <li>                    
                    <a class={`dropdown-item ${props.activeHref === '/tickets-by' ? 'dropdown-active' : ''}`} href="/tickets-by">Tickets by You</a>
                </li>
                <li>
                    <a class={`dropdown-item ${props.activeHref === '/projects' ? 'dropdown-active' : ''}`} href="/projects">Projects</a>
                </li>
                <li>
                    <a class={`dropdown-item ${props.activeHref === '/gantt' ? 'dropdown-active' : ''}`} href="/gantt">Gantt Chart</a>
                </li>
                <li class="dropdown-footer gap-2">
                <a href='/logout' class="btn btn-error btn-soft btn-block">Sign out</a>
                </li>
            </ul>
            </div>
        </header>
    )
}

export default Header;