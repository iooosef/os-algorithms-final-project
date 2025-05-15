import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { useConfig } from '../util/ConfigContext';

const Me = () => {
    const { serverUrl } = useConfig();
    const [userMe, setUserMe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useUser();
    const url = `${serverUrl}/me`
    useEffect(() => {
        if (!serverUrl) return;
        const fetchUser = async () => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserMe(data.user);
                } else {
                    throw new Error('Error fetching user data');
                }
            } catch (err) {
                setError(err.message);
                setUserMe('An error occurred, please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [serverUrl]);

    if (loading) return <p>Loading...</p>;
    return (
        <div>
            <h1>My Profile</h1>
            {error ? (
    <p>{error}</p>
) : userMe ? (
    <div>
        <p>id: {userMe.id}</p>
        <p>username: {userMe.username}</p>
        <p>role: {userMe.role}</p>
    </div>
) : null}
        </div>
    );
};

export default Me;
