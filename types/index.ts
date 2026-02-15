export interface Application {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  email?: string;
  city: string;
  occupation: 'Professional' | 'Housewife' | 'Business' | 'Student';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  payment_status: 'pending' | 'completed' | 'failed';
  application_status: 'payment_pending' | 'payment_done' | 'added_to_course';
  reference_number: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface StatusUpdate {
  id: string;
  application_id: string;
  old_status?: string;
  new_status: string;
  remark?: string;
  updated_by?: string;
  created_at: string;
}

export interface ApplicationAnalytics {
  date: string;
  total_applications: number;
  payment_pending: number;
  payment_done: number;
  added_to_course: number;
  payments_completed: number;
}

export interface RegistrationFormData {
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  email?: string;
  city: string;
  occupation: 'Professional' | 'Housewife' | 'Business' | 'Student';
}

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface PaymentVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  application_id: string;
}
