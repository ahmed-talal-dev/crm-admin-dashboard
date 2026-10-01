import CustomAvatar from "./custom-avatar";
import { Text } from "./text";

type Props = {
  name: string;
  avatarUrl?: string;
  shape?: "circle" | "square";
};

const SelectOptionWithAvatar = ({
  avatarUrl,
  name,
  shape,
}: Props) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        minWidth: 0,
      }}
    >
      <CustomAvatar
        shape={shape}
        name={name}
        src={avatarUrl}
      />

      <Text
        ellipsis={{
          tooltip: name,
        }}
        style={{
          minWidth: 0,
        }}
      >
        {name}
      </Text>
    </div>
  );
};

export default SelectOptionWithAvatar;