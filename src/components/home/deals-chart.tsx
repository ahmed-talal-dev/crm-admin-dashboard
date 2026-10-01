import { DollarOutlined } from "@ant-design/icons";
import { Card } from "antd";
import React from "react";
import { Text } from "../text";
import { Area, AreaConfig } from "@ant-design/plots";
import { useList } from "@refinedev/core";
import { DASHBOARD_DEALS_CHART_QUERY } from "@/graphql/queries";
import { mapDealsData } from "@/utilities/helpers";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { DashboardDealsChartQuery } from "@/graphql/types";

const DealsChart = () => {
  const { result } = useList<GetFieldsFromList<DashboardDealsChartQuery>>({
    resource: "dealStages",
    filters: [
      {
        field: "title",
        operator: "in",
        value: ["WON", "LOST"],
      },
    ],
    meta: {
      gqlQuery: DASHBOARD_DEALS_CHART_QUERY,
    },
  });

  const dealData = React.useMemo(() => {
    return mapDealsData(result.data);
  }, [result.data]);

  const config: AreaConfig = {
    data: dealData,
    xField: "timeText",
    yField: "value",
    stack: false,
    shapeField: "smooth",
    legend: {
      position: "top",
    },

    axis: {
      y: {
        tickCount: 4,
        labelFormatter: (v: number) => {
          return `$${Number(v) / 1000}k`;
        },
      },
    },

    tooltip: {
      items: [
        (datum) => ({
          name: datum.state,
          value: `$${Number(datum.value) / 1000}k`,
        }),
      ],
    },

    colorField: "state",
  };

  return (
    <Card
      style={{ height: "100%" }}
      headStyle={{
        padding: "8px 16px",
      }}
      bodyStyle={{
        padding: "24px 24px 0 24px",
      }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <DollarOutlined />

          <Text
            size="sm"
            style={{
              marginLeft: "0.5rem",
            }}
          >
            Deals
          </Text>
        </div>
      }
    >
      <Area {...config} height={325} />
    </Card>
  );
};

export default DealsChart;
