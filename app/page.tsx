"use client";
import { addTodo, deleteTodo, getTodos, updateTodo } from "@/actions/action";
import { useForm, SubmitHandler } from "react-hook-form";
import cross from "@/public/cross.png";
import unavailable from "@/public/unavailable.png";

import Image from "next/image";
import { useEffect, useState } from "react";

interface IFormInput {
  task: string;
}

const Main = () => {
  const { register, handleSubmit, reset } = useForm<IFormInput>();
  const [todos, setTodos] = useState<
    { id: string; task: string; completed: boolean; createdAt: Date }[]
  >([]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const result = await addTodo(data.task);
    setTodos((prevTodos) => [
      ...prevTodos,
      { ...result, id: result.id.toString() },
    ]);
    reset();
  };

  useEffect(() => {
    const fetchTodos = async () => {
      const result = await getTodos();
      setTodos(result);
    };
    fetchTodos();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };

  const handleUpdate = async (id: string, completed: boolean) => {
    console.log("inside the handleUpdate");
    const result = await updateTodo(id, completed);
    console.log(result);
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: completed } : todo
    );
    setTodos(newTodos);
  };

  return (
    <main className="w-full min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-sm:w-full w-[600px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center gap-5"
        >
          <h1 className="text-6xl font-bold">Todo App</h1>
          <div className="w-full relative">
            <input
              {...register("task")}
              className="p-2 outline-1 border-1 w-full text-[18px] bg-[#f5fefd]"
              placeholder="Enter the todo ..."
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 bg-black text-white p-3"
            >
              Submit
            </button>
          </div>
        </form>
        <hr className="mt-10 h-[.5px] bg-black rounded-full" />

        <div>
          <ul>
            {todos.length > 0 ? (
              todos.map((todo) => {
                return (
                  <li className="flex items-center gap-3 p-2" key={todo.id}>
                    <input
                      type="checkbox"
                      className="size-5 cursor-pointer"
                      onChange={() => handleUpdate(todo.id, !todo.completed)}
                    />
                    <span
                      className={`flex-1 text-2xl font-semibold ${
                        todo.completed && "line-through"
                      }`}
                    >
                      {todo.task}
                    </span>
                    <Image
                      src={cross}
                      alt="cross"
                      className="w-5 h-5 object-fit cursor-pointer"
                      onClick={() => handleDelete(todo.id)}
                    />
                  </li>
                );
              })
            ) : (
              <div className="flex flex-col items-center gap-3 mt-10">
                <Image
                  src="https://s3.ap-south-1.amazonaws.com/mohamed.bucket/todo_prisma/unavailable.png"
                  alt="unavailable"
                  className="w-28 h-28 object-fit"
                  width={1000}
                  height={1000}
                />
                <h1 className="text-3xl font-bold">No Todos Available</h1>
                <h2 className="text-xl font-light">Create One</h2>
              </div>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Main;
