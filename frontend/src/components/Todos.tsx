import { motion, AnimatePresence } from "framer-motion";
import Todo from "./Todo";
import { TodosProps } from "../utils/todos";
import React from "react";

const Todos = React.memo(({ todos, handleCheck, removeElement, handleSaveEdit }: TodosProps) => {

  return (
    <div className="w-full space-y-3">
      <AnimatePresence>
        {!todos || todos.length === 0 ? (
          <motion.div
            className="text-2xl font-semibold pt-24 text-center text-zinc-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            No todos found
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