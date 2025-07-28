import ReactSelect, { Props } from 'react-select';
import { useId } from 'react';

export default function Select(props: Props) {
  // Generate UUID
  const uniqueId = useId();

  return (
    <ReactSelect
      instanceId={uniqueId}
      {...props}
    />
  );
}
