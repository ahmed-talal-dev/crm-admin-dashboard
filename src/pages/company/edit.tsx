import { Col, Form, Input, InputNumber, Row, Select } from "antd";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { UPDATE_COMPANY_MUTATION } from "@/graphql/mutations";
import CustomAvatar from "@/components/custom-avatar";
import { getNameInitials } from "@/utilities";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { UsersSelectQuery } from "@/graphql/types";
import { USERS_SELECT_QUERY } from "@/graphql/queries";
import SelectOptionWithAvatar from "@/components/select-option-with-avatar";
import {
  businessTypeOptions,
  companySizeOptions,
  industryOptions,
} from "@/constants";
import { CompanyContactsTable } from "./contacts-table";

const EditPage = () => {
  // Manage the company edit form and mutation lifecycle.
  const {
    saveButtonProps,
    formProps,
    formLoading,
    query,
  } = useForm({
    redirect: false,
    meta: {
      gqlMutation: UPDATE_COMPANY_MUTATION,
    },
  });

  // Extract the current company details loaded by Refine.
  const { avatarUrl, name } = query?.data?.data || {};

  // Fetch users to populate the Sales Owner field.
  const {
    selectProps,
    query: usersQuery,
  } = useSelect<GetFieldsFromList<UsersSelectQuery>>({
    resource: "users",
    optionLabel: "name",
    pagination: {
      mode: "off",
    },
    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    },
  });

  const users = usersQuery.data?.data ?? [];

  return (
    <div>
      <Row gutter={[32, 32]}>
        <Col xs={24} xl={12}>
          <Edit
            isLoading={formLoading}
            saveButtonProps={saveButtonProps}
            breadcrumb={false}
          >
            <Form {...formProps} layout="vertical">
              <CustomAvatar
                shape="square"
                src={avatarUrl ?? undefined}
                name={getNameInitials(name || "")}
                style={{
                  width: 96,
                  height: 96,
                  marginBottom: "24px",
                }}
              />

              <Form.Item
                label="Sales owner"
                name="salesOwnerId"
                initialValue={formProps?.initialValues?.salesOwner?.id}
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

              <Form.Item
                label="Company size"
                name="companySize"
              >
                <Select options={companySizeOptions} />
              </Form.Item>

              <Form.Item
                label="Total revenue"
                name="totalRevenue"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  addonBefore="$"
                  min={0}
                  placeholder="0.00"
                />
              </Form.Item>

              <Form.Item
                label="Industry"
                name="industry"
              >
                <Select options={industryOptions} />
              </Form.Item>

              <Form.Item
                label="Business type"
                name="businessType"
              >
                <Select options={businessTypeOptions} />
              </Form.Item>

              <Form.Item
                label="Country"
                name="country"
              >
                <Input placeholder="Country" />
              </Form.Item>

              <Form.Item
                label="Website"
                name="website"
              >
                <Input placeholder="Website" />
              </Form.Item>
            </Form>
          </Edit>
        </Col>

        <Col xs={24} xl={12}>
          <CompanyContactsTable />
        </Col>
      </Row>
    </div>
  );
};

export default EditPage;