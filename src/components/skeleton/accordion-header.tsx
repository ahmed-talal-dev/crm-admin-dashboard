import { Skeleton } from "antd";

/**
 * Displays a lightweight loading placeholder for an accordion header.
 */
const AccordionHeaderSkeleton = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 24px",
        borderBottom: "1px solid #d9d9d9",
        width: "100%",
        minWidth: 0,
      }}
    >
      <Skeleton.Avatar
        size="small"
        shape="square"
      />

      <Skeleton.Input
        size="small"
        block
        style={{
          height: "22px",
          flex: 1,
          minWidth: 0,
        }}
      />
    </div>
  );
};

export default AccordionHeaderSkeleton;