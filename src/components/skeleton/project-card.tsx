import { Card, Skeleton } from "antd";

const ProjectCardSkeleton = () => {
  return (
    <Card
      size="small"
      style={{
        width: "100%",
      }}
      styles={{
        body: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "8px",
        },
      }}
      title={
        <Skeleton.Button
          active
          size="small"
          style={{
            width: "100%",
            maxWidth: "200px",
            height: "22px",
          }}
        />
      }
    >
      <Skeleton.Button
        active
        size="small"
        style={{
          width: "100%",
          maxWidth: "200px",
        }}
      />

      <Skeleton.Avatar
        active
        size="small"
      />
    </Card>
  );
};

export default ProjectCardSkeleton;