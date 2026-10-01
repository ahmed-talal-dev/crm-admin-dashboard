import React from "react";
import { CompanyList } from "./list";
import { Form, Input, Modal, Select } from "antd";
import { useModalForm, useSelect } from "@refinedev/antd";
import { useGo } from "@refinedev/core";
import { CREATE_COMPANY_MUTATION } from "@/graphql/mutations";
import { USERS_SELECT_QUERY } from "@/graphql/queries";
import SelectOptionWithAvatar from "@/components/select-option-with-avatar";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { UsersSelectQuery } from "@/graphql/types";

const Create = () => {
  // Resource-aware navigation helper provided by Refine.
  const go = useGo();

  // Navigate back to the companies list while preserving
  // the current query parameters.
  const goToListPage = () => {
    go({
      to: {
        resource: "companies",
        action: "list",
      },
      options: {
        keepQuery: true,
      },
      type: "replace",
    });
  };

  // Manage the create form and modal state.
  // The mutation is executed only after the form is submitted.
  const { formProps, modalProps } = useModalForm({
    action: "create",
    defaultVisible: true,
    resource: "companies",
    redirect: false,

    // Wait for the server response before updating the UI.
    mutationMode: "pessimistic",

    // Return to the companies list after a successful creation.
    onMutationSuccess: goToListPage,

    meta: {
      gqlMutation: CREATE_COMPANY_MUTATION,
    },
  });

  // Fetch users to populate the Sales Owner select field.
  const { selectProps, query } = useSelect<
    GetFieldsFromList<UsersSelectQuery>
  >({
    resource: "users",
    optionLabel: "name",
    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    },
  });

  const users = query.data?.data ?? [];

  return (
    <CompanyList>
      <Modal
        {...modalProps}
        mask
        onCancel={goToListPage}
        title="Create Company"
        width={512}
      >
        <Form {...formProps} layout="vertical">
          <Form.Item
            label="Company name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter a company name",
              },
            ]}
          >
            <Input placeholder="Please enter a company name" />
          </Form.Item>

          <Form.Item
            label="Sales owner"
            name="salesOwnerId"
            rules={[
              {
                required: true,
                message: "Please select a sales owner",
              },
            ]}
          >
            <Select
              placeholder="Please select a sales owner"
              {...selectProps}
              options={users.map((user) => ({
                value: user.id,
                label: (
                  <SelectOptionWithAvatar
                    name={user.name}
                    avatarUrl={user.avatarUrl ?? undefined}
                  />
                ),
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </CompanyList>
  );
};

export default Create;