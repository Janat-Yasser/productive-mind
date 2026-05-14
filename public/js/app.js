/* =============================================
   PRODUCTIVE MIND — Frontend JS
   ============================================= */

// ── Flash message auto-dismiss ───────────────
document.querySelectorAll('.flash').forEach(el => {
  setTimeout(() => {
    el.style.transition = 'opacity 0.5s ease';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 500);
  }, 4000);
});

// ── Toggle task status via AJAX ───────────────
async function toggleStatus(taskId, currentStatus) {
  const newStatus = currentStatus === 'done' ? 'todo' : 'done';
  await patchStatus(taskId, newStatus);
}

async function changeStatus(taskId, newStatus) {
  await patchStatus(taskId, newStatus);
}

async function patchStatus(taskId, newStatus) {
  try {
    const res = await fetch(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      // Reload to reflect updated state
      window.location.reload();
    } else {
      console.error('Failed to update task status');
    }
  } catch (err) {
    console.error('Network error:', err);
  }
}

// ── Confirm delete ────────────────────────────
document.querySelectorAll('[data-confirm]').forEach(el => {
  el.addEventListener('click', e => {
    if (!confirm(el.dataset.confirm)) e.preventDefault();
  });
});

// ── Sidebar active link highlight ────────────
(function () {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href && path === href) {
      link.classList.add('active');
    }
  });
})();

// ── Due date: set min to today ────────────────
const dueDateInput = document.getElementById('dueDate');
if (dueDateInput && !dueDateInput.value) {
  const today = new Date().toISOString().split('T')[0];
  dueDateInput.min = today;
}

// ── Recurring toggle ──────────────────────────
function toggleRecurring(cb) {
  const opts = document.getElementById('recurringOptions');
  if (opts) opts.style.display = cb.checked ? 'block' : 'none';
}

// ── Keyboard shortcuts ────────────────────────
document.addEventListener('keydown', e => {
  // Ctrl/Cmd + K → focus search if present
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    const search = document.querySelector('.filter-search');
    if (search) { e.preventDefault(); search.focus(); }
  }
  // Ctrl/Cmd + N → add new task
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    const addBtn = document.querySelector('.btn-add');
    if (addBtn) { e.preventDefault(); window.location.href = addBtn.href; }
  }
  // Escape → blur focus
  if (e.key === 'Escape') document.activeElement?.blur();
});

// ── Progress bar animate on load ─────────────
window.addEventListener('load', () => {
  const bar = document.querySelector('.progress-bar');
  if (bar) {
    const target = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = target; }, 100);
  }
});

// ── Tooltip on truncated kanban titles ────────
document.querySelectorAll('.kanban-card-title').forEach(el => {
  if (el.scrollWidth > el.clientWidth) {
    el.title = el.textContent.trim();
  }
});

// ── Mobile sidebar toggle ─────────────────────
(function () {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('sidebar-open');
    });
    // Close on outside click
    document.addEventListener('click', e => {
      if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('sidebar-open');
      }
    });
  }
})();
