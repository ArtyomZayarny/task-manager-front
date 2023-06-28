export type AuthResponse = {
  code: string;
  message: string;
};

export type UserCreads = {
  login: string;
  password: string;
};

interface Board {
  columns: Map<TypedColumn, IColumn>;
}

type TypedColumn = "todo" | "inprogress" | "done";

interface IColumn {
  id: TypedColum;
  todos: Todo[];
}

interface Image {
  bucketId: string;
  fileId: string;
}

interface Todo {
  id: string;
  createdAt: string;
  title: string;
  status: string;
  image?: Image;
}
