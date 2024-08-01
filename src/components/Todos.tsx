import { AnimatePresence } from "framer-motion";
import Todo from "./Todo";
import { TodosProps } from "../utils/todos";


const Todos = ({ todos, handleCheck, removeElement, handleSaveEdit }: TodosProps) => {
    return (
      <div className="w-full space-y-3">
        <AnimatePresence>
          {todos.map((t) => (
            <Todo
              handleCheck={handleCheck}
              handleSaveEdit={handleSaveEdit}
              removeElement={removeElement}
              {...t}
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
  };

  export default Todos