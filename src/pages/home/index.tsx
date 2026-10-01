import {
  DashboardTotalCountCard,
  DealsChart,
  LatestActivities,
  UpcomingEvents,
} from "@/components";

import { DASHBOARD_TOTAL_COUNTS_QUERY } from "@/graphql/queries";
import { DashboardTotalCountsQuery } from "@/graphql/types";

import { useCustom } from "@refinedev/core";
import { Col, Row } from "antd";

export const Home = () => {
  // Fetch the summary counts displayed at the top of the dashboard.
  const { query } = useCustom<DashboardTotalCountsQuery>({
    url: "",
    method: "get",
    meta: {
      gqlQuery: DASHBOARD_TOTAL_COUNTS_QUERY,
    },
  });

  const data = query.data;
  const isLoading = query.isLoading;

  return (
    <div>
      {/* Dashboard summary cards */}
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="companies"
            isLoading={isLoading}
            totalCount={data?.data.companies.totalCount ?? 0}
          />
        </Col>

        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="contacts"
            isLoading={isLoading}
            totalCount={data?.data.contacts.totalCount ?? 0}
          />
        </Col>

        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="deals"
            isLoading={isLoading}
            totalCount={data?.data.deals.totalCount ?? 0}
          />
        </Col>
      </Row>

      {/* Upcoming events and deals chart */}
      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24} sm={24} md={24} xl={8} style={{ height: "460px" }}>
          <UpcomingEvents />
        </Col>

        <Col xs={24} sm={24} md={24} xl={16} style={{ height: "460px" }}>
          <DealsChart />
        </Col>
      </Row>

      {/* Latest activity feed */}
      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24}>
          <LatestActivities />
        </Col>
      </Row>
    </div>
  );
};
