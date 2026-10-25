/**
 * ============================================================================
 * BLOGCRAFT - HOME FEED SCRIPT
 * ============================================================================
 * Handles:
 * - Dynamic post feed rendering
 * - Category filter chips
 * - Live search filtering by title, content, or tags
 * - Like count incrementation
 */

document.addEventListener('DOMContentLoaded', () => {
  const postsGrid = document.getElementById('posts-grid');
  const searchInput = document.getElementById('search-input');
  const categoryChipsContainer = document.getElementById('category-chips');
  const resultsCounter = document.getElementById('results-count');

  if (!postsGrid) return;

  let currentCategory = 'All';
  let searchQuery = '';

  // Render initial posts
  function filterAndRender() {
    const allPosts = window.blogStorage.getPosts().filter((p) => p.status === 'published');

    const filtered = allPosts.filter((post) => {
      const matchesCategory = currentCategory === 'All' || post.category.toLowerCase() === currentCategory.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags && post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    });

    if (resultsCounter) {
      resultsCounter.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? 'article' : 'articles'}`;
    }

    if (filtered.length === 0) {
      postsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3>No articles found</h3>
          <p>Try refining your search keyword or selecting a different category.</p>
        </div>
      `;
      return;
    }

    postsGrid.innerHTML = filtered.map((post) => createPostCardHtml(post)).join('');
    bindCardEvents();
  }

  function createPostCardHtml(post) {
    const avatarInitials = post.author?.avatar || (post.author?.name ? post.author.name.substring(0, 2).toUpperCase() : 'AU');
    const formattedDate = formatDate(post.createdAt);

    return `
      <article class="blog-card" data-id="${post.id}">
        <div class="card-image-wrap">
          <img src="${escapeHtml(post.coverImage)}" alt="${escapeHtml(post.title)}" class="card-image" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'" />
          <span class="badge card-category-badge">${escapeHtml(post.category)}</span>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span>📅 ${formattedDate}</span>
            <span>•</span>
            <span>👁️ ${post.views || 0} views</span>
          </div>
          <h2 class="card-title">
            <a href="post.html?id=${post.id}">${escapeHtml(post.title)}</a>
          </h2>
          <p class="card-excerpt">${escapeHtml(post.excerpt)}</p>
          <div class="card-footer">
            <div class="card-author">
              <div class="author-avatar">${escapeHtml(avatarInitials)}</div>
              <div>
                <strong>${escapeHtml(post.author?.name || 'Anonymous')}</strong>
              </div>
            </div>
            <button class="btn btn-outline btn-sm like-btn" data-id="${post.id}" title="Like this post" style="padding: 0.3rem 0.65rem;">
              ❤️ <span class="like-count">${post.likes || 0}</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function bindCardEvents() {
    document.querySelectorAll('.like-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const postId = btn.getAttribute('data-id');
        const newLikes = window.blogStorage.incrementLikes(postId);
        const countSpan = btn.querySelector('.like-count');
        if (countSpan) countSpan.textContent = newLikes;
        btn.style.transform = 'scale(1.15)';
        setTimeout(() => (btn.style.transform = 'scale(1)'), 200);
        showToast('Thanks for liking this post!', 'success');
      });
    });
  }

  // Category filter clicks
  if (categoryChipsContainer) {
    categoryChipsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('chip-btn')) {
        categoryChipsContainer.querySelectorAll('.chip-btn').forEach((c) => c.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.getAttribute('data-category');
        filterAndRender();
      }
    });
  }

  // Live Search listener (debounced)
  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchQuery = e.target.value.trim();
        filterAndRender();
      }, 250);
    });
  }

  // Initial render
  filterAndRender();
});
