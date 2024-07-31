import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  const [time, setTime] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      let greetingText = '';

      if (hours >= 5 && hours < 12) {
        greetingText = 'Good morning';
      } else if (hours >= 12 && hours < 17) {
        greetingText = 'Good afternoon';
      } else {
        greetingText = 'Good evening';
      }

      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
      setGreeting(greetingText);
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
      className={`mb-6`}
    >
      <h1 className="text-xl font-medium text-white">{greeting}! ☀️</h1>
      <p className="text-zinc-400">{formattedTime}</p>
    </motion.div>
  ), [greeting, formattedTime]);

  return headerContent();
};

export default Header;
