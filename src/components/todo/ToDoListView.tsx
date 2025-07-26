import { useContext, useEffect, useState } from "react";
import { TodoItem } from "../../types/todo-items";
import { ProjectContext, useProject, useProjectContext } from "../project/ProjectContext";
import './todo.css';

export const NewToDoDialog: React.FC<{
    onClose: () => void;
    onCreated: (newTodo: TodoItem) => void;
}> = ({ onClose, onCreated }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleCreate = () => {
        if (title.trim() === "") {
            alert("Title cannot be empty");
            return;
        }

        const newTodo: TodoItem = {
            id: 0,
            title,
            description,
            completed: false
        };

        onCreated(newTodo);
        onClose();
    };

    return (
        <div className="todo-dialog-overlay" onClick={onClose}>
            <div className="todo-dialog-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="todo-dialog-title">Create New To Do Item</h2>

                <form onSubmit={handleCreate} className="todo-dialog-form">
                    <div className="todo-dialog-field">
                        <label className="todo-dialog-label">To Do</label>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                </form>
                
                <div className="todo-dialog-footer">
                    <button className="todo-dialog-button" onClick={handleCreate}>
                        Create
                    </button>
                    <button className="todo-dialog-button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ToDoListView: React.FC = () => {
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
    const { project, updateProject } = useProject();
    const { getNextId } = useProjectContext();

    const [showNewToDoDialog, setShowNewToDoDialog] = useState(false);

    useEffect(() => {
        if (project) {
            setTodoItems(project.todoItems || []);
        } else {
            setTodoItems([]);
        }
    }, [project]);

    if (!project) {
        return <div className="no-project-selected">No project selected</div>;
    }

    const handleNewTodo = (newTodo: TodoItem) => {
        newTodo.id = getNextId('todoItem');
        const updatedProject = {
            ...project,
            todoItems: [...(project.todoItems || []), newTodo]
        };
        updateProject(updatedProject);
        setTodoItems((prev) => [...prev, newTodo]);        
    };

    const handleToDoUpdate = (updatedTodo: TodoItem) => {
        const updatedTodos = todoItems.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo
        );
        const updatedProject = {
            ...project,
            todoItems: updatedTodos
        };
        updateProject(updatedProject);
        setTodoItems(updatedTodos);
    };

    const handleDeleteTodo = (todoId: number) => {
        if (window.confirm("Are you sure you want to delete this todo item? This action cannot be undone.")) {
            const updatedTodos = todoItems.filter(todo => todo.id !== todoId);
            const updatedProject = {
                ...project,
                todoItems: updatedTodos
            };
            updateProject(updatedProject);
            setTodoItems(updatedTodos);
        }
    };

    return (
        <div className="todo-list-container">
            <div className="todo-header">
                <h2>Todo List</h2>
                <button 
                    className="add-todo-button"
                    onClick={() => setShowNewToDoDialog(true)}
                >
                    Add Todo
                </button>
            </div>
            {showNewToDoDialog && (
                <NewToDoDialog
                    onClose={() => setShowNewToDoDialog(false)}
                    onCreated={handleNewTodo}
                />
            )}
            {todoItems.filter(todo => !todo.completed).map(todo => (
                <div key={todo.id} className="todo-item">
                    <span>{todo.title}</span>
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={(e) => handleToDoUpdate({ ...todo, completed: e.target.checked })}
                    />
                    <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                </div>
            ))}
            {todoItems.some(todo => todo.completed) && (
                <h3>Completed Todos</h3>
            )}
            {todoItems.filter(todo => todo.completed).map(todo => (
                <div key={todo.id} className="todo-item">
                    <span>{todo.title}</span>
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={(e) => handleToDoUpdate({ ...todo, completed: e.target.checked })}
                    />
                    <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                </div>
            ))}
        </div>        
    );
}