/**
 * ============================================================================
 * BLOGCRAFT - DASHBOARD CONTROLLER
 * ============================================================================
 * Handles:
 * - Session guard (redirects guests to login)
 * - Computing author metrics (Total Posts, Total Views, Likes, Drafts)
 * - Table listing of author's posts with Edit & Delete operations
 */

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = window.blogStorage.getCurrentUser();

  // Authentication Guard
  if (!currentUser) {
    showToast('Please log in to access your dashboard.', 'error');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 800);
    return;
  }

  // Update greeting
  const greetingEl = document.getElementById('user-greeting');
  if (greetingEl) {
    greetingEl.textContent = `Welcome back, ${currentUser.name}!`;
  }

  renderDashboard();
});

function renderDashboard() {
  const currentUser = window.blogStorage.getCurrentUser();
  const allPosts = window.blogStorage.getPosts();

  const displayPosts = allPosts.filter((post) =>
    window.blogStorage.isPostOwnedByUser(post.id, currentUser)
  );

  // Calculate stats
  const totalPosts = displayPosts.length;
  const totalViews = displayPosts.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalLikes = displayPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
  const draftCount = displayPosts.filter((p) => p.status === 'draft').length;

  // Update stat cards
  const statPostsEl = document.getElementById('stat-total-posts');
  const statViewsEl = document.getElementById('stat-total-views');
  const statLikesEl = document.getElementById('stat-total-likes');
  const statDraftsEl = document.getElementById('stat-total-drafts');

  if (statPostsEl) statPostsEl.textContent = totalPosts;
  if (statViewsEl) statViewsEl.textContent = totalViews.toLocaleString();
  if (statLikesEl) statLikesEl.textContent = totalLikes.toLocaleString();
  if (statDraftsEl) statDraftsEl.textContent = draftCount;

  // Render Table Rows
  const tableBody = document.getElementById('posts-table-body');
  const emptyState = document.getElementById('dashboard-empty-state');

  if (!tableBody) return;

  if (displayPosts.length === 0) {
    tableBody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  tableBody.innerHTML = displayPosts
    .map((post) => {
      const isDraft = post.status === 'draft';
      const statusBadge = isDraft
        ? '<span class="badge badge-draft">Draft</span>'
        : '<span class="badge" style="background-color:#dcfce7; color:#15803d;">Published</span>';

      return `
      <tr>
        <td style="font-weight: 600; max-width: 300px;">
          <a href="post.html?id=${post.id}" style="color: inherit;" title="View article">
            ${escapeHtml(post.title)}
          </a>
        </td>
        <td><span class="badge">${escapeHtml(post.category)}</span></td>
        <td>${statusBadge}</td>
        <td>${post.views || 0}</td>
        <td>❤️ ${post.likes || 0}</td>
        <td>${formatDate(post.createdAt)}</td>
        <td>
          <div class="table-actions">
            <a href="create-blog.html?id=${post.id}" class="btn btn-outline btn-sm" title="Edit Article">
              ✏️ Edit
            </a>
            <button class="btn btn-outline btn-sm btn-delete-post" data-id="${post.id}" title="Delete Article" style="color: var(--danger); border-color: rgba(239, 68, 68, 0.3);">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
    })
    .join('');

  // Attach delete handlers
  document.querySelectorAll('.btn-delete-post').forEach((btn) => {
    btn.addEventListener('click', () => {
      const postId = btn.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
        if (!window.blogStorage.isPostOwnedByUser(postId, currentUser)) {
          showToast('You can only delete your own articles.', 'error');
          return;
        }

        if (window.blogStorage.deletePost(postId)) {
          showToast('Article deleted successfully.', 'success');
          renderDashboard();
        } else {
          showToast('This article could not be found.', 'error');
        }
      }
    });
  });
}
