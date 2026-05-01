export const ROLES = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    EXECUTIVE: 'EXECUTIVE',
    ACCOUNTS: 'ACCOUNTS',
  };
  
  export const PERMISSIONS = {
    ADMIN: [
      'view_revenue',
      'delete_customer',
      'edit_customer',
      'view_analytics',
      'manage_users',
      'view_all_leads',
      'send_sms_email',
      'export_csv',
    ],
    MANAGER: [
      'view_revenue',
      'edit_customer',
      'view_analytics',
      'view_all_leads',
      'send_sms_email',
      'export_csv',
    ],
    EXECUTIVE: [
      'view_leads',
      'add_lead',
      'view_customers',
      'send_sms_email',
    ],
    ACCOUNTS: [
      'view_revenue',
      'view_analytics',
      'export_csv',
      'view_customers',
    ],
  };
  
  export function hasPermission(role, permission) {
    if (!role || !PERMISSIONS[role]) return false;
    return PERMISSIONS[role].includes(permission);
  }