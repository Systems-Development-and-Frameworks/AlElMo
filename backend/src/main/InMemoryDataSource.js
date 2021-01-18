/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import { DataSource } from 'apollo-datasource';
import crypto from 'crypto';
import Post from './Post';
import User from './User';

export default class InMemoryDataSource extends DataSource {
  /**
   * Should be rewritten later to create unique id's based
   * on post id's already in the database
   */
  static getNewPostId() {
    return crypto.randomBytes(16).toString('hex');
  }

  static getNewUserId() {
    return crypto.randomBytes(16).toString('hex');
  }

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

  createUser(data, context) {
    try {
      const { email, password } = data;
      const duplicateEmail = this.users.find((u) => u.email === email);
      const passwordSufficient = password.length >= 8;
      const id = InMemoryDataSource.getNewUserId();
      if (passwordSufficient && !duplicateEmail) {
        const user = new User(data, id);
        this.users.push(user);
        return context.jwtSign({ id: user.id });
      }
      if (duplicateEmail) {
        return new Error('Email address already taken');
      }
      return new Error('Password is too short');
    } catch (e) {
      return e;
    }
  }

  loginUser(data, context) {
    const { email, password } = data;
    const user = this.users.find((u) => u.email === email);
    const correctPassword = user && user.comparePassword(password);
    if (user && correctPassword) {
      return context.jwtSign({ id: user.id });
    }
    if (!user) {
      return new Error('Unknown user');
    }
    return new Error('Wrong password');
  }

  createPost(data, context) {
    try {
      const { id: author } = context.user;
      const user = this.users.find((u) => u.id === author);
      if (user) {
        const postData = {
          post: {
            title: data.post.title,
            author: {
              id: user.id,
            },
          },

        };
        const post = new Post(postData, InMemoryDataSource.getNewPostId());
        this.posts.push(post);
        return post;
      }
      return new Error('User not found');
    } catch (e) {
      return e;
    }
  }

  deletePost({ id: postId } = {}, context) {
    const { id: author } = context.user;
    const user = this.users.find((u) => u.id === author);
    const post = this.posts.find((p) => p.id === postId);
    if (user && post && post.author === author) {
      this.posts = this.posts.filter((p) => p.id !== post.id);
      return post;
    }
    if (!user) {
      return new Error('User not found');
    }
    if (!post) {
      return new Error('Post not found');
    }
    return new Error('User does not own the rights to delete the post');
  }

  upvotePost({ id: postId } = {}, context) {
    const { id: author } = context.user;
    const user = this.users.find((u) => u.id === author);
    const post = this.posts.find((p) => p.id === postId);
    if (user && post) {
      return post.upvote(author);
    }
    if (!user) {
      return new Error('User not found');
    }
    return new Error('Post not found');
  }

  downvotePost({ id: postId } = {}, context) {
    const { id: author } = context.user;
    const user = this.users.find((u) => u.id === author);
    const post = this.posts.find((p) => p.id === postId);
    if (user && post) {
      return post.downvote(author);
    }
    if (!user) {
      return new Error('User not found');
    }
    return new Error('Post not found');
  }
}
