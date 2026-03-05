import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import DataTable from '../../../../../components/DataTable/DataTable';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Icon } from "@iconify/react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../../../../components/css/style.css";
import Navbar from "../../../../../components/Navbar";
import Sidebar from "../../../../../components/Sidebar";
import Footer from "../../../../../components/footer";

const AddBook = () => {
  // State for form data (only fields from library_books table)
  const [formData, setFormData] = useState({
    bookId: '',
    title: '',
    author: '',
    isbn: '',
    category: '',
    language: '',
    publisher: '',
    edition: '',
    publicationYear: '',
    pages: '',
    price: '',
    quantity: '',
    rack: '',
    position: '',
    status: 'Available',
    description: '',
    bookCover: null,
    coverPreview: ''
  });

  // State for all books (table view)
  const [books, setBooks] = useState([]);
  const [showBooksTable, setShowBooksTable] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [booksError, setBooksError] = useState(null);
  const booksTableRef = React.useRef(null);
  const formRef = useRef(null);

  // State for categories from database
  const [categories, setCategories] = useState([]);

  // State for add category modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Tab state
  const [activeTab, setActiveTab] = useState('basic');

  // File input ref for book cover
  const fileInputRef = useRef(null);

  // Fetch next available Book ID from backend
  const fetchNextBookId = async () => {
    try {
      const res = await fetch('/api/library/books/next-id');
      if (!res.ok) throw new Error('Failed to fetch next Book ID');
      const data = await res.json();
      setFormData(prev => ({ ...prev, bookId: data.nextBookId || 'ERP-001' }));
    } catch {
      setFormData(prev => ({ ...prev, bookId: 'ERP-001' }));
    }
  };

  // Fetch all books for table view
  const fetchAllBooks = async () => {
    setLoadingBooks(true);
    setBooksError(null);
    try {
      const res = await fetch('/api/library/books');
      if (!res.ok) throw new Error('Failed to fetch books');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
      }
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      setBooksError(err.message || 'Error fetching books');
      setBooks([]);
    } finally {
      setLoadingBooks(false);
    }
  };

  // Fetch books when table is shown
  useEffect(() => {
    if (showBooksTable) fetchAllBooks();
  }, [showBooksTable]);

  // Fetch categories from database
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/masterData/category-master');
      if (!res.ok) {
        console.warn('Failed to fetch categories from server');
        return;
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data);
      } else {
        console.warn('Invalid data structure:', data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Don't show error toast - just use empty categories array
    }
  };

  // Handle adding new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      const res = await fetch('/api/masterData/category-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_name: newCategoryName.trim() })
      });

      if (!res.ok) {
        throw new Error('Failed to add category');
      }

      const data = await res.json();

      if (data.success) {
        toast.success('Category added successfully!');
        // Refresh categories list
        await fetchCategories();
        // Set the newly added category as selected
        setFormData(prev => ({ ...prev, category: newCategoryName.trim() }));
        // Close modal and reset input
        setShowCategoryModal(false);
        setNewCategoryName('');
      } else {
        toast.error(data.message || 'Failed to add category');
      }
    } catch (err) {
      console.error('Error adding category:', err);
      toast.error('Error adding category: ' + err.message);
    }
  };

  useEffect(() => {
    fetchNextBookId();
    fetchCategories();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'bookId') return;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Helper for single tab validation
  const validateTab = (tab = activeTab) => {
    const fieldMapping = {
      basic: {
        title: 'Title',
        author: 'Author',
        category: 'Category',
        language: 'Language'
      },
      additional: {
        publisher: 'Publisher',
        price: 'Price',
        status: 'Status'
      },
      inventory: {
        quantity: 'Quantity',
        rack: 'Rack',
        position: 'Position'
      }
    };

    const tabFields = fieldMapping[tab];
    if (!tabFields) return true;

    for (const [key, label] of Object.entries(tabFields)) {
      if (!formData[key]) {
        toast.error(`Please fill the required field: ${label.toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  // Switch tabs with validation
  const handleTabSwitch = (newTab) => {
    // Determine which tabs to validate based on current and target
    if (activeTab === 'basic' && (newTab === 'additional' || newTab === 'inventory')) {
      if (!validateTab('basic')) return;
    }
    if (activeTab === 'additional' && newTab === 'inventory') {
      if (!validateTab('additional')) return;
    }

    setActiveTab(newTab);
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      bookId: '',
      title: '',
      author: '',
      isbn: '',
      category: '',
      language: '',
      publisher: '',
      edition: '',
      publicationYear: '',
      pages: '',
      price: '',
      quantity: '',
      rack: '',
      position: '',
      status: 'Available',
      description: '',
      bookCover: null,
      coverPreview: ''
    });
    setIsEditMode(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.success('Form reset successfully!');
  };


  // Submit handler to connect to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate across all tabs
      if (!validateTab('basic')) {
        setActiveTab('basic');
        return;
      }
      if (!validateTab('additional')) {
        setActiveTab('additional');
        return;
      }
      if (!validateTab('inventory')) {
        setActiveTab('inventory');
        return;
      }

      // Validate image (only for add, not edit)
      if (!isEditMode && !formData.bookCover) {
        toast.error('Please select a book cover image.');
        return;
      }
      // Prepare FormData (only fields in library_books)
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'coverPreview') return;
        if (key === 'bookCover' && value) {
          fd.append('bookCover', value);
        } else {
          fd.append(key, value);
        }
      });

      // Debug: Log FormData content
      console.log('📦 FormData being sent:');
      for (let [key, value] of fd.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }

      toast.loading('Saving book details...');
      let res;
      if (isEditMode) {
        // Update book (PUT)
        res = await fetch(`/api/library/books/update/${formData.bookId}`, {
          method: 'PUT',
          body: fd
        });
      } else {
        // Add new book
        res = await fetch('/api/library/books/add', {
          method: 'POST',
          body: fd
        });
      }
      toast.dismiss();
      if (!res.ok) {
        let errorMsg = isEditMode ? 'Failed to update book' : 'Failed to add book';
        try {
          const data = await res.json();
          errorMsg = data.message || errorMsg;
        } catch {
          try {
            const text = await res.text();
            if (text && text.startsWith('<!DOCTYPE')) {
              errorMsg = 'Server error: received HTML instead of JSON.';
            } else if (text) {
              errorMsg = text;
            }
          } catch {
            // Intentionally ignored
          }
        }
        toast.error(errorMsg);
        return;
      }
      toast.success(isEditMode ? 'Book updated successfully!' : 'Book added successfully!');
      // Reset form and fetch next Book ID
      handleReset();
      fetchNextBookId();
      if (showBooksTable) fetchAllBooks();
    } catch (err) {
      toast.dismiss();
      toast.error('Error: ' + err.message);
    }
  };

  // View button color state
  const navigate = useNavigate();

  // Edit handler: populate form with selected book
  const handleEditBook = (book) => {
    // ISBN robust
    const isbn = book.ISBN || book.isbn || book.Isbn || book['isbn13'] || book['ISBN-13'] || book['isbn_13'] || '';
    // Language robust and match select options
    let language = book.Language || book.language || book.lang || book['BookLanguage'] || book['book_language'] || '';
    if (language !== 'Tamil' && language !== 'English') language = '';
    // Edition robust
    const edition = book.Edition || book.edition || book.editionName || book['EditionName'] || book['edition_name'] || '';
    // Pages robust
    let pages = '';
    if (book.Pages !== undefined && book.Pages !== null) pages = String(book.Pages);
    else if (book.pages !== undefined && book.pages !== null) pages = String(book.pages);
    else if (book.NumberOfPages !== undefined && book.NumberOfPages !== null) pages = String(book.NumberOfPages);
    else if (book.number_of_pages !== undefined && book.number_of_pages !== null) pages = String(book.number_of_pages);
    // Publisher robust
    const publisher = book.Publisher || book.publisher || book['PublisherName'] || book['publisher_name'] || '';
    // Year robust
    const publicationYear = book.PublishedYear || book.publicationYear || book.YearOfPublication || book.yearOfPublication || book['published_year'] || '';
    // Rack robust
    const rack = book.Rack || book.rack || book.ShelfNumber || book.shelf_number || '';
    // Position robust
    let position = '';
    if (book.Position !== undefined && book.Position !== null) position = String(book.Position);
    else if (book.position !== undefined && book.position !== null) position = String(book.position);
    // Description robust
    const description = book.Remark || book.description || book['Description'] || '';
    setFormData({
      bookId: book.book_id || book.bookId || '',
      title: book.title || book.BookTitle || '',
      author: book.author || book.Author || '',
      isbn,
      category: book.category || book.Category || '',
      language,
      publisher,
      edition,
      publicationYear,
      pages,
      price: (book.price !== undefined && book.price !== null)
        ? String(book.price)
        : (book.Price !== undefined && book.Price !== null ? String(book.Price) : ''),
      quantity: (book.quantity !== undefined && book.quantity !== null)
        ? String(book.quantity)
        : (book.Quantity !== undefined && book.Quantity !== null ? String(book.Quantity) : ''),
      description,
      bookCover: null,
      coverPreview: '',
      rack,
      position,
      status: book.status || '',
    });
    setIsEditMode(true);
    setActiveTab('basic');
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    toast.success('Book loaded for modification');
  };

  // Close handler: navigate to main admin dashboard
  const handleClose = () => {
    navigate('/admin/adminDashboard');
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            {/* View/Hide Books Button */}


            {/* Header */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">{isEditMode ? 'Edit Book Details' : 'Add Book Details'}</h6>
            </div>
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">

              <div>
                <h6 className="text-lg fw-semibold mb-2">{isEditMode ? 'Edit Book Details' : 'Add Book Details'}</h6>
                <span className="text-sm fw-medium text-secondary-light">
                  {isEditMode ? 'Edit book details' : 'Add book details'}
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className={`btn btn-outline-sm ${showBooksTable ? 'btn-outline-success' : 'btn-outline-info'}`}
                  onClick={() => setShowBooksTable(!showBooksTable)}
                  title={showBooksTable ? 'Hide Books Table' : 'Show Books Table'}
                >
                  <i className={`fas ${showBooksTable ? 'fa-eye-slash' : 'fa-users'} me-1`}></i>
                  {showBooksTable ? 'Hide Books' : 'View Books'}
                </button>
              </div>
            </div>


            {/* Form Card */}
            <div ref={formRef} className="card h-100 p-0 radius-12">
              {/* Tab Navigation */}
              <div className="card-header border-bottom-0 p-24 pb-0 d-flex align-items-center justify-content-between gap-3" style={{ flexWrap: 'nowrap' }}>
                <div className="nav-tabs-wrapper" style={{ flex: 1, minWidth: 0 }}>
                  <nav className="nav nav-tabs flex-nowrap gap-3" role="tablist">
                    <button
                      className={`nav-link px-20 py-12 fw-semibold ${activeTab === 'basic' ? 'active' : ''}`}
                      onClick={() => handleTabSwitch('basic')}
                      role="tab"
                      type="button"
                    >
                      <Icon icon="mdi:file-document-outline" className="me-2" />
                      Basic Details
                    </button>
                    <button
                      className={`nav-link px-20 py-12 fw-semibold ${activeTab === 'additional' ? 'active' : ''}`}
                      onClick={() => handleTabSwitch('additional')}
                      role="tab"
                      type="button"
                    >
                      <Icon icon="mdi:book-outline" className="me-2" />
                      Additional Details
                    </button>
                    <button
                      className={`nav-link px-20 py-12 fw-semibold ${activeTab === 'inventory' ? 'active' : ''}`}
                      onClick={() => handleTabSwitch('inventory')}
                      role="tab"
                      type="button"
                    >
                      <Icon icon="mdi:warehouse" className="me-2" />
                      Inventory
                    </button>
                  </nav>
                </div>
              </div>

              <div className="card-body p-24 pt-20">
                <form onSubmit={handleSubmit}>
                  {/* TAB 1: Basic Details */}
                  {activeTab === 'basic' && (
                    <div className="tab-content-section">
                      <div className="row g-20">
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Book ID <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="bookId"
                            value={formData.bookId}
                            readOnly
                            className="form-control radius-8 bg-neutral-50"
                            placeholder="Book ID will be auto-generated"
                          />
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Title <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="form-control radius-8"
                            placeholder="Enter book title"
                          />
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Author <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleInputChange}
                            className="form-control radius-8"
                            placeholder="Enter author name"
                          />
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            ISBN
                          </label>
                          <input
                            type="text"
                            name="isbn"
                            value={formData.isbn}
                            onChange={handleInputChange}
                            className="form-control radius-8"
                            placeholder="Enter ISBN"
                          />
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Category <span className="text-danger">*</span>
                          </label>
                          <div className="d-flex align-items-center gap-2">
                            <div style={{ flex: 1 }}>
                              <Select
                                name="category"
                                classNamePrefix="react-select"
                                options={categories.map(cat => ({
                                  value: cat.category_name,
                                  label: cat.category_name
                                }))}
                                value={formData.category ? { value: formData.category, label: formData.category } : null}
                                onChange={(option) => {
                                  handleInputChange({ target: { name: 'category', value: option ? option.value : '' } });
                                }}
                                isClearable
                                placeholder="Select Category"
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    borderRadius: '8px',
                                    minHeight: '44px',
                                    borderColor: '#e5e7eb'
                                  }),
                                  menu: (base) => ({
                                    ...base,
                                    borderRadius: '8px',
                                    zIndex: 9999
                                  })
                                }}
                              />
                            </div>
                            <button
                              type="button"
                              className="btn btn-primary radius-8"
                              style={{ minHeight: '44px', minWidth: '44px', padding: '0 12px' }}
                              onClick={() => setShowCategoryModal(true)}
                              title="Add New Category"
                            >
                              <Icon icon="icon-park-outline:plus" width="20" height="20" />
                            </button>
                          </div>
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Language <span className="text-danger">*</span>
                          </label>
                          <select
                            name="language"
                            value={formData.language}
                            onChange={handleInputChange}
                            className="form-select radius-8"
                          >
                            <option value="">Select Language</option>
                            <option value="Tamil">Tamil</option>
                            <option value="English">English</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Additional Details */}
                  {activeTab === 'additional' && (
                    <div className="tab-content-section">
                      <div className="row g-20">
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Publisher <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="publisher"
                            value={formData.publisher}
                            onChange={handleInputChange}
                            className="form-control radius-8"
                            placeholder="Enter publisher name"
                          />
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Edition
                          </label>
                          <input
                            type="text"
                            name="edition"
                            value={formData.edition}
                            onChange={handleInputChange}
                            className="form-control radius-8"
                            placeholder="Enter edition"
                          />
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Publication Year
                          </label>
                          <input
                            type="number"
                            name="publicationYear"
                            value={formData.publicationYear}
                            onChange={handleInputChange}
                            className="form-control radius-8"
                            placeholder="YYYY"
                          />
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Number of Pages
                          </label>
                          <input
                            type="number"
                            name="pages"
                            value={formData.pages}
                            onChange={handleInputChange}
                            className="form-control radius-8"
                            placeholder="Enter number of pages"
                          />
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Price <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="form-control radius-8"
                            placeholder="Enter price"
                          />
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Status <span className="text-danger">*</span>
                          </label>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="form-select radius-8"
                          >
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                            <option value="Damaged">Damaged</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </div>
                        <div className="col-12 col-lg-8">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Description
                          </label>
                          <textarea
                            className="form-control radius-8"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder="Enter book description"
                          ></textarea>
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Book Cover
                          </label>
                          <div className="border border-dashed border-neutral-300 rounded-8 p-20">
                            <div className="text-center">
                              {formData.coverPreview ? (
                                <img
                                  src={formData.coverPreview}
                                  alt="Book Cover Preview"
                                  style={{ maxWidth: 100, maxHeight: 120, marginBottom: 8, borderRadius: 8 }}
                                />
                              ) : (
                                <i className="fa fa-book fa-3x text-neutral-400 mb-8"></i>
                              )}
                              <p className="text-sm text-neutral-500 mb-8">
                                {formData.coverPreview ? 'Cover Selected' : 'No Cover Selected'}
                              </p>
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
                                  if (!allowed.includes(file.type)) {
                                    toast.error('Image format invalid. Only PNG, JPG, JPEG, WEBP allowed.');
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onload = ev => {
                                    setFormData(prev => ({ ...prev, coverPreview: ev.target.result, bookCover: file }));
                                  };
                                  reader.readAsDataURL(file);
                                }}
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                className="d-none"
                              />
                              <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <Icon icon="mdi:upload" width="16" height="16" className="me-1" />
                                Browse Photo
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Inventory */}
                  {activeTab === 'inventory' && (
                    <div className="tab-content-section">
                      <div className="row g-20">
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Quantity <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            className="form-control radius-8"
                            placeholder="Enter quantity"
                          />
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Rack <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="rack"
                            value={formData.rack}
                            onChange={handleInputChange}
                            className="form-control radius-8"
                            placeholder="Enter rack (e.g. R1, R2)"
                          />
                        </div>
                        <div className="col-12 col-lg-4">
                          <label className="form-label fw-semibold text-primary-light mb-8">
                            Position <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            name="position"
                            value={formData.position}
                            onChange={handleInputChange}
                            className="form-control radius-8"
                            placeholder="Enter position on rack"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                    <button
                      type="button"
                      className="btn btn btn-sm btn-outline-danger radius-8"
                      onClick={handleReset}
                    >
                      <Icon icon="mdi:eraser" width="16" height="16" className="me-1" />
                      Reset Form
                    </button>
                    <button
                      type="submit"
                      className="btn btn btn-sm btn-outline-primary radius-8"
                    >
                      <Icon icon="mdi:content-save" width="16" height="16" className="me-1" />
                      {isEditMode ? 'Update Book' : 'Save Book'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Books Table (below form) */}
            {showBooksTable && (
              <div className="mt-4" ref={booksTableRef}>
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-0">
                    <DataTable
                      data={books}
                      columns={[
                        {
                          accessorKey: 'slNo',
                          header: 'S.No',
                          cell: ({ row }) => (
                            <div className="fw-medium">{row.index + 1}</div>
                          ),
                        },
                        {
                          accessorKey: 'bookCover',
                          header: 'Cover',
                          cell: ({ row }) => {
                            const coverPath = row.original.book_cover_url || row.original.book_cover;
                            const imageUrl = coverPath && !coverPath.startsWith('/')
                              ? `/assets/lib/${coverPath}`
                              : coverPath;
                            return (
                              <div style={{ width: '50px', height: '70px', overflow: 'hidden', borderRadius: '4px' }}>
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt="Book Cover"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="70"%3E%3Crect fill="%23ddd" width="50" height="70"/%3E%3Ctext x="50%" y="50%" font-size="10" fill="%23999" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                                    }}
                                  />
                                ) : (
                                  <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#999' }}>
                                    No Cover
                                  </div>
                                )}
                              </div>
                            );
                          }
                        },
                        {
                          accessorKey: 'book_id',
                          header: 'Book ID',
                          cell: ({ row }) => (
                            <div style={{ fontWeight: 700, color: '#222', letterSpacing: '1px' }}>
                              {row.original.book_id || ''}
                            </div>
                          )
                        },
                        {
                          accessorKey: 'title',
                          header: 'Title',
                          cell: ({ row }) => <div className="fw-medium">{row.original.BookTitle || row.original.title}</div>
                        },
                        {
                          accessorKey: 'author',
                          header: 'Author',
                          cell: ({ row }) => <div className="fw-medium">{row.original.Author || row.original.author}</div>
                        },
                        {
                          accessorKey: 'isbn',
                          header: 'ISBN',
                          cell: ({ row }) => <div className="fw-medium">{row.original.ISBN || row.original.isbn || row.original.Isbn || row.original['isbn13'] || ''}</div>
                        },
                        {
                          accessorKey: 'language',
                          header: 'Language',
                          cell: ({ row }) => <div className="fw-medium">{row.original.language || row.original.Language || row.original.book_language || row.original.lang || ''}</div>
                        },
                        {
                          accessorKey: 'edition',
                          header: 'Edition',
                          cell: ({ row }) => <div className="fw-medium">{row.original.Edition || row.original.edition || row.original.editionName || ''}</div>
                        },
                        {
                          accessorKey: 'pages',
                          header: 'Number of Pages',
                          cell: ({ row }) => {
                            if (row.original.pages !== undefined && row.original.pages !== null) return <div className="fw-medium">{row.original.pages}</div>;
                            if (row.original.Pages !== undefined && row.original.Pages !== null) return <div className="fw-medium">{row.original.Pages}</div>;
                            if (row.original.number_of_pages !== undefined && row.original.number_of_pages !== null) return <div className="fw-medium">{row.original.number_of_pages}</div>;
                            if (row.original.NumberOfPages !== undefined && row.original.NumberOfPages !== null) return <div className="fw-medium">{row.original.NumberOfPages}</div>;
                            return <div className="fw-medium"></div>;
                          }
                        },
                        {
                          accessorKey: 'price',
                          header: 'Price',
                          cell: ({ row }) => {
                            if (row.original.Price !== undefined && row.original.Price !== null) return <div className="fw-medium">{row.original.Price}</div>;
                            if (row.original.price !== undefined && row.original.price !== null) return <div className="fw-medium">{row.original.price}</div>;
                            return <div className="fw-medium"></div>;
                          }
                        },
                        {
                          accessorKey: 'category',
                          header: 'Category',
                          cell: ({ row }) => <div className="fw-medium">{row.original.category || row.original.Category || ''}</div>
                        },
                        {
                          accessorKey: 'publisher',
                          header: 'Publisher',
                          cell: ({ row }) => <div className="fw-medium">{row.original.publisher || row.original.Publisher || ''}</div>
                        },
                        {
                          accessorKey: 'year',
                          header: 'Year',
                          cell: ({ row }) => <div className="fw-medium">{row.original.publication_year || row.original.publicationYear || row.original.PublishedYear || ''}</div>
                        },
                        {
                          accessorKey: 'rack',
                          header: 'Rack',
                          cell: ({ row }) => <div className="fw-medium">{row.original.shelf_location || row.original.rack || row.original.Rack || ''}</div>
                        },
                        {
                          accessorKey: 'position',
                          header: 'Position',
                          cell: ({ row }) => <div className="fw-medium">{row.original.position || row.original.Position || ''}</div>
                        },
                        {
                          accessorKey: 'quantity',
                          header: 'Quantity',
                          cell: ({ row }) => <div className="fw-medium">{row.original.quantity || row.original.Quantity || ''}</div>
                        },
                        {
                          accessorKey: 'status',
                          header: 'Status',
                          cell: ({ row }) => {
                            const status = row.original.status || 'Available';
                            let badgeClass = 'bg-success';
                            if (status === 'Unavailable') badgeClass = 'bg-warning';
                            else if (status === 'Damaged') badgeClass = 'bg-danger';
                            else if (status === 'Lost') badgeClass = 'bg-dark';
                            return <span className={`badge ${badgeClass} text-white`}>{status}</span>;
                          }
                        },
                        {
                          accessorKey: 'action',
                          header: 'Action',
                          cell: ({ row }) => (
                            <button
                              className="btn btn-sm btn-outline-warning me-1"
                              onClick={() => handleEditBook(row.original)}
                              title="Edit"
                            >
                              <Icon icon="mdi:pencil" width="16" height="16" />
                            </button>
                          )
                        }
                      ]}
                      loading={loadingBooks}
                      error={booksError}
                      title="All Books"
                      enableExport={true}
                      enableSelection={true}
                      enableActions={false}
                      pageSize={10}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <Footer />
        </div>
      </section>

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Category</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setNewCategoryName('');
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <label className="form-label fw-semibold text-primary-light mb-8">
                  Category Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control radius-8"
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCategory();
                    }
                  }}
                  autoFocus
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setNewCategoryName('');
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddCategory}
                >
                  <Icon icon="icon-park-outline:plus" width="18" height="18" className="me-1" />
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddBook;