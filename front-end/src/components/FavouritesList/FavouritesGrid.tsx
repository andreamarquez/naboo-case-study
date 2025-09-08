import { Grid } from '@mantine/core';
import { ActivityFragment } from "@/graphql/generated/types";
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { DraggableActivity } from './DraggableActivity';

interface FavouritesGridProps {
  activities: ActivityFragment[];
  onReorder?: (orderedIds: string[]) => Promise<void>;
}

export function FavouritesGrid({ activities, onReorder }: FavouritesGridProps) {
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = activities.findIndex((activity) => activity.id === active.id);
      const newIndex = activities.findIndex((activity) => activity.id === over.id);
      
      const reorderedActivities = arrayMove(activities, oldIndex, newIndex);
      const orderedIds = reorderedActivities.map(activity => activity.id);
      
      try {
        await onReorder?.(orderedIds);
      } catch (error) {
        console.error('Failed to reorder favourites:', error);
      }
    }
  };

  // Drag and drop enabled grid
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={activities.map(activity => activity.id)}
        strategy={verticalListSortingStrategy}
      >
        <Grid>
          {activities.map((activity) => (
            <DraggableActivity
              key={activity.id}
              activity={activity}
            />
          ))}
        </Grid>
      </SortableContext>
    </DndContext>
  );
}
