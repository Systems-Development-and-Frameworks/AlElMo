export default class User {
  constructor(data) {
    const { name } = data;
    if (name) {
      this.name = null;
      this.posts = [];
      this.setName(name);
    } else {
      const error = new Error(`A User was instantiated with malformed data: ${data}`);
      error.name = 'IllegalArgumentException';
      throw error;
    }
  }

  setName(name) {
    this.name = name;
    return this;
  }

  addPost(postId) {
    if (!this.posts.includes(postId)) {
      this.posts.push(postId);
    }
    return this;
  }

  setPosts(posts) {
    if (Array.isArray(posts)) {
      this.posts = posts;
    }
    return this;
  }

  removePost(postId) {
    if (this.posts.includes(postId)) {
      this.posts = this.posts.filter((p) => p.id !== postId);
    }
    return this;
  }
}
