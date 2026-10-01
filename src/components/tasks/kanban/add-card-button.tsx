import React from "react";

import { PlusSquareOutlined } from "@ant-design/icons";
import { Button } from "antd";

import { Text } from "@/components/text";

interface Props {
  onClick: () => void;
}

/**
 * Renders a reusable button for adding a new task card
 * to the current Kanban column.
 */
export const KanbanAddCardButton = ({
  children,
  onClick,
}: React.PropsWithChildren<Props>) => {
  return (
    <Button
      size="large"
      icon={<PlusSquareOutlined className="md" />}
      style={{
        margin: "16px",
        width: "calc(100% - 32px)",
        backgroundColor: "white",
      }}
      onClick={onClick}
    >
      {children ?? (
        <Text
          size="md"
          type="secondary"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          Add new card
        </Text>
      )}
    </Button>
  );
};