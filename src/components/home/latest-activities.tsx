import { UnorderedListOutlined } from "@ant-design/icons";
import { Card, List } from "antd";
import { Text } from "../text";
import LatestActivitiesSkeleton from "../skeleton/latest-activities";
import { useList } from "@refinedev/core";
import {
  DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
  DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY,
} from "@/graphql/queries";
import dayjs from "dayjs";
import CustomAvatar from "../custom-avatar";

const LatestActivities = () => {
  // 1. Get latest audits
  const {
    result: auditResult,
    query: auditQuery,
  } = useList({
    resource: "audits",
    meta: {
      gqlQuery: DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
    },
  });

  const audits = auditResult.data;

  const isLoadingAudit = auditQuery.isLoading;
  const isError = auditQuery.isError;
  const error = auditQuery.error;

  // 2. Get deal IDs from audits
  const dealIds = audits.map((audit) => audit?.targetId);

  // 3. Get deals related to those audits
  const {
    result: dealsResult,
    query: dealsQuery,
  } = useList({
    resource: "deals",

    queryOptions: {
      enabled: !!dealIds.length,
    },

    pagination: {
      mode: "off",
    },

    filters: [
      {
        field: "id",
        operator: "in",
        value: dealIds,
      },
    ],

    meta: {
      gqlQuery: DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY,
    },
  });

  const deals = dealsResult.data;
  const isLoadingDeals = dealsQuery.isLoading;

  // 4. Handle error
  if (isError) {
    console.log(error);
    return null;
  }

  const isLoading = isLoadingAudit || isLoadingDeals;

  return (
    <Card
    headStyle={{ padding: '16px'}}
      bodyStyle={{ padding: '0 1rem'}}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <UnorderedListOutlined />

          <Text
            size="sm"
            style={{
              marginLeft: "0.5rem",
            }}
          >
            Latest Activities
          </Text>
        </div>
      }
    >
      {isLoading ? (
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: 5 }).map((_, index) => ({
            id: index,
          }))}
          renderItem={(_, index) => (
            <LatestActivitiesSkeleton key={index} />
          )}
        />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={audits}
          renderItem={(item) => {
            const deal =
              deals.find(
                (deal) => deal.id === String(item.targetId)
              ) ?? undefined;

            return (
              <List.Item>
                <List.Item.Meta
                  title={dayjs(deal?.createdAt).format(
                    "MMM DD, YYYY - HH:mm"
                  )}
                  avatar={
                    <CustomAvatar
                      shape="square"
                      size={48}
                      src={deal?.company?.avatarUrl}
                      name={deal?.company?.name}
                    />
                  }
                  description={
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "4px",
    }}
  >
    <Text strong>{item.user?.name}</Text>

    <Text>
      {item.action === "CREATE" ? "created" : "moved"}
    </Text>

    <Text strong>{deal?.title}</Text>

    <Text>deal</Text>

    <Text>
      {item.action === "CREATE" ? "in" : "to"}
    </Text>

    <Text strong>{deal?.stage?.title}</Text>
  </div>
}
                />
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  );
};

export default LatestActivities;