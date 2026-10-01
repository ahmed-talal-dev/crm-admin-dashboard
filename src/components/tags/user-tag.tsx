import { Space, Tag } from "antd";

import { User } from "@/graphql/schema.types";
import CustomAvatar from "../custom-avatar";
import { Text } from "../text";

type Props = {
  user: User;
};

export const UserTag = ({ user }: Props) => {
  return (
    <Tag
      style={{
        padding: 2,
        paddingRight: 8,
        borderRadius: 24,
        lineHeight: "unset",
        marginRight: "unset",
        maxWidth: "100%",
      }}
    >
      <Space
        size={4}
        style={{
          minWidth: 0,
        }}
      >
        <CustomAvatar
          src={user.avatarUrl ?? undefined}
          name={user.name}
          style={{
            display: "inline-flex",
            flexShrink: 0,
          }}
        />

        <Text
          ellipsis={{
            tooltip: user.name,
          }}
          style={{
            maxWidth: "140px",
          }}
        >
          {user.name}
        </Text>
      </Space>
    </Tag>
  );
};