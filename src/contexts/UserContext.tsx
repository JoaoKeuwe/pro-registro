
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  organization: string;
  avatar: string;
}

interface UserContextProps {
  user: User | null;
  updateUser: (data: Partial<User>) => void;
}

const defaultUser: User = {
  id: '1',
  name: 'Daniel Cascata',
  organization: 'Prefeitura de Florianópolis',
  avatar: '/9e31bb3a-b0d9-4f1b-93f3-734ef9db6ebf.png',
};

const UserContext = createContext<UserContextProps>({
  user: null,
  updateUser: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : defaultUser;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  const updateUser = (data: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...data };
      toast.success('Perfil atualizado com sucesso!');
      return updatedUser;
    });
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
