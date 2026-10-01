import { MarkdownField } from "@refinedev/antd";

import {
  Space,
  Tag,
  Typography,
} from "antd";

import dayjs from "dayjs";

import { Text, UserTag } from "@/components";
import { Task } from "@/graphql/schema.types";
import { getDateColor } from "@/utilities";

type DescriptionProps = {
  description?: Task["description"];
};

type DueDateProps = {
  dueData?: Task["dueDate"];
};

type UserProps = {
  users?: Task["users"];
};

export const DescriptionHeader = ({
  description,
}: DescriptionProps) => {
  // Display the task description when available.
  if (description) {
    return (
      <Typography.Paragraph
        ellipsis={{
          rows: 8,
        }}
        style={{
          marginBottom: 0,
          maxWidth: "100%",
        }}
      >
        <MarkdownField value={description} />
      </Typography.Paragraph>
    );
  }

  return (
    <Typography.Link>
      Add task description
    </Typography.Link>
  );
};

export const DueDateHeader = ({
  dueData,
}: DueDateProps) => {
  if (!dueData) {
    return (
      <Typography.Link>
        Add due date
      </Typography.Link>
    );
  }

  const color = getDateColor({
    date: dueData,
    defaultColor: "processing",
  });

  const getTagText = () => {
    switch (color) {
      case "error":
        return "Overdue";

      case "warning":
        return "Due soon";

      default:
        return "Processing";
    }
  };

  return (
    <Space
      size={[8, 8]}
      wrap
      style={{
        maxWidth: "100%",
      }}
    >
      <Tag color={color}>
        {getTagText()}
      </Tag>

      <Text>
        {dayjs(dueData).format(
          "MMMM D, YYYY - h:ma"
        )}
      </Text>
    </Space>
  );
};

export const UsersHeader = ({
  users = [],
}: UserProps) => {
  if (users.length === 0) {
    return (
      <Typography.Link>
        Assign to users
      </Typography.Link>
    );
  }

  return (
    <Space
      size={[8, 8]}
      wrap
      style={{
        maxWidth: "100%",
      }}
    >
      {users.map((user) => (
        <UserTag
          key={user.id}
          user={user}
        />
      ))}
    </Space>
  );
};