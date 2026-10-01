import { useForm } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import {
  GetFields,
  GetVariables,
} from "@refinedev/nestjs-query";

import MDEditor from "@uiw/react-md-editor";
import {
  Button,
  Form,
  Space,
} from "antd";

import { Task } from "@/graphql/schema.types";
import {
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
} from "@/graphql/types";

import { UPDATE_TASK_MUTATION } from "@/graphql/mutations";

type Props = {
  initialValues: {
    description?: Task["description"];
  };
  cancelForm: () => void;
};

export const TitleForm = ({
  initialValues,
  cancelForm,
}: Props) => {
  // Manage the task description form and update mutation.
  const {
    formProps,
    saveButtonProps,
  } = useForm<
    GetFields<UpdateTaskMutation>,
    HttpError,
    Pick<
      GetVariables<UpdateTaskMutationVariables>,
      "description"
    >
  >({
    queryOptions: {
      enabled: false,
    },

    redirect: false,

    // Close the editor after a successful update.
    onMutationSuccess: () => {
      cancelForm();
    },

    meta: {
      gqlMutation: UPDATE_TASK_MUTATION,
    },
  });

  return (
    <>
      <Form
        {...formProps}
        initialValues={initialValues}
      >
        <Form.Item
          noStyle
          name="description"
        >
          <MDEditor
            preview="edit"
            data-color-mode="light"
            height={250}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
      </Form>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "12px",
          width: "100%",
        }}
      >
        <Space
          wrap
          style={{
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <Button
            type="default"
            onClick={cancelForm}
          >
            Cancel
          </Button>

          <Button
            {...saveButtonProps}
            type="primary"
          >
            Save
          </Button>
        </Space>
      </div>
    </>
  );
};