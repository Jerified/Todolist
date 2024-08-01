import { useAnimate, usePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiClock } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";

export interface TodoProps {
   task: TodoProp
    handleEdit: (id: number, newText: string) => void;
    handleCheck: (id: number) => void;
    setEditing:React.Dispatch<React.SetStateAction<boolean>>
    editing: boolean
  }

  export interface TodoProp {
    id: number;
    text: string;
    checked: boolean;
    time?: string;
    isEditing?: boolean;
  }

const EditTodo = ({handleEdit, handleCheck, task, setEditing, editing, handleSubmit }: TodoProps) => {
    const {id, checked, text, time} = task
    console.log(editing)
    // const [value, setValue] = useState(text)
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

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault()
    //     setEditing(true)
    //     // handleEdit(id, value)
    // }
    const handleChange = () => {
        setEditing(true)
    console.log(editing)
    }
    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        handleEdit(id, e.target.value)
    }
    // handleChange
  return (
    <motion.form
    onSubmit={handleSubmit}
        ref={scope}
        layout
        className="relative flex w-full items-center gap-3 rounded border border-zinc-700 bg-zinc-900 p-3"
      >
        <motion.p
        >
        <input
          type="text"
          value={text}
          onChange={handleInputChange
            // (e) => handleEdit(task.id, e.target.value)
        }
          className="flex-1 bg-transparent outline-none"
        />
      {/* {children} */}
          
        </motion.p>
        <div className="ml-auto flex gap-1.5">
          <div className="flex items-center gap-1.5 whitespace-nowrap rounded bg-zinc-800 px-1.5 py-1 text-xs text-zinc-400">
            <FiClock />
            <span>{time}</span>
          </div>
          <button
        //   onClick={() => setEditing(true)}
        //   type="submit"
          className="rounded bg-zinc-300/20 px-1.5 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-600 hover:text-zinc-200"
        >
          <FaEdit  
          onClick={handleChange}
           />
        </button>
        </div>
      </motion.form>
  )
}

export default EditTodo