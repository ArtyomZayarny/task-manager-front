import { REQUEST_TASK } from "@/requests";
import { Board, IColumn, TypedColumn } from "@/types";

export const getTodosGroupedByColumn = async () => {
  const userId =
    localStorage.getItem("userId") !== "undefined"
      ? JSON.parse(localStorage.getItem("userId")!)
      : null;
  const token =
    localStorage.getItem("userId") !== "undefined"
      ? JSON.parse(localStorage.getItem("access_token")!)
      : null;

  let todos = [];

  if (userId) {
    const requestTasks = await fetch(`${REQUEST_TASK}/${userId}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    todos = await requestTasks.json();
  }

  const columns = todos.reduce((acc: any, todo: any) => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }
    acc.get(todo.status)!.todos.push({
      id: todo._id,
      createdAt: todo.createdAt,
      title: todo.title,
      status: todo.status,
      ...(todo.image && { image: todo.image }),
    });
    return acc;
  }, new Map<TypedColumn, IColumn>());

  //Add empty todos
  const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];

  for (const columnType of columnTypes) {
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        todos: [],
      });
    }
  }
  //Sort column
  const sortedColumns = new Map(
    // @ts-ignore: Unreachable code error
    Array.from(columns.entries()).sort(
      // @ts-ignore: Unreachable code error
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    )
  );

  const board: Board = {
    columns: sortedColumns,
  } as unknown as Board;

  return board;
};
