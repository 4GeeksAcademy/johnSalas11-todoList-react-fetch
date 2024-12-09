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
            method: 'GET',
            headers: {
                'Content-type': 'application/json;'
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                if (response.status === 404) {
                    return fetch('https://playground.4geeks.com/todo/users/JohnSalas', {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json;'
                        }
                    }).then((response) => {
                        if (!response.ok) {
                            throw new Error('Error al crear el usuario.');
                        }
                        return response.json();
                    });
                }
                throw new Error('Error al verificar o crear el usuario.');
            })
            .then((userData) => setUser(userData))
            .catch((error) => {
                console.error('Error:', error);
            });
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



    const deleteTodo = (id) => {
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


    const deleteAllTodos = async () => {
        const deleteAll = todos.map(item => deleteTodo(item.id))
        await promise.all(deleteAll).then(() => setTodos([]))
    }


    if (!user || !todos) return <>No hay usuario</>;


    return (
        <div className="container">
            <h1>{user?.name ? `${user.name}'s tasks` : 'Loading...'}</h1>
            <input
                className="mb-3"
                value={inputValue}
                type="text"
                placeholder="To Be Done"
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={saveTodo}
            />
            <ul>
                {todos.map((todo, index) => (
                    <li key={index}>
                        <span>{todo.label}</span>
                        <i className="fa-solid fa-xmark icon" onClick={() => deleteTodo(todo.id)}></i>
                    </li>
                ))}
            </ul>
            <i className="fa-solid fa-trash icon" onClick={() => deleteAllTodos()}></i>
            <div>{todos.length} tasks left</div>
        </div>
    );
};
