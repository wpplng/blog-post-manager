import './assets/css/style.css';
import { v4 as uuidv4 } from 'uuid';
import type { IPost } from './types';

let posts: IPost[] = JSON.parse(localStorage.getItem('posts') || '[]');

const formEl = document.querySelector<HTMLFormElement>('.form')!;
const titleInput = document.querySelector<HTMLInputElement>('#title')!;
const authorInput = document.querySelector<HTMLInputElement>('#author')!;
const contentInput = document.querySelector<HTMLInputElement>('#content')!;
const blogPostsEl = document.querySelector<HTMLFormElement>('.blog-posts')!;
const sortSelect = document.querySelector<HTMLSelectElement>('#sort')!;

const savePosts = () => {
  localStorage.setItem('posts', JSON.stringify(posts));
};

const renderPosts = () => {
  blogPostsEl.innerHTML = '';

  let sortedPosts = [...posts];

  if (sortSelect.value === 'blog-author') {
    sortedPosts.sort((a, b) => a.author.localeCompare(b.author));
  } else {
    sortedPosts.sort((a, b) => b.timestamp - a.timestamp);
  }

  sortedPosts.forEach((post) => {
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
          Edit
        </button>
        <button class="btn btn-delete" data-id="${post.id}">
          Delete
        </button>
      </div>
    `;
    blogPostsEl.appendChild(postEl);
  });
};

const deletePost = (postId: string) => {
  posts = posts.filter((post) => post.id !== postId);

  savePosts();
  renderPosts();
};

const editPost = (postId: string) => {
  const post = posts.find((p) => p.id === postId);

  if (post) {
    titleInput.focus();
    titleInput.value = post.title;
    authorInput.value = post.author;
    contentInput.value = post.content;
    posts = posts.filter((p) => p.id !== post.id);

    savePosts();
    renderPosts();
  }
};

formEl.addEventListener('submit', (e) => {
  e.preventDefault();

  const newPost: IPost = {
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

blogPostsEl.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const postId = target.dataset.id!;
  if (!postId) return;

  if (target.classList.contains('btn-delete')) {
    deletePost(postId);
  } else if (target.classList.contains('btn-edit')) {
    editPost(postId);
  }
});

sortSelect.addEventListener('change', renderPosts);

renderPosts();
