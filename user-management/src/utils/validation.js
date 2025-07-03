export function validateUser(user) {
    const errors = {};
  
    if (!user.first_name?.trim()) errors.first_name = "First name is required";
    if (!user.last_name?.trim()) errors.last_name = "Last name is required";
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))
      errors.email = "Invalid email";
  
    if (!/^\d{10}$/.test(user.phone))
      errors.phone = "Phone must be 10 digits";
  
    if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(user.pan))
      errors.pan = "Invalid PAN format (e.g., ABCDE1234F)";
  
    return errors;
  }
  