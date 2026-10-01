import {
  DragOverlay,
  UseDraggableArguments,
  useDraggable,
} from "@dnd-kit/core";

interface Props {
  id: string;
  data?: UseDraggableArguments["data"];
}

const KanbanItem = ({
  children,
  id,
  data,
}: React.PropsWithChildren<Props>) => {
  // Register this item as draggable and expose the drag event bindings.
  const {
    attributes,
    listeners,
    setNodeRef,
    active,
  } = useDraggable({
    id,
    data,
  });

  const isActive = active?.id === id;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{
          width: "100%",
          opacity: active
            ? isActive
              ? 1
              : 0.5
            : 1,
          borderRadius: "8px",
          position: "relative",
          cursor: isActive ? "grabbing" : "grab",

          // Prevent touch scrolling from interfering with drag gestures.
          touchAction: "none",
        }}
      >
        {isActive && (
          <DragOverlay zIndex={1000}>
            <div
              style={{
                width: "100%",
                borderRadius: "8px",
                boxShadow:
                  "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                cursor: "grabbing",
              }}
            >
              {children}
            </div>
          </DragOverlay>
        )}

        {children}
      </div>
    </div>
  );
};

export default KanbanItem;