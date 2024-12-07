import React, { useState, useEffect } from "react";

export const List = () => {
    const [inputValue, setInputValue] = useState('');
    const [todos, setTodos] = useState([]);
    const [user, setUser] = useState({});


    useEffect(() => {
        if (user && user.name) {
            fetch(`https://playground.4geeks.com/todo/users/${user.name}`)
                .then((response) => response.json())
                .then(respJson => {
                    const saveTodos = respJson.todos || [];
                    setTodos(saveTodos);
                });
        }
    }, [user]);


    useEffect(() => {
        fetch('https://playground.4geeks.com/todo/users/JohnSalas', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json;'
            }
        }).then(response => response.json())
            .then(responseJson => setUser(responseJson))
            .catch(() => { setUser({ name: "JohnSalas" }) })
    }, []);


    const createTodo = async (todo) => {
        await fetch('https://playground.4geeks.com/todo/todos/JohnSalas', {
            method: 'POST',
            body: JSON.stringify({
                "label": todo,
                "is_done": false
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(response => response.json()).then(respJson => {
            const newTodo = [...todos, respJson]
            setTodos(() => [...newTodo])
        });
    };


    const saveTodo = (e) => {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
            createTodo(e.target.value.trim());
            setInputValue('');
        }
    };



    const deletePost = (id) => {
        fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al eliminar la tarea del servidor.');
                }
                setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
            })
            .catch((error) => {
                console.error('Error al eliminar la tarea:', error);
            });
    };


    const deleteUser = async () => {
        await fetch('https://playground.4geeks.com/todo/users/JohnSalas', {
        }).then(() => setUser(null))
    }
    if (!user || !todos) return <>No hay usuario</>;


    return (
        <div className="container rounded">
            <div className="d-flex">
                <h1>ToDo's</h1>
                <button className="btn btn-light" onClick={() => deleteUser()}>delete User</button>
            </div>
            <input className="mb-3"
                value={inputValue}
                type="text"
                placeholder="To Be Done"
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={saveTodo}
            />
            <ul>
                {
                    todos.map((todo, index) => (
                        <li key={index}>
                            {todo.label}
                            <i className="fa fa-trash icon" onClick={() => deletePost(todo.id)}></i>
                        </li>
                    ))
                }
                <div>{todos.length} tasks left</div>
            </ul>
        </div>
    );
};
