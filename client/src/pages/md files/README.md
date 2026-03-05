# Academic Calendar Component

A comprehensive React calendar component built with FullCalendar.js, featuring event management, multiple view modes, and a modern UI design based on the Bootstrap template reference.

## Features

### 🗓️ Calendar Views
- **Month View**: Traditional monthly calendar layout
- **Week View**: Detailed weekly timeline
- **Day View**: Single day detailed view
- **List View**: Event list format

### ✨ Event Management
- **CRUD Operations**: Create, Read, Update, Delete events
- **Drag & Drop**: Move events between dates
- **Event Resizing**: Adjust event duration
- **Color Coding**: 6 predefined event categories with distinct colors
- **All Day Events**: Support for full-day events
- **Time-based Events**: Precise start and end times

### 🎨 Event Categories
1. **Academic** (Blue) - School-related activities
2. **Meeting** (Green) - Conferences and meetings
3. **Sports** (Orange) - Athletic events
4. **Examination** (Red) - Tests and assessments
5. **Holiday** (Purple) - Vacation days
6. **Event** (Cyan) - General events

### 📱 User Interface
- **Responsive Design**: Works on all device sizes
- **Modern Modal Dialogs**: Add, Edit, View, Delete modals
- **Event Sidebar**: Upcoming events with quick actions
- **Date Picker Integration**: Advanced date/time selection
- **Bootstrap Styling**: Consistent with admin theme

## Installation

The component requires the following dependencies (already installed):

```bash
npm install @fullcalendar/react @fullcalendar/core @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction @fullcalendar/list react-datepicker uuid
```

## Usage

### Basic Usage

```jsx
import AcademicCalendar from './pages/dashboard/admin/academic/planning/academicalendar';

// In your routing component
<Route path="/admin/academic/planning/academicalendar" element={<AcademicCalendar />} />
```

### Navigation

Access the calendar at: `http://localhost:3000/admin/academic/planning/academicalendar`

## Component Structure

```
academicalendar.jsx          # Main React component
academicalendar.css          # Custom styling
```

## Key Functionalities

### 1. Event Creation
- Click on any date to open the "Add Event" modal
- Fill in event details:
  - Title (required)
  - Description
  - Category
  - Start/End date and time
  - All-day event toggle

### 2. Event Interaction
- **Click Event**: View event details
- **Drag Event**: Move to different date
- **Resize Event**: Adjust duration (in week/day views)

### 3. Event Management
- **View**: Display event information
- **Edit**: Modify event details
- **Delete**: Remove event with confirmation

### 4. Sidebar Features
- **Category Filter**: Toggle event categories (checkbox-style)
- **Upcoming Events**: List of next 5 events
- **Quick Actions**: View, Edit, Delete via dropdown menu

## Customization

### Adding New Event Categories

```jsx
const eventCategories = [
  { value: 'academic', label: 'Academic', color: '#3b82f6' },
  { value: 'meeting', label: 'Meeting', color: '#10b981' },
  // Add your custom category
  { value: 'custom', label: 'Custom Event', color: '#ff6b6b' }
];
```

### Modifying Default Events

```jsx
const [events, setEvents] = useState([
  {
    id: '1',
    title: 'Your Event',
    start: '2025-11-10T09:00:00',
    end: '2025-11-10T17:00:00',
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    category: 'academic',
    description: 'Event description'
  }
]);
```

## API Integration

To connect with a backend API, modify these functions:

```jsx
// For loading events
useEffect(() => {
  // Fetch events from API
  fetchEventsFromAPI().then(setEvents);
}, []);

// For saving events
const handleAddEvent = async () => {
  const newEvent = { /* event data */ };
  const savedEvent = await saveEventToAPI(newEvent);
  setEvents([...events, savedEvent]);
};
```

## Styling Customization

The component uses Bootstrap classes and custom CSS. Key styling files:

- `academicalendar.css`: Custom FullCalendar and component styles
- Bootstrap 5 classes for layout and components
- CSS custom properties for theme colors

### Theme Colors
```css
:root {
  --primary: #3b82f6;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #06b6d4;
  --purple: #8b5cf6;
}
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance Notes

- Events are stored in local state (consider Redux for large applications)
- Component renders efficiently with React hooks
- CSS animations are optimized for smooth interactions
- Responsive design ensures good mobile performance

## Troubleshooting

### Common Issues

1. **Modal not showing**: Ensure Bootstrap JS is loaded
2. **Date picker not working**: Check react-datepicker CSS import
3. **Events not draggable**: Verify FullCalendar interaction plugin
4. **Styling issues**: Confirm CSS file import and Bootstrap classes

### Debug Mode

Add console logging to track events:

```jsx
useEffect(() => {
  console.log('Events updated:', events);
}, [events]);
```

## Future Enhancements

- [ ] Event recurrence (daily, weekly, monthly)
- [ ] Event reminders and notifications
- [ ] Import/Export calendar functionality
- [ ] Multi-user event sharing
- [ ] Advanced filtering options
- [ ] Calendar printing support
- [ ] Offline mode with local storage
- [ ] Integration with external calendars (Google, Outlook)

## Support

For issues or feature requests, refer to the component documentation or contact the development team.