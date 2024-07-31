import { useEffect, useState } from "react";
import Todos from "./components/Todos";
import Form from "./components/Form";
import Header from "./components/Header";
import { TodoProps } from "./utils/todos";

const App = () => {
    const [todos, setTodos] = useState<TodoProps[]>(() => {
        const storedTodos = localStorage.getItem('todos');
        return storedTodos ? JSON.parse(storedTodos) : [];
      });
    
      useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
      }, [todos]); 
  
    const handleCheck = (id: number) => {
      setTodos((pv) =>
        pv.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t))
      );
    };
  
    const removeElement = (id: number) => {
      setTodos((pv) => pv.filter((t) => t.id !== id));
    };
  
    return (
      <section
        className="min-h-screen bg-zinc-950 py-24"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%2318181b'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }}
      >
        <div className="mx-auto w-full max-w-xl px-4">
          <Header />
          <Todos
            removeElement={removeElement}
            todos={todos}
            handleCheck={handleCheck}
          />
        </div>
        <Form setTodos={setTodos} />
      </section>
    );
  };

  export default App