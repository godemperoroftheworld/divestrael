import ReactSelect, { Props } from 'react-select';
import { useId } from 'react';
import { mergeClasses } from '@/utils/class';

export default function Select({ className, ...props }: Props) {
  // Generate UUID
  const uniqueId = useId();

  return (
    <ReactSelect
      instanceId={uniqueId}
      className={mergeClasses(className, 'max-sm:text-xs sm:max-md:text-sm')}
      styles={{
        control: (base) => ({
          ...base,
          cursor: 'text',
        }),
        placeholder: (base) => ({
          ...base,
        }),
        option: (base) => ({
          ...base,
          color: 'black',
        }),
      }}
      {...props}
    />
  );
}
