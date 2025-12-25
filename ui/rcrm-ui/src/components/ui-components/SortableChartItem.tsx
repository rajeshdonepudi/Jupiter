import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Grid from "@mui/material/Grid2";

export const SortableChartItem = ({ id, children }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Grid
      size={{ md: 6, xs: 12 }}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        cursor: "grab",
        "&:active": { cursor: "grabbing" },
      }}
    >
      {children}
    </Grid>
  );
};
