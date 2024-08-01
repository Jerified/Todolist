import { AnimatePresence, useAnimate, usePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiClock, FiTrash2 } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { toast } from "sonner";

interface TodoProps {
    handleSaveEdit: (id: number, newText: string) => void;
    removeElement: (id: number) => void;
    handleCheck: (id: number) => void;
    id: number;
    checked: boolean;
    time?: string; 
    text: string
  }
  const Todo = ({ removeElement, handleCheck, id, text, checked, time, handleSaveEdit }: TodoProps) => {
    const updatedTodo = {id, text, checked, time}
    const [editing, setEditing] = useState(false)
    const [isPresent, safeToRemove] = usePresence();
    const [scope, animate] = useAnimate();

    const InputRef = useRef<HTMLInputElement>(null)

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        handleSaveEdit(id, e.target.value)
    }

    useEffect(() => {
      if(editing && InputRef.current) {
        InputRef.current.focus()
        InputRef.current?.setSelectionRange(
          InputRef.current.value.length,
          InputRef.current.value.length
        )
      }  
    }, [editing])
    
    const handleInputBlur = () => {
        setEditing(false)
        const updatedTodos = JSON.stringify(updatedTodo)
        localStorage.setItem("todos", updatedTodos)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setEditing(false)
        const updatedTodos = JSON.stringify(updatedTodo)
        localStorage.setItem("todos", updatedTodos)
        toast.success('Todo has been updated');
    }
    const handleChange = () => {
        setEditing(true)
    }
  
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
        <>
        {editing ? (
            <AnimatePresence>
                <motion.form
                    initial={{ y:0, scale: 1 }}
                    animate={{ y:5,scale: 1.03 }}
                    exit={{ y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                onSubmit={handleSubmit}
                    ref={scope}
                    layout
                    className="relative flex w-full items-center gap-3 rounded border border-zinc-700 bg-zinc-900 p-3"
                >
                    <motion.p
                    >
                    <input
                    ref={InputRef}
                    type="text"
                    value={text}
                    onBlur={handleInputBlur}
                    onChange={handleInputChange
                    }
                    className="flex-1 bg-transparent outline-none text-white"
                    />
                    
                    </motion.p>
                    <div className="ml-auto flex gap-1.5">
                    <div className="flex items-center gap-1.5 whitespace-nowrap rounded bg-zinc-800 px-1.5 py-1 text-xs text-zinc-400">
                        <FiClock />
                        <span>{time}</span>
                    </div>
                    <button
                    // onClick={handleChange}
                    //   onClick={() => setEditing(true)}
                    type="submit"
                    className="rounded bg-zinc-300/20 px-1.5 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-600 hover:text-zinc-200"
                    >
                    <FaEdit  
                    />
                    </button>
                    </div>
                </motion.form>
            </AnimatePresence>
    )
         :
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
            {text}
                
                </motion.p>
                <div className="ml-auto flex gap-1.5">
                <div className="flex items-center gap-1.5 whitespace-nowrap rounded bg-zinc-800 px-1.5 py-1 text-xs text-zinc-400">
                    <FiClock />
                    <span>{time}</span>
                </div>
                <button
                onClick={handleChange}
                className="rounded bg-zinc-300/20 px-1.5 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-600 hover:text-zinc-200"
                >
                <FaEdit />
                </button>
                
                <button
                    onClick={() => removeElement(id)}
                    className="rounded bg-red-300/20 px-1.5 py-1 text-xs text-red-300 transition-colors hover:bg-red-600 hover:text-red-200"
                >
                    <FiTrash2 />
                </button>
                </div>
            </motion.div> 
  }
        </>
    );
  };

  export default Todo