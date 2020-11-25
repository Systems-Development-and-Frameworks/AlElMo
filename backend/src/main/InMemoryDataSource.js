/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import { DataSource } from 'apollo-datasource';
import crypto from 'crypto';
import Post from './Post';
import User from './User';

export default class InMemoryDataSource extends DataSource {
  constructor(users = [], posts = []) {
    super();

    const bothArrays = Array.isArray(posts) && Array.isArray(users);
    const postClasses = posts.every((p) => p instanceof Post);
    const userClasses = users.every((u) => u instanceof User);

    if (bothArrays && postClasses && userClasses) {
      this.posts = posts;
      this.users = users;
    } else {
      const pString = JSON.stringify(posts, null, 2);
      const uString = JSON.stringify(users, null, 2);
      const error = new Error(`An InMemoryDataSource was instantiated with malformed posts and/or users:\nPosts: ${pString}\nUsers: ${uString}`);
      error.name = 'IllegalArgumentException';
      throw error;
    }
  }

  /**
   * Should be rewritten later to create unique id's based
   * on post id's already in the database
   */
  getNewPostId() {
    return crypto.randomBytes(16).toString('hex');
  }

  getNewUserId() {
    return crypto.randomBytes(16).toString('hex');
  }

  createUser(data) {
    try {
      const { email, password } = data;
      const duplicateEmail = this.users.find((u) => u.email === email);
      const id = this.getNewUserId();
      if (password.length >= 8 && !duplicateEmail) {
        const user = new User(data, id);
        this.users.push(user);
        return 'Hi user created';
      }
      throw Error('Password is either too short or there was a duplicate email address given!');
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  loginUser(data) {
    const { email, password } = date;
    const correctPassword = this.users.find((u) => u.email === email && u.password === password);
    if (correctPassword) {
      // login user, and store session token or something
    }
  }

  createPost(data) {
    try {
      const { name } = data.post.author;
      const user = this.users.find((u) => u.name === name);
      if (user) {
        const post = new Post(data, this.getNewPostId());
        this.posts.push(post);
        return post;
      }
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  deletePost({ id } = {}) {
    try {
      const post = this.posts.find((p) => p.id === id);
      if (post) {
        this.posts = this.posts.filter((p) => p.id !== post.id);
        return post;
      }
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  upvotePost({ id, voter = {} } = {}) {
    const post = this.posts.find((p) => p.id === id);
    return post && post.upvote(voter.name);
  }

  downvotePost({ id, voter = {} } = {}) {
    const post = this.posts.find((p) => p.id === id);
    return post && post.downvote(voter.name);
  }
}
