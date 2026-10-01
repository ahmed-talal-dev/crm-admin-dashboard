import { useSearchParams } from "react-router";

import { useModalForm } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";

import { Form, Input, Modal } from "antd";

import { CREATE_TASK_MUTATION } from "@/graphql/mutations";

const TasksCreatePage = () => {
  // Read the target stage from the query string.
  const [searchParams] = useSearchParams();
  const { list } = useNavigation();

  // Manage the task creation form and modal lifecycle.
  const { formProps, modalProps, close } = useModalForm({
    action: "create",
    defaultVisible: true,
    meta: {
      gqlMutation: CREATE_TASK_MUTATION,
    },
  });

  const stageId = searchParams.get("stageId");

  return (
    <Modal
      {...modalProps}
      onCancel={() => {
        close();
        list("tasks", "replace");
      }}
      title="Add new card"
      width="min(512px, calc(100vw - 32px))"
    >
      <Form
        {...formProps}
        layout="vertical"
        onFinish={(values) => {
          // Include the selected stage and assigned users
          // in the mutation payload.
          formProps?.onFinish?.({
            ...values,
            stageId: stageId ? Number(stageId) : null,
            userIds: [],
          });
        }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: "Please enter a task title",
            },
          ]}
        >
          <Input placeholder="Enter task title" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TasksCreatePage;