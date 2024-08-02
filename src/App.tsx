import { useEffect, useState } from "react";
import Todos from "./components/Todos";
import Header from "./components/Header";
import { todo, TodoProps } from "./utils/todos";
import { toast, Toaster } from 'sonner'
import AddTodo from "./components/AddTodo";

const App = () => {
    const [todos, setTodos] = useState<TodoProps[]>(() => {
        const storedTodos = localStorage.getItem('todos');
        if (storedTodos) {
            return JSON.parse(storedTodos); 
        } else {
            return todo;
        }
    }); 
    
      useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
      }, [todos]); 
  
      const handleCheck = (id: number) => {
        setTodos((prevTodos) =>
          prevTodos.map((todo) => {
            if (todo.id === id) {
              const updatedTodo = { ...todo, checked: !todo.checked };
              if (updatedTodo.checked) {
                toast.success('Todo has been completed');
                const updatedTodos = JSON.stringify(updatedTodo)
                localStorage.setItem("todos", updatedTodos)
              }
              return updatedTodo;
            } else {
              return todo;
            }
          })
        );
      };
      const handleSaveEdit = (id: number, newText: string) => {
        setTodos((pv) =>
          pv.map((t) =>
            t.id === id ? { ...t, text: newText } : t
          )
        );
        const updatedTodos = JSON.stringify(todos)
        localStorage.setItem("todos", updatedTodos)
      };

    const removeElement = (id: number) => {
      setTodos((pv) => pv.filter((t) => t.id !== id));
        toast.error('Todo has been removed')
        const updateTodos = JSON.stringify(todos.filter((todo) => todo.id !== id))
        localStorage.setItem("todos", updateTodos)

    };

    return (
      <div
        className="min-h-screen bg-zinc-950 py-24"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%2318181b'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }}
      >
        <Toaster />
        <div className="mx-auto w-full max-w-xl px-4">
          <Header />
          <Todos
            removeElement={removeElement}
            todos={todos}
            handleSaveEdit={handleSaveEdit}
            handleCheck={handleCheck}
          />
        </div>
        <AddTodo setTodos={setTodos} />
      </div>
    );
  };

  export default App