import { User } from './types';

export const userRegRequest = async (user: User) => {
  try {
    const response = await fetch('/api/reg', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const data = await response.text();

    if (response.status === 400) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.error(error);
  }
};
