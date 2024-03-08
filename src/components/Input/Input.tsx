import { ChangeEvent, ReactNode } from 'react';

import styles from './styles.module.css';

interface InputProps {
  id: string;
  name: string;
  type: string;
  value: string;
  error?: string;
  changeCallback: (event: ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
}

export const Input = ({ id, name, type, value, error, changeCallback, children }: InputProps) => {
  return (
    <div className={`${styles['input-wrapper']} ${error && styles['input-wrapper_error']}`}>
      {error && <span className={styles.error}>{error}</span>}
      <input className={styles.input} type={type} id={id} name={name} value={value} onChange={changeCallback} required />
      <label className={styles.label} htmlFor={id}>
        {children}
      </label>
    </div>
  );
};
