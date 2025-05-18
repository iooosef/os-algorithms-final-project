import React, { useEffect, useRef, useState } from 'react'
import { useUser } from './auth/UserContext'; 
import { useNavigate } from 'react-router-dom';
import { BurgerIco } from './icons/BurgerIco';
import 'flyonui'
const Header = (props) => {
    const { user } = useUser();
    const navigate = useNavigate();
    return (
        <header class="w-full dropdown relative flex justify-between mb-4">
            <div className='flex items-center'>
                {user && <h1 className='font-bold text-xl'>
                    {user?.username}
                </h1>}
            </div>
            <div class="dropdown relative inline-flex">
            <button id="dropdown-menu-icon" type="button" class="dropdown-toggle btn btn-square btn-primary" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                <BurgerIco />
            </button>
            <ul class="dropdown-menu dropdown-open:opacity-100 hidden min-w-60" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-footer">
                <li>
                    
                    <a class={`dropdown-item ${props.activeHref === '/dashboard' ? 'dropdown-active' : ''}`} href="/dashboard">Tickets</a>
                </li>
                <li>
                    <a class={`dropdown-item ${props.activeHref === '/projects' ? 'dropdown-active' : ''}`} href="/projects">Projects</a>
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