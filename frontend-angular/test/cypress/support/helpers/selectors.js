// ============================================
// Helper: Selectores de elementos
// ============================================

export const selectors = {
  // Autenticación
  auth: {
    loginForm: '[data-testid="login-form"]',
    emailInput: 'input[name="email"]',
    passwordInput: 'input[name="password"]',
    submitButton: 'button[type="submit"]',
    errorMessage: '[data-testid="error-message"]',
    userMenu: '[data-testid="user-menu"]',
    logoutButton: '[data-testid="logout-button"]',
  },
  
  // Navegación
  navigation: {
    sidebar: '[data-testid="sidebar"]',
    topbar: '[data-testid="topbar"]',
    menuButton: '[data-testid="menu-button"]',
    homeLink: 'a[href="/dashboard"]',
  },
  
  // Tabla de datos
  table: {
    container: '[data-testid="data-table"]',
    rows: 'tbody tr',
    cells: 'td',
    header: 'thead th',
    emptyState: '[data-testid="empty-state"]',
  },
  
  // Modales y diálogos
  modal: {
    container: '[role="dialog"]',
    title: '[data-testid="modal-title"]',
    closeButton: '[data-testid="modal-close"]',
    confirmButton: '[data-testid="modal-confirm"]',
    cancelButton: '[data-testid="modal-cancel"]',
  },
  
  // Botones comunes
  buttons: {
    save: 'button[type="submit"], button:contains("Guardar")',
    cancel: 'button:contains("Cancelar")',
    delete: 'button:contains("Eliminar")',
    edit: 'button:contains("Editar")',
    add: 'button:contains("Agregar"), button:contains("Nuevo")',
  },
  
  // Formularios
  forms: {
    input: 'input[type="text"]',
    select: 'select',
    textarea: 'textarea',
    checkbox: 'input[type="checkbox"]',
    radio: 'input[type="radio"]',
  },
  
  // Alertas y notificaciones
  notifications: {
    toast: '[data-testid="toast"]',
    alert: '[role="alert"]',
    success: '[data-testid="success-message"]',
    error: '[data-testid="error-message"]',
    warning: '[data-testid="warning-message"]',
  },
  
  // Carga
  loading: {
    spinner: '[data-testid="loading-spinner"]',
    skeleton: '[data-testid="skeleton"]',
    progress: '[data-testid="progress-bar"]',
  },
};
