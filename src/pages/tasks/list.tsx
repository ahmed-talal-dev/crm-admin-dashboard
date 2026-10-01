import {
  KanbanColumnSkeleton,
  ProjectCardSkeleton,
} from "@/components";

import { KanbanAddCardButton } from "@/components/tasks/kanban/add-card-button";
import {
  KanbanBoard,
  KanbanBoardContainer,
} from "@/components/tasks/kanban/board";
import { ProjectCardMemo } from "@/components/tasks/kanban/card";
import KanbanColumn from "@/components/tasks/kanban/column";
import KanbanItem from "@/components/tasks/kanban/item";

import { UPDATE_TASK_STAGE_MUTATION } from "@/graphql/mutations";
import {
  TASKS_QUERY,
  TASK_STAGES_QUERY,
} from "@/graphql/queries";

import {
  TaskStagesQuery,
  TasksQuery,
} from "@/graphql/types";

import { DragEndEvent } from "@dnd-kit/core";

import {
  useGo,
  useList,
  useUpdate,
} from "@refinedev/core";

import { GetFieldsFromList } from "@refinedev/nestjs-query";

import React from "react";

type Task = GetFieldsFromList<TasksQuery>;

type TaskStage = GetFieldsFromList<TaskStagesQuery> & {
  tasks: Task[];
};

const List = ({ children }: React.PropsWithChildren) => {
  // Refine navigation helper.
  // We use useGo because the current Refine version no longer exposes
  // replace() directly from useNavigation().
  const go = useGo();

  // Fetch the Kanban task stages.
  const {
    result: stagesResult,
    query: stagesQuery,
  } = useList<TaskStage>({
    resource: "taskStages",

    filters: [
      {
        field: "title",
        operator: "in",
        value: [
          "TODO",
          "IN PROGRESS",
          "IN REVIEW",
          "DONE",
        ],
      },
    ],

    sorters: [
      {
        field: "createdAt",
        order: "asc",
      },
    ],

    meta: {
      gqlQuery: TASK_STAGES_QUERY,
    },
  });

  const stages = stagesResult.data;

  // Fetch tasks after the stage query is ready.
  const {
    result: tasksResult,
    query: tasksQuery,
  } = useList<Task>({
    resource: "tasks",

    sorters: [
      {
        field: "dueDate",
        order: "asc",
      },
    ],

    queryOptions: {
      enabled: !stagesQuery.isLoading,
    },

    pagination: {
      mode: "off",
    },

    meta: {
      gqlQuery: TASKS_QUERY,
    },
  });

  const tasks = tasksResult.data;

  // Mutation used when a task is moved between columns.
  const { mutate: updateTask } = useUpdate();

  // Group tasks by their stage.
  const taskStages = React.useMemo(() => {
    if (!tasks.length || !stages.length) {
      return {
        unassignedStage: [] as Task[],
        columns: [] as TaskStage[],
      };
    }

    // Tasks without a stage are shown in the Unassigned column.
    const unassignedStage = tasks.filter(
      (task) => task.stageId === null
    );

    // Attach the relevant tasks to each stage.
    const grouped: TaskStage[] = stages.map((stage) => ({
      ...stage,
      tasks: tasks.filter(
        (task) =>
          task.stageId?.toString() === stage.id
      ),
    }));

    return {
      unassignedStage,
      columns: grouped,
    };
  }, [stages, tasks]);

  // Navigate to the task creation route.
  // If a stage is selected, preserve its id in the query string.
  const handleAddCard = ({
    stageId,
  }: {
    stageId: string;
  }) => {
    const path =
      stageId === "unassigned"
        ? "/tasks/new"
        : `/tasks/new?stageId=${stageId}`;

    go({
      to: path,
      type: "replace",
    });
  };

  // Update the task stage after drag-and-drop completes.
  const handleOnDragEnd = (event: DragEndEvent) => {
    let stageId =
      event.over?.id as string | null | undefined;

    const taskId = event.active.id as string;

    const currentStageId =
      event.active.data.current?.stageId;

    // Prevent unnecessary updates if the task
    // is dropped into its current column.
    if (currentStageId === stageId) {
      return;
    }

    // The Unassigned column is represented as null in the API.
    if (stageId === "unassigned") {
      stageId = null;
    }

    updateTask({
      resource: "tasks",
      id: taskId,

      values: {
        stageId,
      },

      successNotification: false,

      // Update the UI immediately while the request
      // is being processed in the background.
      mutationMode: "optimistic",

      meta: {
        gqlMutation: UPDATE_TASK_STAGE_MUTATION,
      },
    });
  };

  const isLoading =
    stagesQuery.isLoading ||
    tasksQuery.isLoading;

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard onDragEnd={handleOnDragEnd}>
          {/* Unassigned tasks */}
          <KanbanColumn
            id="unassigned"
            title="Unassigned"
            count={taskStages.unassignedStage.length}
            onAddClick={() =>
              handleAddCard({
                stageId: "unassigned",
              })
            }
          >
            {taskStages.unassignedStage.map(
              (task) => (
                <KanbanItem
                  key={task.id}
                  id={task.id}
                  data={{
                    ...task,
                    stageId: "unassigned",
                  }}
                >
                  <ProjectCardMemo
                    {...task}
                    dueDate={
                      task.dueDate || undefined
                    }
                  />
                </KanbanItem>
              )
            )}

            {!taskStages.unassignedStage.length && (
              <KanbanAddCardButton
                onClick={() =>
                  handleAddCard({
                    stageId: "unassigned",
                  })
                }
              />
            )}
          </KanbanColumn>

          {/* Task stage columns */}
          {taskStages.columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              count={column.tasks.length}
              onAddClick={() =>
                handleAddCard({
                  stageId: column.id,
                })
              }
            >
              {column.tasks.map((task) => (
                <KanbanItem
                  key={task.id}
                  id={task.id}
                  data={task}
                >
                  <ProjectCardMemo
                    {...task}
                    dueDate={
                      task.dueDate || undefined
                    }
                  />
                </KanbanItem>
              ))}

              {!column.tasks.length && (
                <KanbanAddCardButton
                  onClick={() =>
                    handleAddCard({
                      stageId: column.id,
                    })
                  }
                />
              )}
            </KanbanColumn>
          ))}
        </KanbanBoard>
      </KanbanBoardContainer>

      {/* Render nested task routes such as create/edit modals. */}
      {children}
    </>
  );
};

export default List;

const PageSkeleton = () => {
  const columnCount = 6;
  const itemCount = 4;

  return (
    <KanbanBoardContainer>
      {Array.from({
        length: columnCount,
      }).map((_, columnIndex) => (
        <KanbanColumnSkeleton
          key={columnIndex}
        >
          {Array.from({
            length: itemCount,
          }).map((_, itemIndex) => (
            <ProjectCardSkeleton
              key={itemIndex}
            />
          ))}
        </KanbanColumnSkeleton>
      ))}
    </KanbanBoardContainer>
  );
};