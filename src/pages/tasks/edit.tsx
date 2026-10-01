import { useState } from "react";

import { DeleteButton, useModalForm } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";

import {
  AlignLeftOutlined,
  FieldTimeOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

import { Modal } from "antd";

import {
  Accordion,
  DescriptionForm,
  DescriptionHeader,
  DueDateForm,
  DueDateHeader,
  StageForm,
  UsersForm,
  UsersHeader,
} from "@/components";

import { Task } from "@/graphql/schema.types";
import { UPDATE_TASK_MUTATION } from "@/graphql/mutations";

const TasksEditPage = () => {
  // Controls which accordion section is currently open.
  const [activeKey, setActiveKey] = useState<string | undefined>();

  // Navigate back to the tasks list after closing or deleting a task.
  const { list } = useNavigation();

  // Manage the task edit modal and fetch the current task data.
  const { modalProps, close, query } = useModalForm<Task>({
    action: "edit",
    defaultVisible: true,
    meta: {
      gqlMutation: UPDATE_TASK_MUTATION,
    },
  });

  const {
    description,
    dueDate,
    users,
    title,
  } = query?.data?.data ?? {};

  const isLoading = query?.isLoading ?? true;

  return (
    <Modal
      {...modalProps}
      className="kanban-update-modal"
      onCancel={() => {
        close();
        list("tasks", "replace");
      }}
      title={title}
      width="min(586px, calc(100vw - 32px))"
      footer={
        <DeleteButton
          type="link"
          onSuccess={() => {
            list("tasks", "replace");
          }}
        >
          Delete card
        </DeleteButton>
      }
    >
      {/* Task stage selector */}
      <StageForm isLoading={isLoading} />

      {/* Task description editor */}
      <Accordion
        accordionKey="description"
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={
          <DescriptionHeader description={description} />
        }
        isLoading={isLoading}
        icon={<AlignLeftOutlined />}
        label="Description"
      >
        <DescriptionForm
          initialValues={{ description }}
          cancelForm={() => setActiveKey(undefined)}
        />
      </Accordion>

      {/* Task due date editor */}
      <Accordion
        accordionKey="due-date"
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={<DueDateHeader dueData={dueDate} />}
        isLoading={isLoading}
        icon={<FieldTimeOutlined />}
        label="Due date"
      >
        <DueDateForm
          initialValues={{
            dueDate: dueDate ?? undefined,
          }}
          cancelForm={() => setActiveKey(undefined)}
        />
      </Accordion>

      {/* Assigned users editor */}
      <Accordion
        accordionKey="users"
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={<UsersHeader users={users} />}
        isLoading={isLoading}
        icon={<UsergroupAddOutlined />}
        label="Users"
      >
        <UsersForm
          initialValues={{
            userIds: users?.map((user) => ({
              label: user.name,
              value: user.id,
            })),
          }}
          cancelForm={() => setActiveKey(undefined)}
        />
      </Accordion>
    </Modal>
  );
};

export default TasksEditPage;