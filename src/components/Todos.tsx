import { AnimatePresence } from "framer-motion";
import Todo from "./Todo";
import { TodosProps } from "../utils/todos";


const Todos = ({ todos, handleCheck, removeElement }: TodosProps) => {
    return (
      <div className="w-full space-y-3">
        <AnimatePresence>
          {todos.map((t) => (
            <Todo
              handleCheck={handleCheck}
              removeElement={removeElement}
              id={t.id}
              key={t.id}
              checked={t.checked}
              time={t.time}
            >
              {t.text}
            </Todo>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  export default Todos