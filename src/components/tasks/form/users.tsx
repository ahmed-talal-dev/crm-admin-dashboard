import { useForm, useSelect } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import {
  GetFields,
  GetFieldsFromList,
  GetVariables,
} from "@refinedev/nestjs-query";

import {
  Button,
  Form,
  Select,
  Space,
} from "antd";

import {
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
  UsersSelectQuery,
} from "@/graphql/types";

import { USERS_SELECT_QUERY } from "@/graphql/queries";
import { UPDATE_TASK_MUTATION } from "@/graphql/mutations";

type Props = {
  initialValues: {
    userIds?: {
      label: string;
      value: string;
    }[];
  };
  cancelForm: () => void;
};

export const UsersForm = ({
  initialValues,
  cancelForm,
}: Props) => {
  // Manage task assignees and persist user selections.
  const {
    formProps,
    saveButtonProps,
  } = useForm<
    GetFields<UpdateTaskMutation>,
    HttpError,
    Pick<
      GetVariables<UpdateTaskMutationVariables>,
      "userIds"
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

  // Fetch available users for the assignee selector.
  const { selectProps } = useSelect<
    GetFieldsFromList<UsersSelectQuery>
  >({
    resource: "users",
    optionLabel: "name",

    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    },
  });

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: "12px",
        width: "100%",
      }}
    >
      <Form
        {...formProps}
        initialValues={initialValues}
        style={{
          flex: "1 1 260px",
          minWidth: 0,
        }}
      >
        <Form.Item
          noStyle
          name="userIds"
        >
          <Select
            {...selectProps}
            className="kanban-users-form-select"
            popupMatchSelectWidth={false}
            style={{
              width: "100%",
            }}
            mode="multiple"
            placeholder="Select users"
            maxTagCount="responsive"
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