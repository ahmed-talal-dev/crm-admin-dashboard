import { totalCountVariants } from "@/constants";
import { Area, AreaConfig } from "@ant-design/plots";
import { Card, Skeleton } from "antd";
import { Text } from "../text";

type Props = {
  resource: "companies" | "contacts" | "deals";
  isLoading: boolean;
  totalCount: number;
};

const DashboardTotalCountCard = ({
  resource,
  isLoading,
  totalCount,
}: Props) => {
  const {
    primaryColor,
    secondaryColor,
    icon,
    title,
  } = totalCountVariants[resource];

const config: AreaConfig = {
  data: totalCountVariants[resource].data,
  xField: "index",
  yField: "value",

  padding: 0,
  autoFit: true,

  axis: {
    x: false,
    y: false,
  },

  tooltip: false,
  shapeField: "smooth",

  line: {
    shapeField: "smooth",
    style: {
      stroke: primaryColor,
      lineWidth: 2,
    },
  },

  style: {
    fill: `l(270) 0:#ffffff 0.25:${secondaryColor} 1:${primaryColor}`,
    fillOpacity: 0.45,
  },
};

  return (
    <Card
      style={{
        height: "96px",
        padding: 0,
      }}
      styles={{
        body: {
          padding: "8px 8px 8px 12px",
        },
      }}
      size="small"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          whiteSpace: "nowrap",
        }}
      >
        {icon}

        <Text
          size="md"
          className="secondary"
          style={{ marginLeft: "8px" }}
        >
          {title}
        </Text>
      </div>

    <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "12px",
  }}
>
  <Text
    size="xxxl"
    strong
    style={{
      minWidth: "80px",
      whiteSpace: "nowrap",
      flexShrink: 0,
      textAlign: "start",
      marginLeft: "48px",
      fontVariantNumeric: "tabular-nums",
    }}
  >
    {isLoading ? (
      <Skeleton.Button
        style={{
          marginTop: "8px",
          width: "74px",
        }}
      />
    ) : (
      totalCount
    )}
  </Text>

 <div
  style={{
    flex: 1,
    minWidth: 0,
    height: "58px",
  }}
>
  <Area {...config} />
</div>
</div>
    </Card>
  );
};

export default DashboardTotalCountCard;