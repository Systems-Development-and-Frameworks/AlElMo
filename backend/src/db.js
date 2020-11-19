import { DataSource } from 'apollo-datasource';
import crypto from 'crypto';

export class Post {
  constructor (data) {
    this.id = crypto.randomBytes(16).toString('hex');
    this.usersUpvoted = [];
    this.usersDownvoted = [];
    this.votes = 0;
    this.title = data.post.title;
    this.author = data.post.author.name;
  }
}

export class User {
  constructor (data) {
    // this.id = crypto.randomBytes(16).toString('hex')
    Object.assign(this, data);
  }
}

export class InMemoryDataSource extends DataSource {
  constructor (posts = [], users = []) {
    super();
    this.posts = posts;
    this.users = users;
  }

  initialize (...args) {
    // console.log(args)
  }

  // Data: {id, title, votes, author, usersUpvoted[]}
  createPost (data) {
    console.log(data);
    const newPost = new Post(data);
    this.posts.push(newPost);
    return newPost;
  }

  // Data : {name(ID), posts[] }
  /*
    createUser(data) {
        const newUser = new User(data)
        this.users.push(newUser)
        return newUser
    } */
  upvotePost (data) {
    const updatedPost = this.posts.find(post => post.id == data.id);
    const userName = data.voter.name;
    if (updatedPost) {
      if (!updatedPost.usersUpvoted.includes(userName)) {
        updatedPost.votes += data.value;
        updatedPost.usersUpvoted.push(userName);
        console.log(updatedPost);
      }
    }
    return updatedPost;
  }

  // Data : {postID, user, upvote-1/+1}
  upvotePost2 ({ id: postId, voter = {} } = {}) {
    const updatedPost = this.posts.find(post => post.id === postId);
    const userName = voter.name;
    if (updatedPost) {
      if (!updatedPost.usersUpvoted.includes(userName)) {
        updatedPost.usersUpvoted.push(userName);
      }
      updatedPost.usersDownvoted = updatedPost.usersDownvoted.filter(name => name !== userName);
      updatedPost.votes = updatedPost.usersUpvoted.length - updatedPost.usersDownvoted.length;
      return updatedPost;
    }
  }

  downvotePost ({ id: postId, voter = {} } = {}) {
    const updatedPost = this.posts.find(post => post.id === postId);
    const userName = voter.name;
    if (updatedPost) {
      if (!updatedPost.usersDownvoted.includes(userName)) {
        updatedPost.usersDownvoted.push(userName);
      }
      updatedPost.usersUpvoted = updatedPost.usersUpvoted.filter(name => name !== userName);
      updatedPost.votes = updatedPost.usersUpvoted.length - updatedPost.usersDownvoted.length;
      return updatedPost;
    }
  }
}
