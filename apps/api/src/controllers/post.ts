import { RequestHandler } from 'express';
import { Comment } from '../models/comment';
import { Post } from '../models/post';
import { getCategory } from './category';

const posts: Post[] = [];

const comments: Comment[] = [];

const getPosts = (req: any, res: any) => {
  res.status(200).json(posts);
};

const savePost: RequestHandler = (req, res) => {
  const { title, image, description, category } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: 'title is required!' });
  }

  if (!description || !description.trim()) {
    return res.status(400).json({ message: 'Description is required!' });
  }

  if (category && !getCategory(category)) {
    return res.status(400).json({ message: 'Invalid category!' });
  }

  const newPost: Post = {
    id: Date.now().toString(),
    title: title.trim(),
    image: image || '',
    description: description.trim(),
    category: category || '',
    comments: []
  };

  posts.push(newPost);

  return res.status(201).json(newPost);
};

const getPostsByCategory = (req: any, res: any) => {
  const { category } = req.params;

  const filteredPosts = posts.filter((p) => p.category === category);

  res.status(200).json(filteredPosts);
};

const getPostById = (req: any, res: any) => {
  const { id } = req.params;

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found!' });
  }

  const category = getCategory(post.category);

  const postComments = post.comments
    .map((commentId) => comments.find((comment) => comment.id === commentId))
    .filter((comment): comment is Comment => comment !== undefined);

  res.status(200).json({ ...post, category, comments: postComments });
};

const savePostComment = (req: any, res: any) => {
  const { author, content } = req.body;
  const { id } = req.params;

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (!author || !author.trim()) {
    return res.status(400).json({ message: 'Author cannot be null' });
  }

  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Content cannot be null' });
  }

  const newComment: Comment = {
    id: Date.now().toString(),
    author: author.trim(),
    content: content.trim()
  };

  comments.push(newComment);
  post.comments.push(newComment.id);

  return res.status(201).json(newComment);
};

const deletePostById = (req: any, res: any) => {
  const { id } = req.params;

  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return res.status(404).json({ message: `Post with id ${id} not found!` });
  }

  posts.splice(postIndex, 1);

  res.status(200).send();
};

const editPostById = (req: any, res: any) => {
  const { id } = req.params;

  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return res.status(404).json({ message: `Post with id ${id} not found!` });
  }

  const { title, description, image, category } = req.body;

  const updatedPost = { ...posts[postIndex] };

  if (title !== undefined) {
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title cannot be empty!' });
    }
    updatedPost.title = title.trim();
  }

  if (description !== undefined) {
    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Description cannot be empty!' });
    }
    updatedPost.description = description.trim();
  }

  if (image !== undefined) updatedPost.image = image || '';

  if (category !== undefined) {
    if (category && !getCategory(category)) {
      return res.status(400).json({ message: 'Invalid category!' });
    }
    updatedPost.category = category || '';
  }

  posts[postIndex] = updatedPost;

  return res.status(200).json(updatedPost);
};

export default { getPosts, savePost, getPostsByCategory, getPostById, savePostComment, deletePostById, editPostById };
