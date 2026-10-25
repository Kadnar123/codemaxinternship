/**
 * ============================================================================
 * BLOGCRAFT - CREATE & EDIT BLOG CONTROLLER
 * ============================================================================
 * Handles:
 * - Creating new articles & editing existing ones
 * - Live cover image preview
 * - Dynamic word count & estimated read time calculator
 * - Publish vs Save Draft states
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('blog-editor-form');
  const titleInput = document.getElementById('post-title');
  const categorySelect = document.getElementById('post-category');
  const excerptInput = document.getElementById('post-excerpt');
  const contentInput = document.getElementById('post-content');
  const imageInput = document.getElementById('post-image-url');
  const tagsInput = document.getElementById('post-tags');
  const previewBox = document.getElementById('image-preview');

  const wordCountDisplay = document.getElementById('word-count-badge');
  const readTimeDisplay = document.getElementById('read-time-badge');
  const pageHeading = document.getElementById('editor-heading');

  // Check if we are in Edit Mode
  const urlParams = new URLSearchParams(window.location.search);
  const editPostId = urlParams.get('id');
  let isEditMode = false;
  const currentUser = window.blogStorage.getCurrentUser();

  if (!currentUser) {
    showToast('Please log in before creating or editing an article.', 'error');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 800);
    return;
  }

  if (editPostId) {
    const existingPost = window.blogStorage.getPostById(editPostId);
    if (!existingPost || !window.blogStorage.isPostOwnedByUser(editPostId, currentUser)) {
      showToast('This article does not exist or you do not have permission to edit it.', 'error');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
      return;
    }

    isEditMode = true;
    if (pageHeading) pageHeading.textContent = 'Edit Blog Post';

    titleInput.value = existingPost.title || '';
    categorySelect.value = existingPost.category || 'Technology';
    excerptInput.value = existingPost.excerpt || '';
    contentInput.value = existingPost.content || '';
    imageInput.value = existingPost.coverImage || '';
    tagsInput.value = (existingPost.tags || []).join(', ');

    updateImagePreview(existingPost.coverImage);
    updateMetrics();
  }

  // Cover image URL live preview
  if (imageInput && previewBox) {
    imageInput.addEventListener('input', () => {
      updateImagePreview(imageInput.value.trim());
    });
  }

  function updateImagePreview(url) {
    if (url && isValidUrl(url)) {
      previewBox.innerHTML = `<img src="${escapeHtml(url)}" alt="Cover Preview" onerror="this.parentElement.innerHTML='<span style=\\'color:var(--danger);\\'>Invalid Image URL</span>'"/>`;
    } else {
      previewBox.innerHTML = '<span>No cover image selected</span>';
    }
  }

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Dynamic Word Count & Reading Time Calculation
  if (contentInput) {
    contentInput.addEventListener('input', updateMetrics);
  }

  function updateMetrics() {
    const text = contentInput.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    if (wordCountDisplay) wordCountDisplay.textContent = `${words} words`;
    if (readTimeDisplay) readTimeDisplay.textContent = `${readingTime} min read`;
  }

  // Form submission handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      savePost('published');
    });

    const draftBtn = document.getElementById('save-draft-btn');
    if (draftBtn) {
      draftBtn.addEventListener('click', () => {
        savePost('draft');
      });
    }
  }

  function savePost(status) {
    const title = titleInput.value.trim();
    const category = categorySelect.value;
    const excerpt = excerptInput.value.trim();
    const content = contentInput.value.trim();
    const coverImage =
      imageInput.value.trim() ||
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80';
    const tags = tagsInput.value
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // Validation
    if (!title) {
      showToast('Please enter an article title.', 'error');
      titleInput.focus();
      return;
    }

    if (!content) {
      showToast('Please write some content for your article.', 'error');
      contentInput.focus();
      return;
    }

    const postPayload = {
      title,
      category,
      excerpt: excerpt || content.substring(0, 140) + '...',
      content,
      coverImage,
      tags: tags.length > 0 ? tags : [category],
      status,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.name.substring(0, 2).toUpperCase()
      }
    };

    if (isEditMode) {
      const updatedPost = window.blogStorage.updatePost(editPostId, postPayload);
      if (!updatedPost) {
        showToast('This article could not be found and was not updated.', 'error');
        return;
      }
      showToast('Article updated successfully!', 'success');
    } else {
      window.blogStorage.createPost(postPayload);
      showToast(status === 'draft' ? 'Draft saved!' : 'Article published!', 'success');
    }

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 700);
  }
});
