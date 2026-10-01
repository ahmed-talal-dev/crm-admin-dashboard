import CustomAvatar from "@/components/custom-avatar";
import { Text } from "@/components/text";
import { COMPANIES_LIST_QUERY } from "@/graphql/queries";
import { Company } from "@/graphql/schema.types";
import { CompaniesListQuery } from "@/graphql/types";
import { currencyNumber } from "@/utilities";

import { SearchOutlined } from "@ant-design/icons";

import {
  CreateButton,
  DeleteButton,
  EditButton,
  FilterDropdown,
  List,
  useTable,
} from "@refinedev/antd";

import {
  HttpError,
  getDefaultFilter,
  useGo,
} from "@refinedev/core";

import { GetFieldsFromList } from "@refinedev/nestjs-query";

import {
  Input,
  Space,
  Table,
} from "antd";

export const CompanyList = ({
  children,
}: React.PropsWithChildren) => {
  // Refine navigation helper used for resource-aware routing.
  const go = useGo();

  // Configure the companies table with pagination, sorting,
  // filtering, search behavior, and the GraphQL query.
  const { tableProps, filters } = useTable<
    GetFieldsFromList<CompaniesListQuery>,
    HttpError,
    GetFieldsFromList<CompaniesListQuery>
  >({
    resource: "companies",

    // Convert the search form values into Refine filters.
    onSearch: (values) => [
      {
        field: "name",
        operator: "contains",
        value: values.name,
      },
    ],

    pagination: {
      pageSize: 12,
    },

    // Show the most recently created companies first.
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },

    // Initialize the company name filter without an active value.
    filters: {
      initial: [
        {
          field: "name",
          operator: "contains",
          value: undefined,
        },
      ],
    },

    meta: {
      gqlQuery: COMPANIES_LIST_QUERY,
    },
  });

  return (
    <div>
      <List
        breadcrumb={false}
        headerButtons={() => (
          <CreateButton
            onClick={() => {
              // Navigate to the create route while preserving
              // the current query parameters.
              go({
                to: {
                  resource: "companies",
                  action: "create",
                },
                options: {
                  keepQuery: true,
                },
                type: "replace",
              });
            }}
          />
        )}
      >
        <Table
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
          }}
        >
          <Table.Column<Company>
            dataIndex="name"
            title="Company Title"
            defaultFilteredValue={getDefaultFilter(
              "name",
              filters
            )}
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Company" />
              </FilterDropdown>
            )}
            render={(_, record) => (
              <Space>
                <CustomAvatar
                  shape="square"
                  name={record.name}
                  src={record.avatarUrl ?? undefined}
                />

                <Text style={{ whiteSpace: "nowrap" }}>
                  {record.name}
                </Text>
              </Space>
            )}
          />

          <Table.Column<Company>
            dataIndex="totalRevenue"
            title="Open deals amount"
            render={(_, company) => (
              <Text>
                {currencyNumber(
                  company?.dealsAggregate?.[0]?.sum?.value || 0
                )}
              </Text>
            )}
          />

          <Table.Column<Company>
            dataIndex="id"
            title="Actions"
            fixed="right"
            render={(value) => (
              <Space>
                <EditButton
                  hideText
                  size="small"
                  recordItemId={value}
                />

                <DeleteButton
                  hideText
                  size="small"
                  recordItemId={value}
                />
              </Space>
            )}
          />
        </Table>
      </List>

      {/* Render nested create/edit content, such as a modal or drawer. */}
      {children}
    </div>
  );
};