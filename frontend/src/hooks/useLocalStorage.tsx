import { useEffect, useState } from 'react'
import { TodoProps } from '../utils/todos'

export const useLocalStorage = (key: string, initialValue: TodoProps[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [todos, setTodos] = useState<any>(() => {
        try {
            const localValue = window.localStorage.getItem(key)
            return localValue ? JSON.parse(localValue) : initialValue
        } catch (err) {
            console.log(err)
            return initialValue
        }
})

useEffect (() => {
    window.localStorage.setItem(key, JSON.stringify(todos))
}, [key, todos])
  return [todos, setTodos]
}