"use client";

import React, { useContext, useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";
import { AppContext } from "@/context/app-context";
import { TaskContext } from "@/context/task-context";
import { IColumn } from "@/types";

//Comment
export default function Board() {
  const { board, setBoard } = useContext(AppContext);
  const { updateTodoInDB } = useContext(TaskContext);

  const handleOnDrugEnd = async (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    //handle column drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rerrangedColumns = new Map(entries);
      setBoard({ columns: rerrangedColumns });
    }

    //This step is needed as the indexed are stored as numbers 0, 1,2 etc. Insted of the id's with DND library
    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finisheColIndex = columns[Number(destination.droppableId)];

    const startCol: IColumn = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };

    const finishCol: IColumn = {
      id: finisheColIndex[0],
      todos: finisheColIndex[1].todos,
    };

    //if u grag in same  position
    if (!startCol || !finishCol) return;

    if (source.index === destination.index && startCol === finishCol) return;

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      //same column task drag
      newTodos.splice(destination.index, 0, todoMoved);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };

      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);

      setBoard({ columns: newColumns });
    } else {
      //dragging to another column

      //Make a copy of th efinish column and splice
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);

      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };

      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });

      //Update  board  store in Db
      await updateTodoInDB(todoMoved.id, finishCol.id);
      setBoard({ columns: newColumns });
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDrugEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto "
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, collumn], index) => (
              <Column key={id} id={id} todos={collumn.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
