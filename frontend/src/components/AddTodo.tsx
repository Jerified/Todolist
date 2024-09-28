import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { TodoProps } from "../utils/todos";
import { toast } from "sonner";

interface FormProps {
  setTodos: React.Dispatch<React.SetStateAction<TodoProps[]>>;
}

const AddTodo = ({ setTodos }: FormProps) => {
    const backendUrl = "https://todolist-eptq.onrender.com";

  const [visible, setVisible] = useState(false);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const [time, setTime] = useState(15);
  const [text, setText] = useState("");
  const [unit, setUnit] = useState("mins");

  const handleOpenForm = () => {
    setVisible((prev) => !prev);
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const handleSubmit = async () => {
    if (!text.length) {
      return;
    }

    const timeWithUnit = `${time} ${unit}`;

    const newTodo = {
      text,
      checked: false,
      time: timeWithUnit,
    };

    try {
      const response = await fetch(`${backendUrl}/api/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Failed to add todo: " + errorData.error);
        return;
      }

      const savedTodo: TodoProps = await response.json();
      setTodos((prevTodos) => [savedTodo, ...prevTodos]);

      setTime(15);
      setText("");
      setUnit("mins");
      toast.success("New todo has been added");
    } catch (error: unknown) {
      console.log(error);
      toast.error("Error adding todo: " + (error as Error).message);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 w-full max-w-xl -translate-x-1/2 px-4">
      <AnimatePresence>
        {visible && (
          <motion.form
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="mb-6 w-full rounded border border-zinc-700 bg-zinc-900 p-3"
          >
            <textarea
              ref={textInputRef}
              value={text}
              autoFocus
              onChange={(e) => setText(e.target.value)}
              placeholder="What do you need to do?"
              className="h-24 w-full resize-none rounded bg-zinc-900 p-3 text-sm text-zinc-50 placeholder-zinc-500 caret-zinc-50 focus:outline-0"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  className="w-24 rounded bg-zinc-700 px-1.5 py-1 text-sm text-zinc-50 focus:outline-0"
                  value={time}
                  onChange={(e) => setTime(parseInt(e.target.value))}
                />
                <button
                  type="button"
                  onClick={() => setUnit("mins")}
                  className={`rounded px-1.5 py-1 text-xs ${
                    unit === "mins" ? "bg-white text-zinc-950" : "bg-zinc-300/20 text-zinc-300 transition-colors hover:bg-zinc-600 hover:text-zinc-200"
                  }`}
                >
                  mins
                </button>
                <button
                  type="button"
                  onClick={() => setUnit("hrs")}
                  className={`rounded px-1.5 py-1 text-xs ${
                    unit === "hrs" ? "bg-white text-zinc-950" : "bg-zinc-300/20 text-zinc-300 transition-colors hover:bg-zinc-600 hover:text-zinc-200"
                  }`}
                >
                  hrs
                </button>
              </div>
              <button
                type="submit"
                className="rounded bg-indigo-600 px-1.5 py-1 text-xs text-indigo-50 transition-colors hover:bg-indigo-500"
              >
                Submit
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      <button
        onClick={handleOpenForm}
        className="grid w-full place-content-center rounded-full border border-zinc-700 bg-zinc-900 py-3 text-lg text-white transition-colors hover:bg-zinc-800 active:bg-zinc-900"
      >
        <FiPlus
          className={`transition-transform ${visible ? "rotate-45" : "rotate-0"}`}
        />
      </button>
    </div>
  );
};

export default AddTodo;
