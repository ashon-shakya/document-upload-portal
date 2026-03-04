import { Request, Response } from 'express';
import { ITodo } from '../interfaces/ITodo';
import { todos } from '../models/todoModel';
import { sendSuccess, sendError } from '../helpers/responseHelper';

export const createTodo = (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return sendError(res, 'Title is required', 400);
        }

        const newTodo: ITodo = {
            id: Date.now().toString(),
            title,
            description: description || '',
            completed: false,
            createdAt: new Date(),
        };

        todos.push(newTodo);
        return sendSuccess(res, 'Todo created successfully', newTodo, 201);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const getTodos = (req: Request, res: Response) => {
    try {
        return sendSuccess(res, 'Todos retrieved successfully', todos);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const getTodoById = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const todo = todos.find(t => t.id === id);

        if (!todo) {
            return sendError(res, 'Todo not found', 404);
        }

        return sendSuccess(res, 'Todo retrieved successfully', todo);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const updateTodo = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;

        const todoIndex = todos.findIndex(t => t.id === id);
        if (todoIndex === -1) {
            return sendError(res, 'Todo not found', 404);
        }

        const updatedTodo = {
            ...todos[todoIndex],
            title: title !== undefined ? title : todos[todoIndex].title,
            description: description !== undefined ? description : todos[todoIndex].description,
            completed: completed !== undefined ? completed : todos[todoIndex].completed,
        };

        todos[todoIndex] = updatedTodo;
        return sendSuccess(res, 'Todo updated successfully', updatedTodo);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};

export const deleteTodo = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const todoIndex = todos.findIndex(t => t.id === id);

        if (todoIndex === -1) {
            return sendError(res, 'Todo not found', 404);
        }

        todos.splice(todoIndex, 1);
        return sendSuccess(res, 'Todo deleted successfully', null);
    } catch (error: any) {
        return sendError(res, error.message);
    }
};
