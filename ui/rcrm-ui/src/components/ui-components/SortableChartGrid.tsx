import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, useMediaQuery } from "@mui/material";

type Props = {
  charts: { id: string; render: (loading: boolean) => React.ReactNode }[];
  setCharts: (value: any) => void;
  loading: boolean;
};

const SortableItem = ({ id, children }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    background: "white",
    borderRadius: 12,
    boxShadow: isDragging
      ? "0px 12px 32px rgba(0,0,0,0.15)"
      : "0px 2px 10px rgba(0,0,0,0.08)",
  };

  return (
    <Box ref={setNodeRef} {...attributes} {...listeners} style={style}>
      {children}
    </Box>
  );
};

export default function SortableChartGrid({
  charts,
  setCharts,
  loading,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragEnd = (e: any) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const oldIndex = charts.findIndex((c) => c.id === active.id);
    const newIndex = charts.findIndex((c) => c.id === over.id);

    setCharts(arrayMove(charts, oldIndex, newIndex));
  };

  // 💡 Responsive grid using CSS Grid + media queries
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={charts} strategy={rectSortingStrategy}>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr",
              md: "1fr 1fr",
              lg: "1fr 1fr",
              xl: "1fr 1fr 1fr", // 3 columns on big screens
            },
          }}
        >
          {charts.map((chart) => (
            <SortableItem key={chart.id} id={chart.id}>
              {chart.render(loading)}
            </SortableItem>
          ))}
        </Box>
      </SortableContext>
    </DndContext>
  );
}
