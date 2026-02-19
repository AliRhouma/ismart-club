import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export interface BlockSlashMenuProps {
  items: Array<{
    title: string;
    description: string;
    icon: any;
    command: () => void;
  }>;
  command: (item: any) => void;
}

export const BlockSlashMenu = forwardRef((props: BlockSlashMenuProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="bg-neutral-50 border border-neutral-border rounded-lg shadow-lg overflow-hidden max-h-[300px] overflow-y-auto">
      {props.items.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={index}
            className={`w-full px-4 py-3 cursor-pointer transition-colors flex items-center gap-3 ${
              index === selectedIndex ? 'bg-neutral-100' : 'hover:bg-neutral-100'
            }`}
            onClick={() => selectItem(index)}
          >
            <Icon className="w-5 h-5 text-brand-600" />
            <div className="text-left">
              <h5 className="font-medium text-default-font text-sm">{item.title}</h5>
              <p className="text-xs text-subtext-color mt-0">{item.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
});

BlockSlashMenu.displayName = 'BlockSlashMenu';
