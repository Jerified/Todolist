import { AnimatePresence } from "framer-motion";
import Todo from "./Todo";
import { TodosProps } from "../utils/todos";
import React from "react";


const Todos = React.memo(({ todos, handleCheck, removeElement, handleSaveEdit }: TodosProps) => {
    return (
      <div className="w-full space-y-3">
        <AnimatePresence>
          {todos.map((t) => (
            <Todo
              handleCheck={handleCheck}
              handleSaveEdit={handleSaveEdit}  
              removeElement={removeElement}
              id={t.id}
              key={t.id}
              checked={t.checked}
              time={t.time}
              text= {t.text}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  });

  export default Todos