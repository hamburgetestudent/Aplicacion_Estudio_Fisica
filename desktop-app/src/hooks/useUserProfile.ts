import { useState, useEffect } from 'react';
import { userProfile, UserProfile } from '../lib/gamification';

/**
 * Hook to subscribe to user profile updates.
 * Returns the current user profile instance and triggers re-renders on 'profile-updated' event.
 */
export function useUserProfile(): UserProfile {
    // Use a dummy state to force re-render
    const [, setTick] = useState(0);

    useEffect(() => {
        const handleUpdate = () => {
            setTick((t) => t + 1);
        };

        window.addEventListener('profile-updated', handleUpdate);
        return () => {
            window.removeEventListener('profile-updated', handleUpdate);
        };
    }, []);

    return userProfile;
}
