import { ChangeEvent, ReactNode } from 'react';

interface InputProps {
  id: string;
  name: string;
  type: string;
  value: string;
  changeCallback: (event: ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
}

export const Input = ({ id, name, type, value, changeCallback, children }: InputProps) => {
  return (
    <div>
      <label htmlFor={id}>{children}</label>
      <input type={type} id={id} name={name} value={value} onChange={changeCallback} />
    </div>
  );
};
