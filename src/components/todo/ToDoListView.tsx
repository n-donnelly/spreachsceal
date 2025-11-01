import { useContext, useEffect, useState } from "react";
import { TodoItem } from "../../types/todo-items";
import { ProjectContext, useProjectContext } from "../project/ProjectContext";
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
        <div className="dialog-overlay" onClick={onClose}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="dialog-title">Create New To Do Item</h2>

                <form onSubmit={handleCreate} className="dialog-form">
                    <div className="dialog-field">
                        <label className="dialog-label">To Do</label>
                        <input
                            type="text"
                            placeholder="Title"
                            className="dialog-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                </form>
                
                <div className="dialog-footer">
                    <button className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="create-button" onClick={handleCreate}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ToDoListView: React.FC = () => {
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
    const { currentProject, updateProject } = useProjectContext();
    const { getNextId } = useProjectContext();

    const [showNewToDoDialog, setShowNewToDoDialog] = useState(false);

    useEffect(() => {
        if (currentProject) {
            setTodoItems(currentProject.todoItems || []);
        } else {
            setTodoItems([]);
        }
    }, [currentProject]);

    if (!currentProject) {
        return <div className="no-project-selected">No project selected</div>;
    }

    const handleNewTodo = (newTodo: TodoItem) => {
        newTodo.id = getNextId('todoItem');
        const updatedProject = {
            ...currentProject,
            todoItems: [...(currentProject.todoItems || []), newTodo]
        };
        updateProject(updatedProject);
        setTodoItems((prev) => [...prev, newTodo]);        
    };

    const handleToDoUpdate = (updatedTodo: TodoItem) => {
        const updatedTodos = todoItems.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo
        );
        const updatedProject = {
            ...currentProject,
            todoItems: updatedTodos
        };
        updateProject(updatedProject);
        setTodoItems(updatedTodos);
    };

    const handleDeleteTodo = (todoId: number) => {
        if (window.confirm("Are you sure you want to delete this todo item? This action cannot be undone.")) {
            const updatedTodos = todoItems.filter(todo => todo.id !== todoId);
            const updatedProject = {
                ...currentProject,
                todoItems: updatedTodos
            };
            updateProject(updatedProject);
            setTodoItems(updatedTodos);
        }
    };

    return (
        <div className="todo-container">
            <div className="todo-header">
                <h1 className="section-title">ToDo List</h1>
            </div>
            <div className="todo-body">
                <button
                    className="default-button add-todo-button"
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
                        className="todo-complete-checkbox"
                        checked={todo.completed}
                        onChange={(e) => handleToDoUpdate({ ...todo, completed: e.target.checked })}
                    />
                    <button className="default-negative-button" onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
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