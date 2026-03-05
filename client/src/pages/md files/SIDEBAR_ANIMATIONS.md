# Sidebar Animation & Toggle Effects Documentation

## Overview
This document provides a comprehensive guide to all the sidebar animations, transitions, and toggle effects implemented in the ERP application.

---

## 1. Main Sidebar Transitions

### Property
```css
transition: all 0.3s;
```

### Effect
Smooth transition for all sidebar properties over **0.3 seconds**

### Location
`.sidebar` class in `style.css`

### Implementation
All sidebar state changes (width, position, visibility) animate smoothly over 300ms.

---

## 2. Sidebar Width Changes

### Desktop Breakpoints

#### Standard Desktop (≥1200px)
- **Normal State**: `width: 13.75rem` (220px)
- **Collapsed State**: `width: auto` (fits content, ~78px)

#### Large Desktop (≥1400px)
- **Normal State**: `width: 17.1875rem` (275px)
- **Collapsed State**: `width: auto`

#### XL Desktop (≥1650px)
- **Normal State**: `width: 19.5rem` (312px)
- **Collapsed State**: `width: auto`

### CSS Implementation
```css
@media (min-width: 1200px) {
  .sidebar {
    width: 13.75rem;
  }
}

.sidebar.active {
  width: auto;
}
```

---

## 3. Sidebar Position Animation

### Mobile Behavior
- **Closed State**: `left: -100%` (off-screen)
- **Open State**: `left: 0` (visible)
- **Transition**: Slides in from left with 0.3s duration

### Desktop Behavior
- **Always visible**: Position fixed at `left: 0`
- **Only width changes**: No position animation

### CSS Implementation
```css
.sidebar {
  position: fixed;
  inset-inline-start: -100%;
  transition: all 0.3s;
}

@media (min-width: 1200px) {
  .sidebar {
    inset-inline-start: 0;
  }
}

.sidebar.sidebar-open {
  inset-inline-start: 0;
}
```

---

## 4. Hover Effects on Collapsed Sidebar

When sidebar has `.active` class (collapsed) and user hovers:

### Logo Animation
- **Normal**: Icon-only logo visible
- **On Hover**: Full logo appears
```css
.sidebar.active:hover .sidebar-logo img.light-logo {
  display: inline-block;
}

.sidebar.active:hover .sidebar-logo img.logo-icon {
  display: none;
}
```

### Menu Text Visibility
- **Normal**: `display: none`
- **On Hover**: `display: inline-block`
```css
.sidebar.active:hover .sidebar-menu li a span {
  display: inline-block;
}
```

### Menu Icon Spacing
- **Normal**: `margin-inline-end: 0`
- **On Hover**: `margin-inline-end: 0.5rem`
```css
.sidebar.active:hover .sidebar-menu li a .menu-icon {
  margin-inline-end: 0.5rem;
}
```

### Dropdown Menus
- **Normal**: `display: none !important`
- **On Hover**: `display: block !important`

### Group Titles
- **Normal**: Hidden
- **On Hover**: Visible

---

## 5. Dashboard Main Content Animation

### Property
```css
transition: all 0.3s;
```

### Margin Adjustments

#### Normal State
- **≥1200px**: `margin-inline-start: 13.75rem` (220px)
- **≥1400px**: `margin-inline-start: 17.1875rem` (275px)
- **≥1650px**: `margin-inline-start: 19.5rem` (312px)

#### Collapsed State
- **All Breakpoints**: `margin-inline-start: 4.875rem` (78px)

### CSS Implementation
```css
.dashboard-main {
  margin-inline-start: 0;
  transition: all 0.3s;
}

@media (min-width: 1200px) {
  .dashboard-main {
    margin-inline-start: 13.75rem;
  }
}

.dashboard-main.active {
  margin-inline-start: 4.875rem;
}
```

---

## 6. Toggle Button Icon Animation

### Icon Switching
- **Normal State**: Hamburger icon (`heroicons:bars-3-solid`)
- **Active State**: Arrow icon (`iconoir:arrow-right`)

### CSS Classes
```css
.sidebar-toggle.active .icon.non-active {
  display: none;
}

.sidebar-toggle.active .icon.active {
  display: inline-block;
}

.sidebar-toggle .icon.active {
  display: none;
}
```

### React Implementation
```jsx
<button className={`sidebar-toggle btn ${isToggleActive ? "active" : ""}`}>
  <Icon
    icon="heroicons:bars-3-solid"
    className={`icon text-xl ${isToggleActive ? "active" : "non-active"}`}
  />
  <Icon
    icon="iconoir:arrow-right"
    className={`icon text-xl ${isToggleActive ? "active" : "non-active"}`}
  />
</button>
```

---

## 7. Dropdown Menu Animations

### Submenu Slide Animation
- **Animation**: Smooth height transition from 0 to auto
- **Duration**: 0.3s
- **Easing**: ease (default)

### Arrow Rotation
```css
.sidebar-menu li.dropdown > a::after {
  transition: all 0.3s;
  transform: translateY(-50%);
}

.sidebar-menu li.dropdown.dropdown-open > a::after {
  transform: translateY(-50%) rotate(90deg);
}
```

### React Implementation
```jsx
const toggleDropdown = (dropdownName, event) => {
  event.preventDefault();
  
  const submenu = submenuRefs.current[dropdownName];
  if (submenu) {
    if (dropdowns[dropdownName]) {
      // Slide up
      submenu.style.height = submenu.scrollHeight + "px";
      submenu.offsetHeight; // Force reflow
      submenu.style.height = "0px";
    } else {
      // Slide down
      submenu.style.height = "0px";
      submenu.offsetHeight; // Force reflow
      submenu.style.height = submenu.scrollHeight + "px";
    }
  }
};
```

---

## 8. Mobile Overlay Animation

### Effect
Background overlay fades in when sidebar opens on mobile

### CSS Implementation
```css
body.overlay-active::after {
  width: 100%;
}

body::after {
  position: absolute;
  content: "";
  width: 0;
  height: 100%;
  background-color: #000;
  opacity: 0.65;
  transition: all 0.3s;
  z-index: 2;
}
```

### Trigger Events
- **Open**: Add `.overlay-active` class to `body`
- **Close**: Remove `.overlay-active` class from `body`

---

## 9. Submenu Slide Animation

### Properties
- **Type**: Height-based slide animation
- **Duration**: 0.3s (300ms)
- **Easing**: ease
- **States**: 
  - Collapsed: `height: 0; overflow: hidden`
  - Expanded: `height: auto; overflow: visible`

### React Implementation
Uses refs and inline styles for smooth height transitions:
```jsx
<ul
  className="sidebar-submenu"
  ref={(el) => (submenuRefs.current.invoice = el)}
  style={{
    display: dropdowns.invoice ? "block" : "none",
    overflow: "hidden",
    transition: "height 0.3s ease",
  }}
>
  {/* Submenu items */}
</ul>
```

---

## 10. Global Transition Property

### Universal Smooth Transitions
All elements have `transition: all 0.3s` applied globally via reset CSS:

```css
*,
::before,
::after {
  box-sizing: border-box;
  border-style: solid;
  border-width: 0;
  transition: all 0.3s;
}
```

---

## Animation Trigger Events

### 1. Desktop Toggle
- **Trigger**: `.sidebar-toggle` click
- **Action**: Toggles `.active` class on sidebar and dashboard-main
- **Effect**: 
  - Sidebar collapses/expands
  - Dashboard content margin adjusts
  - Toggle icon switches

### 2. Mobile Toggle
- **Trigger**: `.sidebar-mobile-toggle` click
- **Action**: Adds `.sidebar-open` class to sidebar
- **Effect**: 
  - Sidebar slides in from left
  - Overlay appears
  - Body gets `.overlay-active` class

### 3. Close Button
- **Trigger**: `.sidebar-close-btn` click
- **Action**: Removes `.sidebar-open` and `.overlay-active` classes
- **Effect**: 
  - Sidebar slides out to left
  - Overlay disappears
  - Body scroll restored

### 4. Hover Effect
- **Trigger**: CSS `:hover` on `.sidebar.active`
- **Action**: Shows full sidebar content temporarily
- **Effect**: 
  - Full logo appears
  - Menu text visible
  - Dropdowns accessible
  - Width expands

### 5. Dropdown Toggle
- **Trigger**: Click on `.dropdown` items
- **Action**: Toggles `.dropdown-open` class
- **Effect**: 
  - Submenu slides down/up
  - Arrow rotates 90 degrees
  - Parent item highlights

---

## Key Animation Properties Used

### 1. CSS Transitions
```css
transition: all 0.3s;
```
- Applied globally
- Affects all property changes
- 300ms duration

### 2. CSS Transforms
```css
transform: rotate(90deg);
transform: translateY(-50%);
```
- Used for arrow rotation
- Icon positioning
- Smooth GPU-accelerated animations

### 3. Height Animations
```javascript
element.style.height = '0px';
element.style.height = element.scrollHeight + 'px';
```
- Smooth slide effects
- Calculated based on content
- Transitions to auto after animation

### 4. Toggle Classes
```javascript
element.classList.toggle('active');
element.classList.add('sidebar-open');
element.classList.remove('overlay-active');
```
- State management
- CSS-driven animations
- Clean separation of concerns

### 5. Pseudo-class Animations
```css
.sidebar.active:hover { }
```
- No JavaScript required
- Pure CSS hover states
- Better performance

---

## React Component State Management

### Navbar Component States
```jsx
const [isToggleActive, setIsToggleActive] = useState(false);
```
- Tracks desktop toggle state
- Controls icon switching
- Manages active class

### Sidebar Component States
```jsx
const [dropdowns, setDropdowns] = useState({ invoice: false });
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [isCollapsed, setIsCollapsed] = useState(false);
```
- `dropdowns`: Individual dropdown states
- `isSidebarOpen`: Mobile sidebar visibility
- `isCollapsed`: Desktop collapse state

---

## Browser Compatibility

All animations use standard CSS properties with vendor prefixes where needed:
- `-webkit-transition`
- `-o-transition`
- `-moz-transition`
- `-ms-transition`

### Supported Browsers
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS/Android)

---

## Performance Considerations

1. **GPU Acceleration**: Transform and opacity changes use GPU
2. **Will-change**: Not used to avoid memory overhead
3. **Transitions vs Animations**: Transitions preferred for simplicity
4. **Reflow Minimization**: Height changes batched with `offsetHeight`
5. **Event Delegation**: Single listeners for multiple items where possible

---

## Customization Guide

### Change Animation Duration
```css
/* In style.css, update the global transition */
*,
::before,
::after {
  transition: all 0.5s; /* Changed from 0.3s */
}
```

### Change Sidebar Width
```css
@media (min-width: 1200px) {
  .sidebar {
    width: 16rem; /* Custom width */
  }
}
```

### Disable Hover Expansion
```css
/* Comment out or remove */
/*
.sidebar.active:hover {
  width: 17.1875rem;
}
*/
```

### Add Custom Animation
```css
.sidebar {
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1); /* Custom easing */
}
```

---

## Troubleshooting

### Issue: Animations not smooth
**Solution**: Check if `transition: all 0.3s` is being overridden

### Issue: Sidebar not sliding on mobile
**Solution**: Verify `.sidebar-open` class is being added correctly

### Issue: Dropdown not animating
**Solution**: Ensure submenu has proper ref and inline styles

### Issue: Icons not switching
**Solution**: Check that both icons are rendered with correct classes

---

## Testing Checklist

- [ ] Desktop toggle collapses sidebar
- [ ] Desktop toggle expands dashboard margin
- [ ] Mobile toggle shows sidebar
- [ ] Mobile overlay appears and blocks content
- [ ] Close button hides sidebar on mobile
- [ ] Hover on collapsed sidebar shows content
- [ ] Dropdown arrows rotate on click
- [ ] Submenus slide smoothly
- [ ] Icons switch between hamburger and arrow
- [ ] All animations smooth at 60fps
- [ ] Works across all breakpoints (1200px, 1400px, 1650px)
- [ ] Dark mode compatible
- [ ] Keyboard accessible

---

## References

- **CSS File**: `client/src/components/css/style.css`
- **Navbar Component**: `client/src/components/Navbar.jsx`
- **Sidebar Component**: `client/src/components/Sidebar.jsx`
- **jQuery Logic** (legacy): `client/src/components/js/app.js`

---

*Last Updated: November 1, 2025*
