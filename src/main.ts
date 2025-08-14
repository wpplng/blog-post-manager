import './style.css';
import { v4 as uuidv4 } from 'uuid';

interface Post {
  id: string;
  title: string;
  author: string;
  content: string;
  timestamp: number;
}

let posts: Post[] = JSON.parse(localStorage.getItem('posts') || '[]');

const formEl = document.querySelector<HTMLFormElement>('.form')!;
const titleInput = document.querySelector<HTMLInputElement>('#title')!;
const authorInput = document.querySelector<HTMLInputElement>('#author')!;
const contentInput = document.querySelector<HTMLInputElement>('#content')!;
const blogPostsEl = document.querySelector<HTMLFormElement>('.blog-posts')!;

const savePosts = () => {
  localStorage.setItem('posts', JSON.stringify(posts));
};

const renderPosts = () => {
  blogPostsEl.innerHTML = '';
  posts.forEach((post) => {
    const postEl = document.createElement('article');
    postEl.classList.add('blog-post');
    postEl.innerHTML = `
      <h3>${post.title}</h3>
      <small>By: ${post.author} ${new Date(
      post.timestamp
    ).toLocaleDateString()}</small>
      <p>${post.content}</p>
      <div class="btn-group">
        <button class="btn btn-edit" data-id="${post.id}">
          <span class="material-symbols-outlined">edit</span>
        </button>
        <button class="btn btn-delete" data-id="${post.id}">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    `;
    blogPostsEl.appendChild(postEl);
  });
};

formEl.addEventListener('submit', (e) => {
  e.preventDefault();

  const newPost: Post = {
    id: uuidv4(),
    title: titleInput.value,
    author: authorInput.value,
    content: contentInput.value,
    timestamp: Date.now(),
  };

  posts.push(newPost);
  savePosts();
  renderPosts();
  formEl.reset();
});

renderPosts();
