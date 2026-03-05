# HSC Cutoff Implementation - Complete Update

## Changes Made to StudentDetails.jsx

### 1. **New HSC Exam Type Subject Constants**

Added two new subject arrays to support both 600 and 1200 mark exams:

```javascript
// HSC Subjects for 600 marks exam (6 subjects - 100 marks each)
const HSC_SUBJECTS_600 = [
  { subject: 'Tamil', max: 100, marks: '', fixed: true },
  { subject: 'English', max: 100, marks: '', fixed: true },
  { subject: '', max: 100, marks: '', fixed: false },
  { subject: '', max: 100, marks: '', fixed: false },
  { subject: '', max: 100, marks: '', fixed: false },
  { subject: '', max: 100, marks: '', fixed: false },
];

// HSC Subjects for 1200 marks exam (12 subjects - 100 marks each)
const HSC_SUBJECTS_1200 = [
  { subject: 'Tamil', max: 100, marks: '', fixed: true },
  { subject: 'English', max: 100, marks: '', fixed: true },
  { subject: '', max: 100, marks: '', fixed: false },
  // ... 10 more subjects
];
```

### 2. **Updated Initial Form State**

Added new fields to track HSC exam type and cutoff formula:
- `hscExamType`: Defaults to '600' marks
- `hscCutoffFormula`: Stores the formula used for cutoff calculation

### 3. **Enhanced HSC Subject Handler (handleHscSubjectChange)**

Updated to support **two intelligent cutoff formulas**:

**Formula 1:** `(Bio/2 + Phy/4 + Chem/4)` - Used when Biology is present
**Formula 2:** `(Maths/2 + Phy/4 + Chem/4)` - Used when Mathematics is present (no Biology)

The handler:
- Automatically detects which subject combination is filled
- Applies the appropriate formula
- Tracks which formula was used in `hscCutoffFormula`
- Recalculates on every subject change

### 4. **Added Exam Type Handler (hscExamType)**

In the `handleChange` function, added logic to:
- Switch between 600 and 1200 mark subject arrays
- Update total maximum marks automatically
- Reset marks and cutoff when exam type changes
- Show toast notification of the change

### 5. **Updated HSC Rendering Section (renderHscSection)**

**New Features:**
- **Exam Type Dropdown**: Allows selection between 600 and 1200 marks
- **Dynamic Subject Count**: Changes from 6 to 12 subjects based on selection
- **Enhanced Cutoff Display**: 
  - Shows cutoff score when available
  - Displays which formula is being used
  - Shows helpful information box with cutoff calculation logic
- **Formula Documentation**: Clear explanation of both cutoff formulas in the UI

## Cutoff Calculation Logic

### Scenario 1: Biology Stream
If Biology, Physics, and Chemistry marks are entered:
```
Cutoff = (Biology/2) + (Physics/4) + (Chemistry/4)
```
Formula Display: "Bio/2 + Phy/4 + Chem/4"

### Scenario 2: Mathematics Stream  
If Mathematics, Physics, and Chemistry marks are entered (and no Biology):
```
Cutoff = (Mathematics/2) + (Physics/4) + (Chemistry/4)
```
Formula Display: "Maths/2 + Phy/4 + Chem/4"

### Scenario 3: Insufficient Data
If required subjects are not filled, cutoff shows "N/A"

## User Interface Updates

### Exam Type Selection
```
Exam Type * [Dropdown]
├── 600 Marks (6 Subjects)
└── 1200 Marks (12 Subjects)
```

### HSC Marks Table
- Subject column shows Tamil & English as read-only fixed subjects
- Remaining rows allow subject entry with flexible naming
- Real-time calculation of totals and percentages

### Cutoff Information Box
Displays:
- Current cutoff score (or N/A if incomplete)
- Formula used (e.g., "Bio/2 + Phy/4 + Chem/4")
- Helpful reference guide for both formulas

## Technical Highlights

✅ **Smart Formula Detection**: Automatically selects appropriate formula based on subject availability
✅ **Real-time Calculation**: Cutoff updates instantly as marks are entered
✅ **Dynamic Subject Arrays**: Switch between 6 and 12 subjects seamlessly
✅ **Data Persistence**: Tracks formula used for storage/display
✅ **User Feedback**: Toast notifications on exam type changes
✅ **No Validation Errors**: Code passes all linting checks

## Testing Checklist

- [ ] Select 600 marks exam - verify 6 subjects appear
- [ ] Select 1200 marks exam - verify 12 subjects appear
- [ ] Enter Biology, Physics, Chemistry marks - verify formula shows "Bio/2 + Phy/4 + Chem/4"
- [ ] Enter Mathematics, Physics, Chemistry marks (no Biology) - verify formula shows "Maths/2 + Phy/4 + Chem/4"
- [ ] Switch exam type - verify subjects reset and marks clear
- [ ] Verify toast notifications on exam type change
- [ ] Test with edit student data - verify exam type loads correctly

## API Considerations

When saving to database, ensure to store:
1. `HSC_Exam_Type` (600 or 1200)
2. `HSC_Subjects` (JSON array with all subjects)
3. `HSC_Cutoff` (calculated value)
4. `HSC_Cutoff_Formula` (formula used for reference)
