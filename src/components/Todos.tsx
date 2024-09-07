import { motion, AnimatePresence } from "framer-motion";
import Todo from "./Todo";
import { TodosProps } from "../utils/todos";
import React from "react";

const Todos = React.memo(({ todos, handleCheck, removeElement, handleSaveEdit }: TodosProps) => {

  return (
    <div className="w-full space-y-3">
      <AnimatePresence>
        {Array.isArray(todos) && todos.length === 0 ? (
          <motion.div
            className="text-2xl font-semibold pt-24 text-center text-zinc-500"
          >
            No todos available
          </motion.div>
        ) : (
          todos.map((t) => (
            <Todo
              handleCheck={handleCheck}
              handleSaveEdit={handleSaveEdit}
              removeElement={removeElement}
              id={t.ID}
              key={t.ID}
              checked={t.Checked}
              time={t.Time}
              text={t.Text}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
});

export default Todos;
