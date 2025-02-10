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
    transition: transition || undefined,
    zIndex: isDragging ? 1 : 0,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "tab group h-12 rounded-2xl transition-colors cursor-pointer p-3",
        "flex items-center gap-3",
        "backdrop-blur-lg shadow-lg will-change-transform",
        isDragging ? "shadow-xl bg-white/20" : "",
        activeTabId === tab.id
          ? "bg-white/20 shadow-white/10"
          : "hover:bg-white/10 hover:shadow-white/5"
      )}
    >
      <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-white/10">
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
          <div className="absolute inset-0 animate-pulse bg-white/20 rounded-lg" />
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
        className="opacity-0 group-hover:opacity-100 hover:bg-white/20 p-1.5 rounded-xl
                 transition-colors hover:scale-110 active:scale-90 flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function Sidebar() {
  const { tabs, activeTabId, addTab, removeTab, setActiveTab, reorderTabs } = useBrowserStore();

  const handleSettingsClick = () => {
    // If there's already a settings tab, activate it
    const settingsTab = tabs.find(tab => tab.url === 'browser://settings');
    if (settingsTab) {
      setActiveTab(settingsTab.id);
    } else {
      // Create a new settings tab
      addTab({
        url: 'browser://settings',
        title: 'Settings',
        favicon: 'data:image/svg+xml,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="5" height="5" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
          </svg>
          `),
        });
      }
    };

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
    <div className="w-96 h-full bg-black/30 backdrop-blur-2xl border-r border-white/10 flex">
      <div className="w-20 h-full flex flex-col items-center py-6 gap-6 border-r border-white/10">
        <div className="flex-1 flex flex-col gap-3 w-full px-3">
          <button className="w-12 h-12 mx-auto rounded-2xl hover:bg-white/10 transition-all 
                         flex items-center justify-center hover:scale-105 active:scale-95
                         shadow-lg shadow-white/5 backdrop-blur-lg">
            <Home className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 mx-auto rounded-2xl hover:bg-white/10 transition-all 
                         flex items-center justify-center hover:scale-105 active:scale-95
                         shadow-lg shadow-white/5 backdrop-blur-lg">
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 mx-auto rounded-2xl hover:bg-white/10 transition-all 
                         flex items-center justify-center hover:scale-105 active:scale-95
                         shadow-lg shadow-white/5 backdrop-blur-lg">
            <Gamepad2 className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleSettingsClick}
          className="w-12 h-12 mx-auto rounded-2xl hover:bg-white/10 transition-all 
                         flex items-center justify-center hover:scale-105 active:scale-95
                         shadow-lg shadow-white/5 backdrop-blur-lg"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 py-6 flex flex-col">
        <div className="px-4 mb-4">
          <h2 className="text-sm font-medium text-white/60">Tabs</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-2">
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

        <div className="px-3 mt-2">
          <button
            onClick={() => addTab({ url: 'about:blank', title: 'New Tab' })}
            className="w-full h-12 rounded-2xl transition-all hover:bg-white/10
            flex items-center gap-2 px-3 text-white/80
            hover:scale-[1.02] active:scale-98 shadow-lg shadow-white/5
            backdrop-blur-lg"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm">New Tab</span>
          </button>
        </div>
      </div>
    </div>
  );
}