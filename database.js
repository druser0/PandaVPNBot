export const db = {
  users: new Map(),

  addUser(user) {
    this.users.set(user.id, user);
  },

  getUser(id) {
    return this.users.get(id);
  },

  getUsers() {
    return [...this.users.values()];
  },

  totalUsers() {
    return this.users.size;
  }
};
