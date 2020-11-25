import User from './User';
import Post from './Post';

function createPost(id, title, author) {
  const data = {
    post: {
      title,
      author: {
        name: author.name,
      },
    },
  };
  const post = new Post(data, id);
  return post;
}

const USER_ALEX = new User({ name: 'Al', email: 'Al@example.com', password: '12345678' }, 'Al');
const USER_ELIAS = new User({ name: 'El', email: 'El@example.com', password: '12345678' }, 'El');
const USER_MORITZ = new User({ name: 'Mo', email: 'Mo@example.com', password: '12345678' }, 'Mo');

const POST_ALEX = createPost('1', 'ABC', USER_ALEX);
const POST_ELIAS = createPost('2', 'DEF', USER_ELIAS);
const POST_MORITZ = createPost('3', 'GHI', USER_MORITZ);

export default {
  users: [USER_ALEX, USER_ELIAS, USER_MORITZ],
  posts: [POST_ALEX, POST_ELIAS, POST_MORITZ],
};
