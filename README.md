# Todo List App

**Description:**  
A React-based todo list application that allows users to manage their tasks efficiently. Features include adding, editing, deleting, and marking todos as complete. The app uses a Golang backend with MySQL for data persistence, connected via Fiber, with authentication implemented using JWT and GORM.

**Features:**
- Create new todos with descriptions and due dates
- Mark todos as completed or incomplete
- Edit todo details (text)
- Delete individual or all completed todos
- Filter todos by status (completed)
- User authentication with JWT
- Secure data storage with GORM

**Technologies Used:**
- React
- TypeScript
- Tailwind CSS
- MySQL (for data storage)
- Golang & Fiber (backend)
- JWT (authentication)
- GORM (ORM for MySQL)

**Getting Started:**
1. Clone the repository: `git clone https://github.com/Jerified/TodoList.git`
2. Navigate to the project directory: `cd TodoList`
3. Install frontend dependencies: `npm install`
4. Navigate to the backend folder: `cd backend`
5. Install Go dependencies: `go get`
6. Start the backend server: `go run main.go`
7. Start the development server: `npm run dev`

**Usage:**
- Sign up or log in to manage your todos.
- Click the "Add Todo" button to create a new todo.
- Enter the todo description and optional due date.
- Click the checkbox to mark a todo as completed.
- Click the edit button to modify todo details.
- Use the filters to view active or completed todos.

**Contributing:**  
Contributions are welcome! Please open an issue or submit a pull request.

**License:**  
MIT
