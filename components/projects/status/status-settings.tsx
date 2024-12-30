'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStatusStore } from '@/lib/stores/use-status-store';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { GripVertical, Plus, X } from 'lucide-react';

const colorOptions = [
  { name: 'Slate', value: 'bg-slate-500' },
  { name: 'Red', value: 'bg-red-500' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Yellow', value: 'bg-yellow-500' },
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Pink', value: 'bg-pink-500' },
];

export function StatusSettings() {
  const { statuses, addStatus, updateStatus, deleteStatus, reorderStatuses } = useStatusStore();
  const [newStatusName, setNewStatusName] = useState('');

  const handleAdd = () => {
    if (newStatusName.trim()) {
      addStatus({
        name: newStatusName.trim(),
        color: 'bg-slate-500',
        order: statuses.length,
      });
      setNewStatusName('');
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    reorderStatuses(result.source.index, result.destination.index);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="New status name"
          value={newStatusName}
          onChange={(e) => setNewStatusName(e.target.value)}
        />
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Status
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="statuses">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {statuses.map((status, index) => (
                <Draggable
                  key={status.id}
                  draggableId={status.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex items-center gap-2 p-2 border rounded-md bg-card"
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="cursor-grab"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        value={status.name}
                        onChange={(e) =>
                          updateStatus(status.id, { name: e.target.value })
                        }
                        className="flex-1"
                      />
                      <select
                        value={status.color}
                        onChange={(e) =>
                          updateStatus(status.id, { color: e.target.value })
                        }
                        className="p-2 border rounded-md"
                      >
                        {colorOptions.map((color) => (
                          <option key={color.value} value={color.value}>
                            {color.name}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteStatus(status.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}