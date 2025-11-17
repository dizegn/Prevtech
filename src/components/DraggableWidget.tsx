import { ReactNode } from "react";
import { useDrag } from "react-dnd";
import { Resizable } from "re-resizable";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface DraggableWidgetProps {
  id: string;
  children: ReactNode;
  isEditing: boolean;
  width?: number;
  height?: number;
  onResize?: (width: number, height: number) => void;
  onRemove?: () => void;
}

export function DraggableWidget({ id, children, isEditing, width = 400, height = 200, onResize, onRemove }: DraggableWidgetProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "widget",
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isEditing,
  }), [isEditing]);

  if (!isEditing) {
    return <div className="w-full h-full">{children}</div>;
  }

  return (
    <Resizable
      size={{ width, height }}
      onResizeStop={(e, direction, ref, d) => {
        onResize?.(width + d.width, height + d.height);
      }}
      enable={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      className="relative"
    >
      <div
        ref={drag}
        className={`w-full h-full ${isDragging ? "opacity-50" : "opacity-100"} ${isEditing ? "cursor-move border-2 border-dashed border-blue-500" : ""}`}
      >
        {isEditing && onRemove && (
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2 z-10 h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        {children}
      </div>
    </Resizable>
  );
}