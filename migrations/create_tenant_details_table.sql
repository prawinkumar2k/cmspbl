-- Create tenant_details table for lead management
CREATE TABLE IF NOT EXISTS tenant_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  hsc_reg_no VARCHAR(50),
  source VARCHAR(100),
  city VARCHAR(100),
  status ENUM('New', 'Interested', 'Converted', 'Partially Converted', 'Rejected', 'Close') DEFAULT 'New',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert some sample data for testing
INSERT INTO tenant_details (student_name, phone, hsc_reg_no, source, city, status) VALUES
('Rahul Kumar', '9876543210', 'MH123456', 'Walk-in', 'Mumbai', 'Interested'),
('Anjali Mehta', '9876543211', 'KA789012', 'Website', 'Bangalore', 'New'),
('Pooja Singh', '9876543212', 'DL345678', 'Social Media', 'Delhi', 'Converted'),
('Aditya Patel', '9876543213', 'MH567890', 'Staff Reference', 'Pune', 'Interested'),
('Divya Gupta', '9876543214', 'TG901234', 'Advertisement', 'Hyderabad', 'New');