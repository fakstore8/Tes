import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types'; // Asumsi type User sudah didefinisikan

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  // [BARU] Fungsi untuk login/register via Google
  loginWithGoogle: (name: string, email: string) => Promise<User>; 
  logout: () => void;
  updateBalance: (newBalance: number) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'qris_users';
const CURRENT_USER_KEY = 'qris_current_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  // [BARU] Implementasi Google Login/Register Otomatis
  const loginWithGoogle = async (name: string, email: string): Promise<User> => {
    const users = getUsers();
    let foundUser = users.find(u => u.email === email);

    if (foundUser) {
      // Jika pengguna sudah ada, lakukan login
      setUser(foundUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
      return foundUser;
    } else {
      // Jika pengguna belum ada, lakukan registrasi otomatis (tanpa password)
      const newUser: User = {
        id: crypto.randomUUID(),
        name,
        email,
        password: '', // Password dikosongkan untuk pengguna Google
        balance: 0,
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);
      setUser(newUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      return newUser;
    }
  };
  
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    const users = getUsers();
    
    if (users.find(u => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      balance: 0,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    
    // Logika register yang lama tetap dipertahankan jika Anda punya halaman login/register email
    return true; 
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      
      // Update juga di list users
      const users = getUsers();
      const updatedUsers = users.map(u => 
        u.id === user.id ? updatedUser : u
      );
      saveUsers(updatedUsers);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        // register, // Anda dapat menghapus atau membiarkan register yang lama jika diperlukan
        register: register, 
        loginWithGoogle, // [BARU]
        logout,
        updateBalance,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
