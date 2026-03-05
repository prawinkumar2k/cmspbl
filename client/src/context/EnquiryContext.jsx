import React, { createContext, useContext, useState, useEffect } from 'react';

const EnquiryContext = createContext();

const MOCK_ENQUIRIES = [
  {
    id: 'ENQ001',
    date: '2024-01-15',
    studentName: 'Rahul Kumar',
    mobile: '9876543210',
    whatsapp: '9876543210',
    email: 'rahul@email.com',
    city: 'Mumbai',
    address: '123 Main Street',
    school: 'St. Xavier\'s High School',
    schoolType: 'Private',
    board: 'CBSE',
    hscRegNo: 'MH123456',
    yearOfPassing: '2024',
    marks: '85',
    course: 'B.Tech - Computer Science',
    hostelRequired: 'Yes',
    transportRequired: 'Yes',
    transportArea: 'Andheri West',
    source: 'Walk-in',
    referenceNum: '',
    sourceArea: 'Campus',
    status: 'Interested',
    assignedCaller: 'Priya Sharma',
    lastFollowUp: '2024-01-18',
  },
  {
    id: 'ENQ002',
    date: '2024-01-16',
    studentName: 'Anjali Mehta',
    mobile: '9876543211',
    whatsapp: '9876543211',
    email: 'anjali@email.com',
    city: 'Bangalore',
    address: '456 Park Road',
    school: 'Delhi Public School',
    schoolType: 'Private',
    board: 'ICSE',
    hscRegNo: 'KA789012',
    yearOfPassing: '2024',
    marks: '92',
    course: 'B.Tech - Electronics',
    hostelRequired: 'No',
    transportRequired: 'No',
    transportArea: '',
    source: 'Website',
    referenceNum: '',
    sourceArea: 'Online',
    status: 'New',
    assignedCaller: 'Vikram Singh',
    lastFollowUp: '2024-01-16',
  },
  {
    id: 'ENQ003',
    date: '2024-01-17',
    studentName: 'Pooja Singh',
    mobile: '9876543212',
    whatsapp: '9876543212',
    email: 'pooja@email.com',
    city: 'Delhi',
    address: '789 Empire Street',
    school: 'Ryan International',
    schoolType: 'Private',
    board: 'CBSE',
    hscRegNo: 'DL345678',
    yearOfPassing: '2024',
    marks: '78',
    course: 'B.Tech - Mechanical Engineering',
    hostelRequired: 'Yes',
    transportRequired: 'Yes',
    transportArea: 'South Delhi',
    source: 'Social Media',
    referenceNum: '',
    sourceArea: 'Instagram',
    status: 'Converted',
    assignedCaller: 'Priya Sharma',
    lastFollowUp: '2024-01-19',
  },
  {
    id: 'ENQ004',
    date: '2024-01-18',
    studentName: 'Aditya Patel',
    mobile: '9876543213',
    whatsapp: '9876543213',
    email: 'aditya@email.com',
    city: 'Pune',
    address: '321 Tech Park',
    school: 'JNV Pune',
    schoolType: 'Government',
    board: 'State Board',
    hscRegNo: 'MH567890',
    yearOfPassing: '2023',
    marks: '88',
    course: 'B.Tech - Civil Engineering',
    hostelRequired: 'Yes',
    transportRequired: 'No',
    transportArea: '',
    source: 'Staff Reference',
    referenceNum: 'Mr. Rajesh Kumar',
    sourceArea: 'Campus',
    status: 'Partial',
    assignedCaller: 'Vikram Singh',
    lastFollowUp: '2024-01-17',
  },
  {
    id: 'ENQ005',
    date: '2024-01-19',
    studentName: 'Divya Gupta',
    mobile: '9876543214',
    whatsapp: '9876543214',
    email: 'divya@email.com',
    city: 'Hyderabad',
    address: '654 IT City',
    school: 'Narayana Educational Institutions',
    schoolType: 'Private',
    board: 'CBSE',
    hscRegNo: 'TG901234',
    yearOfPassing: '2024',
    marks: '95',
    course: 'B.Tech - Computer Science',
    hostelRequired: 'No',
    transportRequired: 'Yes',
    transportArea: 'Kukatpally',
    source: 'Advertisement',
    referenceNum: '',
    sourceArea: 'TV Ad',
    status: 'Interested',
    assignedCaller: 'Priya Sharma',
    lastFollowUp: '2024-01-19',
  },
];

const MOCK_LEADS = [
  // Mock data removed - now fetched from API
];

const MOCK_CALLERS = [
  {
    id: 'CALLER001',
    name: 'Priya Sharma',
    role: 'Senior Caller',
    phone: '9876543220',
    assignedLeads: ['LEAD001', 'LEAD003'],
    totalCalls: 45,
    conversionRate: 35,
  },
  {
    id: 'CALLER002',
    name: 'Vikram Singh',
    role: 'Caller',
    phone: '9876543221',
    assignedLeads: ['LEAD002'],
    totalCalls: 28,
    conversionRate: 22,
  },
  {
    id: 'CALLER003',
    name: 'Neha Kapoor',
    role: 'Caller',
    phone: '9876543222',
    assignedLeads: [],
    totalCalls: 12,
    conversionRate: 18,
  },
];

export function EnquiryProvider({ children }) {
  const [enquiries, setEnquiries] = useState(MOCK_ENQUIRIES);
  const [leads, setLeads] = useState([]);
  const [callers, setCallers] = useState(MOCK_CALLERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/leadManagement');
        if (!response.ok) {
          throw new Error('Failed to fetch leads');
        }
        const data = await response.json();
        setLeads(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching leads:', err);
        setError(err.message);
        // Fallback to mock data if API fails
        setLeads(MOCK_LEADS);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const addEnquiry = (enquiry) => {
    const newEnquiry = {
      ...enquiry,
      id: `ENQ${String(enquiries.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'New',
      assignedCaller: '',
      lastFollowUp: new Date().toISOString().split('T')[0],
    };
    setEnquiries([...enquiries, newEnquiry]);
    return newEnquiry;
  };

  const updateEnquiry = (id, updatedEnquiry) => {
    setEnquiries(enquiries.map(e => e.id === id ? { ...e, ...updatedEnquiry } : e));
  };

  const addLead = (lead) => {
    const newLead = {
      ...lead,
      id: `LEAD${String(leads.length + 1).padStart(3, '0')}`,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'New',
      callHistory: [],
    };
    setLeads([...leads, newLead]);
    return newLead;
  };

  const updateLead = async (id, updatedLead) => {
    try {
      // Update local state optimistically
      setLeads(leads.map(l => l.id === id ? { ...l, ...updatedLead } : l));

      // Update on server
      const response = await fetch(`/api/leadManagement/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLead),
      });

      if (!response.ok) {
        throw new Error('Failed to update lead on server');
      }
    } catch (err) {
      console.error('Error updating lead:', err);
      // Revert optimistic update on error
      // You might want to refetch data here
    }
  };

  const addCallNote = (leadId, callNote) => {
    setLeads(leads.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          callHistory: [
            ...l.callHistory,
            {
              ...callNote,
              id: `CALL${String(l.callHistory.length + 1).padStart(3, '0')}`,
            },
          ],
        };
      }
      return l;
    }));
  };

  const value = {
    enquiries,
    leads,
    callers,
    loading,
    error,
    addEnquiry,
    updateEnquiry,
    addLead,
    updateLead,
    addCallNote,
  };

  return (
    <EnquiryContext.Provider value={value}>
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error('useEnquiry must be used within EnquiryProvider');
  }
  return context;
}
