
import { User, Task, TaskStatus, TaskPriority, AuthResponse, ApiResponse } from '../types';

// Simple delay helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockBackend {
  private USERS_KEY = 'taskflow_users';
  private TASKS_KEY = 'taskflow_tasks';
  private CURRENT_TOKEN_KEY = 'taskflow_token';

  private getUsers(): User[] {
    const data = localStorage.getItem(this.USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private getTasks(): Task[] {
    const data = localStorage.getItem(this.TASKS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveUsers(users: User[]) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private saveTasks(tasks: Task[]) {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }

  private getAuthenticatedUserId(): string | null {
    const token = localStorage.getItem(this.CURRENT_TOKEN_KEY);
    if (!token) return null;
    // In a real JWT, we'd decode it. Here the token is just the userId for simplicity.
    return token;
  }

  // --- Auth API ---

  async register(email: string, fullName: string, password: string): Promise<ApiResponse<AuthResponse>> {
    await delay(800);
    const users = this.getUsers();
    
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'User already exists' };
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      fullName,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    
    localStorage.setItem(this.CURRENT_TOKEN_KEY, newUser.id);
    return { success: true, data: { user: newUser, token: newUser.id } };
  }

  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    await delay(800);
    const users = this.getUsers();
    const user = users.find(u => u.email === email);

    // Mocking password check - any password works in this simulation
    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    localStorage.setItem(this.CURRENT_TOKEN_KEY, user.id);
    return { success: true, data: { user, token: user.id } };
  }

  async logout(): Promise<void> {
    localStorage.removeItem(this.CURRENT_TOKEN_KEY);
  }

  async getMe(): Promise<ApiResponse<User>> {
    const userId = this.getAuthenticatedUserId();
    if (!userId) return { success: false, message: 'Unauthorized' };
    
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) return { success: false, message: 'User not found' };
    return { success: true, data: user };
  }

  async updateMe(fullName: string): Promise<ApiResponse<User>> {
    await delay(500);
    const userId = this.getAuthenticatedUserId();
    if (!userId) return { success: false, message: 'Unauthorized' };

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return { success: false, message: 'User not found' };

    users[userIndex].fullName = fullName;
    this.saveUsers(users);
    return { success: true, data: users[userIndex] };
  }

  // --- Tasks API ---

  async getTasksList(): Promise<ApiResponse<Task[]>> {
    await delay(400);
    const userId = this.getAuthenticatedUserId();
    if (!userId) return { success: false, message: 'Unauthorized' };

    const tasks = this.getTasks().filter(t => t.userId === userId);
    return { success: true, data: tasks };
  }

  async createTask(title: string, description: string, priority: TaskPriority): Promise<ApiResponse<Task>> {
    await delay(500);
    const userId = this.getAuthenticatedUserId();
    if (!userId) return { success: false, message: 'Unauthorized' };

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      title,
      description,
      status: TaskStatus.TODO,
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const tasks = this.getTasks();
    tasks.push(newTask);
    this.saveTasks(tasks);
    return { success: true, data: newTask };
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<ApiResponse<Task>> {
    await delay(300);
    const userId = this.getAuthenticatedUserId();
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === userId);

    if (taskIndex === -1) return { success: false, message: 'Task not found' };

    tasks[taskIndex] = { 
      ...tasks[taskIndex], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    this.saveTasks(tasks);
    return { success: true, data: tasks[taskIndex] };
  }

  async deleteTask(taskId: string): Promise<ApiResponse<null>> {
    await delay(300);
    const userId = this.getAuthenticatedUserId();
    const tasks = this.getTasks();
    const filtered = tasks.filter(t => !(t.id === taskId && t.userId === userId));
    
    this.saveTasks(filtered);
    return { success: true };
  }
}

export const api = new MockBackend();
