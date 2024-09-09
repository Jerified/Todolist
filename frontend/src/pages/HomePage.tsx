import { useEffect, useState } from "react";
import Todos from "@/components/Todos";
import { TodoProps } from "@/utils/todos";
import { toast } from 'sonner';
import AddTodo from "@/components/AddTodo";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Header";

const HomePage = () => {
    const [todos, setTodos] = useState<TodoProps[]>([]);


    const fetchTodos = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/todos", {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include"
            });
            if (!response.ok) {
            toast.error("Error fetching todos");
            }
            const data: TodoProps[] = await response.json();
            
            setTodos(data);
        } catch (error) {
            console.error("Error fetching todos: " + (error as Error).message);

        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleCheck = async (id: number) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) => {
                if (todo.ID === id) {
                    const updatedTodo = { ...todo, Checked: !todo.Checked };
                    
                    if (updatedTodo.Checked) {
                        
                        toast.success('Todo has been completed');
                    } else {
                        
                        toast.info('Todo has been uncompleted');
                    }
    
                    fetch(`http://localhost:8000/api/todos/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: "include",
                        body: JSON.stringify(updatedTodo),
                    }).catch(error => toast.error("Error updating todo: " + error.message));
    
                    return updatedTodo;
                } else {
                    return todo;
                }
            })
        );
    };
    

    const handleSaveEdit = async (id: number, newText: string) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.ID === id ? { ...todo, Text: newText } : todo
            )
        );

        try {
            await fetch(`http://localhost:8000/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({ text: newText }),
            });
        } catch (error) {
            toast.error("Error updating todo: " + (error as Error).message);

        }
    };

    const removeElement = async (id: number) => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.ID !== id));
        toast.error('Todo has been removed');

        try {
            await fetch(`http://localhost:8000/api/todos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            
            })
            }
                catch (error) {
            toast.error("Error deleting todo: " + (error as Error).message);

        }
    };

    return (
        <Layout
        >
            <div className="mx-auto w-full max-w-xl px-4 pt-16">
            <Header />
                <Todos
                    removeElement={removeElement}
                    todos={todos}
                    handleSaveEdit={handleSaveEdit}
                    handleCheck={handleCheck}
                />
            </div>
            <AddTodo setTodos={setTodos} />
        </Layout>
    );
};

export default HomePage;
