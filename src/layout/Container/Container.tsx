import styles from './styles.module.css';

export const Container = ({ children }: { children: (JSX.Element | null)[] }) => {
  return <div className={styles.container}>{children}</div>;
};
