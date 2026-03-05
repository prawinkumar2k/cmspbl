# Quota Allocation & Seat Availability Feature

## Overview
Implemented a complete quota allocation and seat availability system for student admissions that displays available seats with color-coded status (Green/Yellow/Red).

## Features Implemented

### 1. **Backend Changes**

#### New API Endpoint: `/api/quotaAllocation/quota-by-dept`
**Location**: `server/controller/quotaAllocationController.js` and `server/routes/quotaAllocation.js`

**Functionality**:
- Query Parameters: `deptCode` and `quotaType` (e.g., "GQ" or "MQ")
- Returns quota information including:
  - Total seats allocated
  - Filled seats (from admitted_student table)
  - Available seats (calculated as total - filled)
  - Quota type and details

**Response Format**:
```json
{
  "total": 30,
  "filled": 5,
  "available": 25,
  "quotaType": "GQ",
  "quotaDetails": {...}
}
```

### 2. **Frontend Changes**

#### New State Variables (StudentDetails.jsx)
```javascript
const [quotaData, setQuotaData] = useState({ total: 0, available: 0, filled: 0 });
const [quotaLoading, setQuotaLoading] = useState(false);
```

#### New UI Components

**Allocated Quota Dropdown** (After Department Code):
- Label: "Allocated Quota"
- Options: 
  - GQ (General Quota)
  - MQ (Management Quota)
- Auto-fetches seat availability when selected

**Total Seats Display**:
- Shows total allocated seats for selected quota type
- Styling: Neutral gray background (read-only display)

**Available Seats Display** (Dynamic Color Coding):
- **Green** (Dark Green): When available > 30% of total
  - Background: `#d1fae5` (Light Green)
  - Border: `2px solid #10b981` (Dark Green)
  - Text Color: `#047857`
  
- **Warning/Amber** (Orange): When 0 < available ≤ 30% of total
  - Background: `#fef3c7` (Light Amber)
  - Border: `2px solid #f59e0b` (Amber)
  - Text Color: `#92400e`
  
- **Red**: When available = 0 (No seats)
  - Background: `#fee2e2` (Light Red)
  - Border: `2px solid #ef4444` (Red)
  - Text Color: `#b91c1c`

#### Updated handleChange() Logic
- When department changes: Quota selection is reset
- When quota type is selected: 
  - Fetches seat availability from backend
  - Sets quota data with total/available/filled counts
  - Shows loading state while fetching

#### Data Flow
```
User selects Department Code 
    ↓
User selects Quota (GQ/MQ)
    ↓
Frontend calls: /api/quotaAllocation/quota-by-dept?deptCode=...&quotaType=...
    ↓
Backend queries:
    - quota_allocation table (for total seats)
    - admitted_student table (for filled count)
    ↓
Frontend receives data and updates quotaData state
    ↓
Available Seats display updates with color based on availability
```

## UI Layout (Course Details Section)

```
Mode of Joining     Reference          Course              Department
[Dropdown]          [Dropdown]          [Dropdown]          [Dropdown]

Department Code     Allocated Quota     Total Seats         Available Seats*
[Auto-filled]       [GQ/MQ Dropdown]    [Display: Gray]     [Display: Colored]

Semester            Year                Admission Status    Admission Date
[Dropdown]          [Auto-filled]       [Display]           [Date Input]

*Only shown when quota is selected
```

## Database Queries Used

**1. Get Quota Data**:
```sql
SELECT * FROM quota_allocation 
WHERE Dept_Code = ? AND Type = ?
```

**2. Count Filled Seats**:
```sql
SELECT COUNT(*) as filledSeats 
FROM admitted_student 
WHERE Dept_Code = ? AND Allocated_Quota = ?
```

## Color Coding Logic

| Availability | Color | Use Case |
|---|---|---|
| > 30% of total | 🟢 Green | Plenty of seats available |
| > 0% but ≤ 30% | 🟡 Amber/Warning | Limited seats, filling up |
| 0% (0 seats) | 🔴 Red | No seats available (Waitlist) |

## User Workflow

1. Student selects **Course** → Auto-fills department options
2. Student selects **Department** → Auto-fills Department Code
3. Student selects **Allocated Quota** (MQ/GQ) → Displays:
   - Total Seats available for this quota
   - Available Seats with color indicator
4. Color indicator helps student understand seat status:
   - ✅ Green → Safe to apply
   - ⚠️ Yellow → Hurry (limited seats)
   - ❌ Red → Closed (apply to waitlist)

## Files Modified

### Backend
- `server/controller/quotaAllocationController.js` - Added `getQuotaByDept` endpoint
- `server/routes/quotaAllocation.js` - Registered new route

### Frontend
- `client/src/pages/dashboard/admin/admission/admission/StudentDetails.jsx`:
  - Added quota state variables
  - Updated handleChange for quota selection
  - Added Allocated Quota dropdown
  - Added Total/Available Seats displays with color coding

## Testing Checklist

- [ ] Backend endpoint returns correct total seats
- [ ] Backend endpoint counts filled students correctly
- [ ] Frontend dropdown shows GQ/MQ options
- [ ] Selecting quota fetches data without errors
- [ ] Total Seats display shows correct count
- [ ] Available Seats display shows correct count
- [ ] Color changes based on availability percentage
- [ ] Loading state shown while fetching
- [ ] Data persists when form is submitted

## Future Enhancements

1. Add community-based seat filtering
2. Show seat breakdown by community category
3. Add waitlist functionality for full quotas
4. Add historical seat availability charts
5. Export seat availability report
