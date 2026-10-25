/**
 * ============================================================================
 * BLOGCRAFT - POST DETAIL CONTROLLER
 * ============================================================================
 * Handles rendering single article reading view from URL query `?id=...`
 */

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  const container = document.getElementById('post-content-container');
  if (!container) return;

  if (!postId) {
    renderNotFound(container);
    return;
  }

  const post = window.blogStorage.getPostById(postId);
  if (
    !post ||
    (post.status === 'draft' && !window.blogStorage.isPostOwnedByUser(postId, window.blogStorage.getCurrentUser()))
  ) {
    renderNotFound(container);
    return;
  }

  // Increment views
  post.views = (post.views || 0) + 1;
  window.blogStorage.updatePost(postId, { views: post.views });

  // Update page document title
  document.title = `${post.title} | BlogCraft`;

  const avatarInitials = post.author?.avatar || (post.author?.name ? post.author.name.substring(0, 2).toUpperCase() : 'AU');

  container.innerHTML = `
    <article class="post-detail-wrap">
      <div style="margin-bottom: 1.5rem;">
        <a href="index.html" class="btn btn-outline btn-sm">← Back to Articles</a>
      </div>

      <header class="post-header">
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.75rem;">
          <span class="badge">${escapeHtml(post.category)}</span>
          <span style="color: var(--text-muted); font-size: 0.85rem;">• ${formatDate(post.createdAt)}</span>
          <span style="color: var(--text-muted); font-size: 0.85rem;">• 👁️ ${post.views} views</span>
        </div>

        <h1 class="post-detail-title">${escapeHtml(post.title)}</h1>

        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--border-color); border-top: 1px solid var(--border-color);">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="author-avatar" style="width: 44px; height: 44px; font-size: 1rem;">${escapeHtml(avatarInitials)}</div>
            <div>
              <div style="font-weight: 700;">${escapeHtml(post.author?.name || 'Anonymous')}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(post.author?.email || '')}</div>
            </div>
          </div>
          <div>
            <button id="post-like-btn" class="btn btn-outline btn-sm" style="font-size: 0.95rem;">
              ❤️ <span id="post-like-count">${post.likes || 0}</span> Likes
            </button>
          </div>
        </div>
      </header>

      ${post.coverImage ? `<img src="${escapeHtml(post.coverImage)}" alt="${escapeHtml(post.title)}" class="post-hero-image" onerror="this.style.display='none'"/>` : ''}

      <div class="post-body">
        ${formatPostContent(post.content)}
      </div>

      ${
        post.tags && post.tags.length > 0
          ? `
        <div style="margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
          <strong style="font-size: 0.9rem; color: var(--text-muted);">Tags:</strong>
          ${post.tags.map((t) => `<span class="badge">${escapeHtml(t)}</span>`).join('')}
        </div>
      `
          : ''
      }
    </article>
  `;

  // Like button handling
  const likeBtn = document.getElementById('post-like-btn');
  if (likeBtn) {
    likeBtn.addEventListener('click', () => {
      const newCount = window.blogStorage.incrementLikes(postId);
      const countEl = document.getElementById('post-like-count');
      if (countEl) countEl.textContent = newCount;
      likeBtn.classList.remove('btn-outline');
      likeBtn.classList.add('btn-primary');
      showToast('You liked this article!', 'success');
    });
  }
});

function renderNotFound(container) {
  container.innerHTML = `
    <div style="text-align: center; padding: 6rem 1rem;">
      <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">Article Not Found</h2>
      <p style="color: var(--text-muted); margin-bottom: 1.5rem;">The article you are looking for does not exist or was deleted.</p>
      <a href="index.html" class="btn btn-primary">Return to Home</a>
    </div>
  `;
}

function formatPostContent(raw) {
  if (!raw) return '';
  // Basic markdown header & block formatting for clean reading
  return escapeHtml(raw)
    .replace(/^### (.*$)/gim, '<h3 style="margin: 1.5rem 0 0.5rem; font-size: 1.35rem;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="margin: 1.75rem 0 0.75rem; font-size: 1.6rem;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="margin: 2rem 0 1rem; font-size: 1.85rem;">$1</h1>')
    .replace(/```([\s\S]*?)```/gim, '<pre style="background:var(--bg-surface-alt); padding:1rem; border-radius:var(--radius-md); overflow-x:auto; margin:1rem 0; font-family:monospace; border:1px solid var(--border-color);"><code>$1</code></pre>');
}
