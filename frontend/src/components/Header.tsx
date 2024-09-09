import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const [time, setTime] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('');
  const [emoji, setEmoji] = useState<string>(''); 

  const { user, logout } = useAuth();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      let greetingText = '';
      let greetingEmoji = ''; // Emoji based on time

      if (hours >= 5 && hours < 12) {
        greetingText = 'Good morning';
        greetingEmoji = '☀️'; // Sun emoji for morning
      } else if (hours >= 12 && hours < 17) {
        greetingText = 'Good afternoon';
        greetingEmoji = '☀️'; // Sun emoji for afternoon
      } else {
        greetingText = 'Good evening';
        greetingEmoji = '🌙'; // Moon emoji for evening/night
      }

      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
      setGreeting(greetingText);
      setEmoji(greetingEmoji);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedTime = useMemo(() => {
    return `It's ${time}, let's see what we've got to do today.`;
  }, [time]);

  const headerContent = useCallback(() => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <h1 className="text-xl font-medium text-white">{greeting} {user?.username}! {emoji}</h1>
      <p className="text-zinc-400">{formattedTime}</p>
    </motion.div>
  ), [greeting, formattedTime, emoji, user]);

  return (
    <nav className="flex justify-between items-center">
      <div>
        {headerContent()}
      </div>
      <div className='text-white'>
        {user ? (
          <button onClick={logout} className="px-4 py-1 bg-gradient-to-br from-black to-neutral-600 text-white rounded-md font-medium">
            Logout
          </button>
        ) : (
          <a href="/signin" className="px-4 py-1 bg-gradient-to-br from-black to-neutral-600 text-white rounded-md font-medium">
            Sign In
          </a>
        )}
      </div>
    </nav>
  );
};

export default Header;
