import { useEffect, useState, useCallback } from "react";
import Todos from "@/components/Todos";
import { TodoProps } from "@/utils/todos";
import { toast } from 'sonner';
import AddTodo from "@/components/AddTodo";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Header";

const HomePage = () => {
    const backendUrl = process.env.BACKEND_URL;
    const [todos, setTodos] = useState<TodoProps[]>([]);

    const fetchTodos = useCallback(async () => {
        try {
            const response = await fetch(`${backendUrl}/api/todos`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include"
            });
            if (!response.ok) {
            toast.error("Failed to fetch todos");
            }
            const data: TodoProps[] = await response.json();
            
            setTodos(data);
        } catch (error) {
            console.error("Error fetching todos: " + (error as Error).message);

        }
    }, []);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const updateTodo = useCallback(async (id: number, updatedTodo: Partial<TodoProps>) => {
        try {
            const response = await fetch(`${backendUrl}/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify(updatedTodo),
            });
            if (!response.ok) {
                throw new Error("Failed to update todo");
            }
        } catch (error) {
            console.error("Error updating todo: " + (error as Error).message);
            toast.error("Error updating todo");
            throw error;
        }
    }, []);

    const handleCheck = useCallback(async (id: number) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) => {
                if (todo.ID === id) {
                    const updatedTodo = { ...todo, Checked: !todo.Checked };
                    updateTodo(id, updatedTodo).catch(() => {
                        setTodos((prevTodos) => prevTodos.map((t) => t.ID === id ? todo : t));
                    });
                    toast(updatedTodo.Checked ? 'Todo has been completed' : 'Todo has been uncompleted');
                    return updatedTodo;
                }
                return todo;
            })
        );
    }, [updateTodo]);

    const handleSaveEdit = useCallback(async (id: number, newText: string) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.ID === id ? { ...todo, Text: newText } : todo
            )
        );
        try {
            await updateTodo(id, { Text: newText });
        } catch (error) {
            setTodos((prevTodos) => prevTodos.map((t) => t.ID === id ? { ...t, Text: t.Text } : t));
        }
    }, [updateTodo]);

    const removeElement = useCallback(async (id: number) => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.ID !== id));
        toast.error('Todo has been removed');

        try {
            const response = await fetch(`${backendUrl}/api/todos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to delete todo");
            }
        } catch (error) {
            console.error("Error deleting todo: " + (error as Error).message);
            toast.error("Error deleting todo");
            fetchTodos();
        }
    }, [fetchTodos]);

    return (
        <Layout>
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
