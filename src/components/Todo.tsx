import { useAnimate, usePresence } from "framer-motion";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { FiClock, FiTrash2 } from "react-icons/fi";

interface TodoProps {
    removeElement: (id: number) => void;
    handleCheck: (id: number) => void;
    id: number;
    children: React.ReactNode;
    checked: boolean;
    time?: string; 
  }

  
  const Todo = ({ removeElement, handleCheck, id, children, checked, time }: TodoProps) => {
    const [isPresent, safeToRemove] = usePresence();
    const [scope, animate] = useAnimate();
  
    useEffect(() => {
      if (!isPresent) {
        const exitAnimation = async () => {
          animate(
            "p",
            {
              color: checked ? "#6ee7b7" : "#fca5a5",
            },
            {
              ease: "easeIn",
              duration: 0.125,
            }
          );
          await animate(
            scope.current,
            {
              scale: 1.025,
            },
            {
              ease: "easeIn",
              duration: 0.125,
            }
          );
  
          await animate(
            scope.current,
            {
              opacity: 0,
              x: checked ? 24 : -24,
            },
            {
              delay: 0.75,
            }
          );
          safeToRemove();
        };
  
        exitAnimation();
      }
    }, [isPresent]);
  
    return (
      <motion.div
        ref={scope}
        layout
        className="relative flex w-full items-center gap-3 rounded border border-zinc-700 bg-zinc-900 p-3"
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={() => handleCheck(id)}
          className="size-4 accent-indigo-400 cursor-pointer"
        />
  
        <motion.p
        initial={{ opacity: 1 }}
        animate={{ opacity: checked ? 0.5 : 1 }}
        transition={{ duration: 0.3 }}
        className={`text-white transition-colors ${checked && "text-zinc-400"}`}
        style={{
          textDecoration: checked ? "line-through" : "none",
          textDecorationThickness: checked ? "2px" : "0",
          textDecorationColor: checked ? "gray" : "transparent",
        }}
        >
          {children}
        </motion.p>
        <div className="ml-auto flex gap-1.5">
          <div className="flex items-center gap-1.5 whitespace-nowrap rounded bg-zinc-800 px-1.5 py-1 text-xs text-zinc-400">
            <FiClock />
            <span>{time}</span>
          </div>
          <button
            onClick={() => removeElement(id)}
            className="rounded bg-red-300/20 px-1.5 py-1 text-xs text-red-300 transition-colors hover:bg-red-600 hover:text-red-200"
          >
            <FiTrash2 />
          </button>
        </div>
      </motion.div>
    );
  };

  export default Todo