export default class Post {
  constructor(data = {}, id) {
    const { post } = data;
    const { title, author = {} } = post;
    if (title && author && author.id && id !== undefined) {
      this.id = null;
      this.title = null;
      this.author = null;
      this.votes = null;
      this.upvotes = [];
      this.downvotes = [];

      this.setId(id)
        .setTitle(title)
        .setAuthor(author.id)
        .updateVotes();
    } else {
      const error = new Error('A Post was instantiated with malformed data');
      error.name = 'IllegalArgumentException';
      throw error;
    }
  }

  setId(id) {
    this.id = id;
    return this;
  }

  setTitle(title) {
    this.title = title;
    return this;
  }

  setAuthor(id) {
    this.author = id;
    return this;
  }

  updateVotes() {
    this.votes = this.upvotes.length - this.downvotes.length;
    return this;
  }

  setUpvotes(upvotes) {
    if (Array.isArray(upvotes)) {
      this.upvotes = upvotes;
    }
    return this;
  }

  setDownvotes(downvotes) {
    if (Array.isArray(downvotes)) {
      this.downvotes = downvotes;
    }
    return this;
  }

  upvote(author) {
    if (author) {
      this.upvotes.push(author);
      this.upvotes = [...new Set(this.upvotes)];
      this.downvotes = this.downvotes.filter((a) => a !== author);
    }
    return this.updateVotes();
  }

  downvote(author) {
    if (author) {
      this.downvotes.push(author);
      this.downvotes = [...new Set(this.downvotes)];
      this.upvotes = this.upvotes.filter((a) => a !== author);
    }
    return this.updateVotes();
  }
}
