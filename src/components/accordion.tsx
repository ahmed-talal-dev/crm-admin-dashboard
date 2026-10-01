import { AccordionHeaderSkeleton } from "@/components";
import { Text } from "./text";

type Props = React.PropsWithChildren<{
  accordionKey: string;
  activeKey?: string;
  setActive: (key?: string) => void;
  fallback: string | React.ReactNode;
  isLoading?: boolean;
  icon: React.ReactNode;
  label: string;
}>;

/**
 * Displays a collapsible task section.
 * The fallback is shown when collapsed, while children are rendered when active.
 */
export const Accordion = ({
  accordionKey,
  activeKey,
  setActive,
  fallback,
  icon,
  label,
  children,
  isLoading,
}: Props) => {
  if (isLoading) {
    return <AccordionHeaderSkeleton />;
  }

  const isActive = activeKey === accordionKey;

  // Toggle the current accordion section.
  const toggleAccordion = () => {
    setActive(isActive ? undefined : accordionKey);
  };

  return (
    <div
      style={{
        display: "flex",
        padding: "12px 24px",
        gap: "12px",
        alignItems: "flex-start",
        borderBottom: "1px solid #d9d9d9",
        width: "100%",
        minWidth: 0,
      }}
    >
      <div
        style={{
          marginTop: "1px",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {isActive ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            flex: 1,
            minWidth: 0,
          }}
        >
          <Text
            strong
            onClick={toggleAccordion}
            style={{
              cursor: "pointer",
            }}
          >
            {label}
          </Text>

          {children}
        </div>
      ) : (
        <div
          onClick={toggleAccordion}
          style={{
            cursor: "pointer",
            flex: 1,
            minWidth: 0,
          }}
        >
          {fallback}
        </div>
      )}
    </div>
  );
};