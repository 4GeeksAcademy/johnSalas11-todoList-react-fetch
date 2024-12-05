import React, { useState, useEffect } from "react";

export const List = () => {
    const [inputValue, setInputValue] = useState('');
    const [todos, setTodos] = useState([]);
    const [user, setUser] = useState({});

    useEffect(() => {
        if(user && user.name ) {
            fetch(`https://playground.4geeks.com/todo/users/${user.name}`)
                .then((response) => response.json())
                .then(respJson => {
                    const saveTodos = respJson.todos || []; 
                    setTodos(saveTodos);
                });
        }
    }, [user]);

    useEffect(()=> {
        fetch('https://playground.4geeks.com/todo/users/JohnSalas11', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
        .then((response) => response.json())
        .then(respJson => setUser(respJson))
        .catch(() => {
            setUser({name: "JohnSalas"})
        })
    }, []);
    const createTodo = async (task) => {
        await fetch('https://playground.4geeks.com/todo/todos/JohnSalas11', {
            method: 'POST',
            body: JSON.stringify({
                "label": task,
                "is_done": false
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
        .then(response => response.json())
        .then(createTodosJson => {
            const newTodos = [...todos, createTodosJson]
            setTodos(() => [...newTodos]);
        });
    };
    const savePost = (e) => {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
            createTodo(e.target.value.trim());
            setInputValue('');
        }
    };
    const deletePost = (id) => {                            
        fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: 'DELETE'
        })
        .then(() => setTodos(() => {
                const newList = todos.filter(element => element !== id)
                return newList;
            }))
    };
    const deleteUser = async () => {
       await fetch('https://playground.4geeks.com/todo/todos/JohnSalas11', {  
        }).then(() => setUser(null))
    }
    if (!user || !todos) return <>No hay usuario</>;

    return (
        <div className="container rounded">
            <h1>ToDo's</h1>
                <input className="mb-3"
                    value={inputValue}
                    type="text"
                    placeholder="To Be Done"
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={savePost}
                />
            <ul>
                {
                        todos.map((item, index) => (
                            <li key={index}>
                                {item.label} 
                                <i className="fa fa-trash icon" onClick={() => deletePost(item.id)}></i>
                            </li>
                        ))
                    }
                <div>{todos.length} tasks left</div>
                <button onClick={()=> deleteUser()}>delete User</button>
            </ul>
        </div>
    );
};
