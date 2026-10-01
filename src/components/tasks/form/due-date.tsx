import { useForm } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import {
  GetFields,
  GetVariables,
} from "@refinedev/nestjs-query";

import {
  Button,
  DatePicker,
  Form,
  Space,
} from "antd";
import dayjs from "dayjs";

import { Task } from "@/graphql/schema.types";
import {
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
} from "@/graphql/types";

import { UPDATE_TASK_MUTATION } from "@/graphql/mutations";

type Props = {
  initialValues: {
    dueDate?: Task["dueDate"];
  };
  cancelForm: () => void;
};

export const DueDateForm = ({
  initialValues,
  cancelForm,
}: Props) => {
  // Manage the task due date form and update mutation.
  const {
    formProps,
    saveButtonProps,
  } = useForm<
    GetFields<UpdateTaskMutation>,
    HttpError,
    Pick<
      GetVariables<UpdateTaskMutationVariables>,
      "dueDate"
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
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        width: "100%",
      }}
    >
      <Form
        {...formProps}
        initialValues={initialValues}
        style={{
          flex: "1 1 240px",
        }}
      >
        <Form.Item
          noStyle
          name="dueDate"
          getValueProps={(value) => {
            if (!value) {
              return {
                value: undefined,
              };
            }

            return {
              value: dayjs(value),
            };
          }}
        >
          <DatePicker
            format="YYYY-MM-DD HH:mm"
            showTime={{
              showSecond: false,
              format: "HH:mm",
            }}
            style={{
              width: "100%",
              backgroundColor: "#fff",
            }}
          />
        </Form.Item>
      </Form>

      <Space
        wrap
        style={{
          marginLeft: "auto",
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
  );
};