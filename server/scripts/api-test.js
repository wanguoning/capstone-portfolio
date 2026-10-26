// scripts/api-test.js
// End-to-end API smoke test for the Capstone backend.
//
// The script connects to MongoDB, runs the seed module (seedDatabase), then
// clears the collections so the public/protected flow starts from a clean
// state. It then loads the Express app, listens on a random local port, and
// exercises every endpoint with the global fetch available in Node 22.
//
// Run with: node scripts/api-test.js
// Exit code 0 means every assertion passed, 1 means at least one failed.

require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const app = require('../app');
const { seedDatabase, clearDatabase } = require('./seed');

// --- Test helpers ---------------------------------------------------------

let pass = 0;
let fail = 0;
let baseUrl = '';

async function call(method, path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  const res = await fetch(`${baseUrl}/api${path}`, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let json = null;
  const text = await res.text();
  try {
    json = JSON.parse(text);
  } catch (_) {
    json = null;
  }
  return { status: res.status, json };
}

function record(name, method, path, hasToken, expectedStatus, actualStatus, ok, note = '') {
  if (ok) pass += 1;
  else fail += 1;
  const mark = ok ? 'PASS' : 'FAIL';
  console.log(
    `[${mark}] ${name}\n        ${method} ${path} | token: ${hasToken ? 'yes' : 'no'} | expected ${expectedStatus}, actual ${actualStatus}${note ? ` | ${note}` : ''}`
  );
}

// --- Test suite ----------------------------------------------------------

async function runTests() {
  // Start the Express app on an ephemeral local port
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  console.log('==========================================================');
  console.log(' Capstone Backend API - End-to-End Test Suite');
  console.log(` Node ${process.version} | Base URL: ${baseUrl}`);
  console.log('==========================================================\n');

  // Shared state captured from responses
  let tokenAdmin = '';
  let token2 = '';
  let adminId = '';
  let projectId = '';
  let postId = '';
  let post2Id = '';

  let r;

  // 1. Register admin -> 201, returns token and username
  r = await call('POST', '/users/register', {
    body: { username: 'admin', email: 'admin@portfolio.com', password: '123456' },
  });
  tokenAdmin = r.json?.token || '';
  adminId = r.json?._id || '';
  record(
    'Register admin account',
    'POST', '/api/users/register', false, 201, r.status,
    r.status === 201 && r.json?.success === true && Boolean(r.json?.token) && r.json?.username === 'admin',
    `username=${r.json?.username}`
  );

  // 1b. Register the same email again -> 400
  r = await call('POST', '/users/register', {
    body: { username: 'admin-copy', email: 'admin@portfolio.com', password: '123456' },
  });
  record(
    'Register duplicate email rejected',
    'POST', '/api/users/register', false, 400, r.status,
    r.status === 400 && r.json?.success === false,
    `message=${r.json?.message}`
  );

  // 2. Register second user author2 -> 201, capture token2
  r = await call('POST', '/users/register', {
    body: { username: 'author2', email: 'author2@portfolio.com', password: '123456' },
  });
  token2 = r.json?.token || '';
  record(
    'Register second user author2',
    'POST', '/api/users/register', false, 201, r.status,
    r.status === 201 && Boolean(r.json?.token) && r.json?.username === 'author2',
    `username=${r.json?.username}`
  );

  // 3. Login admin -> 200, returns token
  r = await call('POST', '/users/login', {
    body: { email: 'admin@portfolio.com', password: '123456' },
  });
  tokenAdmin = r.json?.token || tokenAdmin;
  record(
    'Login admin with correct credentials',
    'POST', '/api/users/login', false, 200, r.status,
    r.status === 200 && r.json?.success === true && Boolean(r.json?.token) && r.json?.username === 'admin',
    `username=${r.json?.username}`
  );

  // 3b. Login with wrong password -> 401
  r = await call('POST', '/users/login', {
    body: { email: 'admin@portfolio.com', password: 'wrongpass' },
  });
  record(
    'Login with wrong password rejected',
    'POST', '/api/users/login', false, 401, r.status,
    r.status === 401 && r.json?.success === false && r.json?.message === 'Invalid email or password',
    `message=${r.json?.message}`
  );

  // 4. POST project without token -> 401
  r = await call('POST', '/projects', { body: { title: 'X', description: 'Y' } });
  record(
    'Create project without token rejected',
    'POST', '/api/projects', false, 401, r.status,
    r.status === 401,
    `message=${r.json?.message}`
  );

  // 5. Admin creates a project -> 201
  r = await call('POST', '/projects', {
    token: tokenAdmin,
    body: {
      title: 'Test Portfolio Project',
      description: 'A sample project created by the admin user during the API test.',
      imageUrl: '',
      repoUrl: 'https://github.com/example/repo',
      liveUrl: '',
    },
  });
  projectId = r.json?.data?._id || '';
  record(
    'Admin creates a project',
    'POST', '/api/projects', true, 201, r.status,
    r.status === 201 && Boolean(r.json?.data?._id),
    `projectId=${projectId}`
  );

  // 5b. GET all projects (public) -> 200 with populated user.username
  r = await call('GET', '/projects');
  const projectList = r.json?.data || [];
  record(
    'GET all projects (public, populated username)',
    'GET', '/api/projects', false, 200, r.status,
    r.status === 200 && Array.isArray(projectList) && projectList.length >= 1 && projectList[0]?.user?.username === 'admin',
    `count=${projectList.length}, author=${projectList[0]?.user?.username}`
  );

  // 6. GET single project -> 200
  r = await call('GET', `/projects/${projectId}`);
  record(
    'GET single project by id',
    'GET', `/api/projects/${projectId}`, false, 200, r.status,
    r.status === 200 && r.json?.data?.title === 'Test Portfolio Project' && r.json?.data?.user?.username === 'admin',
    `title=${r.json?.data?.title}`
  );

  // 6b. GET project with nonexistent valid ObjectId -> 404
  r = await call('GET', '/projects/64b00000000000000000000');
  record(
    'GET nonexistent project id rejected',
    'GET', '/api/projects/64b00000000000000000000', false, 404, r.status,
    r.status === 404,
    `message=${r.json?.message}`
  );

  // 6c. GET project with invalid ObjectId -> 404
  r = await call('GET', '/projects/notanobjectid');
  record(
    'GET invalid ObjectId rejected',
    'GET', '/api/projects/notanobjectid', false, 404, r.status,
    r.status === 404,
    `message=${r.json?.message}`
  );

  // 7. Admin creates a blog post -> 201
  r = await call('POST', '/blog', {
    token: tokenAdmin,
    body: {
      title: 'First Test Post',
      content: 'Hello world, this is the first blog post created during the API test.',
    },
  });
  postId = r.json?.data?._id || '';
  record(
    'Admin creates a blog post',
    'POST', '/api/blog', true, 201, r.status,
    r.status === 201 && Boolean(r.json?.data?._id),
    `postId=${postId}`
  );

  // 7b. Admin creates a second post for the delete check later
  r = await call('POST', '/blog', {
    token: tokenAdmin,
    body: {
      title: 'Post To Delete',
      content: 'This second post will be removed by the admin during the delete authorization check.',
    },
  });
  post2Id = r.json?.data?._id || '';
  record(
    'Admin creates second post for deletion',
    'POST', '/api/blog', true, 201, r.status,
    r.status === 201 && Boolean(r.json?.data?._id),
    `postId=${post2Id}`
  );

  // 7c. GET all blog posts (public) -> 200 with populated author.username
  r = await call('GET', '/blog');
  const postList = r.json?.data || [];
  record(
    'GET all blog posts (public, populated username)',
    'GET', '/api/blog', false, 200, r.status,
    r.status === 200 && Array.isArray(postList) && postList.length >= 1 && postList[0]?.author?.username === 'admin',
    `count=${postList.length}, author=${postList[0]?.author?.username}`
  );

  // 7d. GET single blog post -> 200 with author and comments array
  r = await call('GET', `/blog/${postId}`);
  record(
    'GET single blog post with author and comments',
    'GET', `/api/blog/${postId}`, false, 200, r.status,
    r.status === 200 && r.json?.data?.author?.username === 'admin' && Array.isArray(r.json?.data?.comments),
    `author=${r.json?.data?.author?.username}, comments=${r.json?.data?.comments?.length}`
  );

  // 8. Admin comments on the post -> 201
  r = await call('POST', `/blog/${postId}/comments`, {
    token: tokenAdmin,
    body: { body: 'Nice post, this comment was created during the API test!' },
  });
  record(
    'Admin comments on the post',
    'POST', `/api/blog/${postId}/comments`, true, 201, r.status,
    r.status === 201 && r.json?.data?.author?.username === 'admin',
    `author=${r.json?.data?.author?.username}`
  );

  // 8b. GET comments for the post (public) -> 200 with populated author
  r = await call('GET', `/blog/${postId}/comments`);
  const commentList = r.json?.data || [];
  record(
    'GET comments for a post (public, populated username)',
    'GET', `/api/blog/${postId}/comments`, false, 200, r.status,
    r.status === 200 && commentList.length >= 1 && commentList[0]?.author?.username === 'admin',
    `count=${commentList.length}, author=${commentList[0]?.author?.username}`
  );

  // 9. author2 (non-author) PUT the post -> 403
  r = await call('PUT', `/blog/${postId}`, {
    token: token2,
    body: { title: 'Hacked Title' },
  });
  record(
    'Non-author PUT post rejected',
    'PUT', `/api/blog/${postId}`, true, 403, r.status,
    r.status === 403,
    `message=${r.json?.message}`
  );

  // 9b. author2 (non-author) DELETE the post -> 403
  r = await call('DELETE', `/blog/${postId}`, { token: token2 });
  record(
    'Non-author DELETE post rejected',
    'DELETE', `/api/blog/${postId}`, true, 403, r.status,
    r.status === 403,
    `message=${r.json?.message}`
  );

  // 10. Admin PUT the post -> 200
  r = await call('PUT', `/blog/${postId}`, {
    token: tokenAdmin,
    body: { title: 'Updated Test Post Title' },
  });
  record(
    'Admin (author) updates the post',
    'PUT', `/api/blog/${postId}`, true, 200, r.status,
    r.status === 200 && r.json?.data?.title === 'Updated Test Post Title',
    `title=${r.json?.data?.title}`
  );

  // 10b. Admin DELETE the second post -> 200
  r = await call('DELETE', `/blog/${post2Id}`, { token: tokenAdmin });
  record(
    'Admin deletes the second post',
    'DELETE', `/api/blog/${post2Id}`, true, 200, r.status,
    r.status === 200 && r.json?.success === true,
    `message=${r.json?.message}`
  );

  // 11. POST contact message -> 201
  r = await call('POST', '/contact', {
    body: { name: 'John Doe', email: 'john@example.com', message: 'Nice portfolio website!' },
  });
  record(
    'Submit contact form message',
    'POST', '/api/contact', false, 201, r.status,
    r.status === 201 && r.json?.success === true,
    `message=${r.json?.data?.message}`
  );

  // 11b. Contact with missing fields -> 400
  r = await call('POST', '/contact', {
    body: { name: '', email: 'a@b.com', message: '' },
  });
  record(
    'Contact form missing fields rejected',
    'POST', '/api/contact', false, 400, r.status,
    r.status === 400,
    `message=${r.json?.message}`
  );

  // 12. Register with empty fields -> 400
  r = await call('POST', '/users/register', {
    body: { username: '', email: '', password: '' },
  });
  record(
    'Registration with empty fields rejected',
    'POST', '/api/users/register', false, 400, r.status,
    r.status === 400,
    `message=${r.json?.message}`
  );

  // 12b. POST blog without token -> 401
  r = await call('POST', '/blog', { body: { title: 'X', content: 'Y' } });
  record(
    'Create blog post without token rejected',
    'POST', '/api/blog', false, 401, r.status,
    r.status === 401,
    `message=${r.json?.message}`
  );

  // Extra: GET single blog post with invalid ObjectId -> 404
  r = await call('GET', '/blog/notanobjectid');
  record(
    'GET invalid blog ObjectId rejected',
    'GET', '/api/blog/notanobjectid', false, 404, r.status,
    r.status === 404,
    `message=${r.json?.message}`
  );

  // Extra: comment on a nonexistent post -> 404
  r = await call('POST', '/blog/64b00000000000000000000/comments', {
    token: tokenAdmin,
    body: { body: 'orphan comment' },
  });
  record(
    'Comment on nonexistent post rejected',
    'POST', '/api/blog/64b00000000000000000000/comments', true, 404, r.status,
    r.status === 404,
    `message=${r.json?.message}`
  );

  // --- Summary -----------------------------------------------------------
  console.log('\n==========================================================');
  console.log(`PASS: ${pass}/${pass + fail}`);
  if (fail > 0) console.log(`FAILED CASES: ${fail}`);
  console.log('==========================================================');

  await new Promise((resolve) => server.close(resolve));
}

// --- Bootstrap ------------------------------------------------------------

connectDB()
  .then(() => seedDatabase())
  .then(() => clearDatabase())
  .then(() => runTests())
  .then(() => mongoose.connection.close())
  .then(() => process.exit(fail > 0 ? 1 : 0))
  .catch((error) => {
    console.error(`Test suite failed to run: ${error.message}`);
    process.exit(1);
  });
