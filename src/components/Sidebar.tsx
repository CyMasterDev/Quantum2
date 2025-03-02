import { Plus, Settings, Gamepad2, LayoutGrid, X, Globe, Home } from 'lucide-react';
import { useBrowserStore } from '../store/browser';
import { cn } from '../lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

function SortableTab({ tab, activeTabId, onRemove, onClick }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: tab.id,
  });

  const style = transform ? {
    transform: `translate3d(0px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 9999999999 : 0,
    position: 'relative'
  } : undefined;
  

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "max-w-full group h-12 rounded-full transition-all cursor-pointer p-3",
        "flex items-center gap-3",
        "backdrop-blur-lg shadow-lg will-change-transform active:bg-white/20 active:shadow-white/10 active:scale-95",
        isDragging ? "shadow-xl bg-white/20 transition-colors" : "",
        activeTabId === tab.id
          ? "bg-white/20 shadow-white/10"
          : "hover:bg-white/10 hover:shadow-white/5"
      )}
    >
      <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-white/10 ml-1">
        {tab.favicon ? (
          <img
            src={tab.favicon}
            alt=""
            className="w-4 h-4 rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={cn(
          "w-6 h-6 rounded-lg flex items-center justify-center bg-white/10",
          tab.favicon ? "hidden" : ""
        )}>
          <Globe className="w-4 h-4" />
        </div>
        {tab.loading && (
          <div className="absolute inset-0 animate-pulse bg-white/20 rounded-full" />
        )}
      </div>
      <span className="flex-1 text-sm truncate" title={tab.title}>
        {tab.title || 'New Tab'}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(tab.id);
        }}
        className="opacity-0 group-hover:opacity-100 hover:bg-white/20 p-1.5 rounded-full
                 transition-colors hover:scale-110 active:scale-90 flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function Sidebar() {
  const { tabs, activeTabId, addTab, removeTab, setActiveTab, reorderTabs } = useBrowserStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = tabs.findIndex((tab) => tab.id === active.id);
      const newIndex = tabs.findIndex((tab) => tab.id === over.id);
      reorderTabs(arrayMove(tabs, oldIndex, newIndex));
    }
  };

  return (
    <div className="w-72 h-full bg-black/30 backdrop-blur-2xl flex">
      <div className="flex-1 pt-6 flex flex-col w-full">
        <div className="px-3 mb-2">
          <button
            onClick={() => addTab({ url: 'about:blank', title: 'New Tab' })}
            className="w-full h-12 rounded-full transition-all hover:bg-white/10
            flex items-center gap-2 px-3 text-white/80 active:scale-95 shadow-lg shadow-white/5
            backdrop-blur-lg active:bg-white/20 active:shadow-white/10"
          >
            <Plus className="w-6 h-6" />
            <p className="base-semibold">New Tab</p>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-2 pb-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={tabs} strategy={verticalListSortingStrategy}>
              {tabs.map((tab) => (
                <SortableTab
                  key={tab.id}
                  tab={tab}
                  activeTabId={activeTabId}
                  onRemove={removeTab}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}