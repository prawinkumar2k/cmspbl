import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import "../../../../components/css/sidebar-enhanced.css";

const Sidebar = () => {
    const location = useLocation();
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [dropdowns, setDropdowns] = useState({});
    const submenuRefs = useRef({});
    const sidebarRef = useRef(null);

    // Static Student Sidebar configuration (Don't replace these items)
    const sidebarConfig = [
        {
            id: "dashboard",
            type: "link",
            icon: "solar:home-smile-angle-outline",
            label: "Dashboard",
            href: "/student/dashboard",
            colorKey: "dashboard"
        },
        {
            id: "section_academic",
            type: "section",
            label: "Academic",
        },
         {
            id: "academic-calendar",
            type: "link",
            icon: "solar:calendar-bold-duotone",
            label: "Academic Calendar",
            href: "/student/academic-calendar",
            colorKey: "academic"
        },
        {
            id: "timetable",
            type: "link",
            icon: "solar:clock-circle-bold-duotone",
            label: "Timetable",
            href: "/student/timetable",
            colorKey: "academic"
        },
        {
            id: "academic-history",
            type: "link",
            icon: "solar:history-bold-duotone",
            label: "Academic History",
            href: "/student/academic-history",
            colorKey: "dashboard"
        },
        {
            id: "attendance",
            type: "link",
            icon: "solar:calendar-mark-outline",
            label: "Attendance",
            href: "/student/attendance",
            colorKey: "academic"
        },
        {
            id: "mark-details",
            type: "link",
            icon: "solar:document-text-outline",
            label: "Mark Details",
            href: "/student/mark-details",
            colorKey: "assessment"
        },
        
        
        
        {
            id: "section_user",
            type: "section",
            label: "User",
        },
        // {
        //     id: "learning-resources",
        //     type: "link",
        //     icon: "solar:notebook-bold-duotone",
        //     label: "Learning Resources",
        //     href: "/student/learning-resources",
        //     colorKey: "assessment"
        // },
        // {
        //     id: "noticeboard",
        //     type: "link",
        //     icon: "solar:bell-bing-bold-duotone",
        //     label: "Noticeboard",
        //     href: "/student/noticeboard",
        //     colorKey: "enquiry"
        // },
        {
            id: "profile",
            type: "link",
            icon: "solar:user-id-bold-duotone",
            label: "Profile",
            href: "/student/profile",
            colorKey: "enquiry"
        },
    ];

    // Premium Color Mapping (matching Admin style)
    const getMenuItemColor = (colorKey) => {
        const colorMap = {
            'dashboard': { bg: '#5568d3', light: 'rgba(102, 126, 234, 0.15)', dark: '#3d4fa6' },
            'academic': { bg: '#0ea5e9', light: 'rgba(79, 172, 254, 0.15)', dark: '#0d7fb5' },
            'assessment': { bg: '#0ea5e9', light: 'rgba(79, 172, 254, 0.15)', dark: '#0db56fff' },
            'enquiry': { bg: '#f5576c', light: 'rgba(240, 147, 251, 0.15)', dark: '#d63842' },
        };
        return colorMap[colorKey] || { bg: '#5568d3', light: 'rgba(102, 126, 234, 0.15)', dark: '#3d4fa6' };
    };

    const isRouteActive = (itemHref) => {
        if (!itemHref || itemHref === "#") return false;
        return location.pathname === itemHref;
    };

    const closeSidebar = () => {
        if (sidebarRef.current) {
            sidebarRef.current.classList.remove("sidebar-open");
            document.body.classList.remove("overlay-active");
        }
    };

    const toggleDropdown = (dropdownName, event) => {
        event.preventDefault();
        const submenu = submenuRefs.current[dropdownName];
        if (submenu) {
            if (dropdowns[dropdownName]) {
                submenu.style.height = submenu.scrollHeight + "px";
                submenu.offsetHeight;
                submenu.style.height = "0px";
                setTimeout(() => setDropdowns(prev => ({ ...prev, [dropdownName]: false })), 300);
            } else {
                setDropdowns(prev => ({ ...prev, [dropdownName]: true }));
                setTimeout(() => {
                    if (submenu) {
                        submenu.style.height = "0px";
                        submenu.offsetHeight;
                        submenu.style.height = submenu.scrollHeight + "px";
                    }
                }, 10);
            }
        }
    };

    const renderMenuItem = (item) => {
        switch (item.type) {
            case 'section':
                return <li key={item.id} className="sidebar-menu-group-title">{item.label}</li>;

            case 'link':
                const isLinkActive = isRouteActive(item.href);
                const colorObj = getMenuItemColor(item.colorKey);
                return (
                    <li key={item.id} className={isLinkActive ? 'active' : ''}>
                        <Link to={item.href} style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.5rem',
                            borderRadius: '12px', transition: 'all 0.3s ease',
                            backgroundColor: isLinkActive ? colorObj.light : 'transparent',
                            textDecoration: 'none'
                        }}>
                            <Icon icon={item.icon} style={{ fontSize: '24px', color: colorObj.dark }} />
                            <span style={{ fontWeight: isLinkActive ? '600' : '500', color: '#000' }}>{item.label}</span>
                        </Link>
                    </li>
                );

            case 'dropdown':
                const hasActiveChild = item.items?.some(subItem => isRouteActive(subItem.href));
                const dropdownColorObj = getMenuItemColor(item.colorKey);
                return (
                    <li key={item.id} className={`dropdown ${dropdowns[item.id] ? "dropdown-open" : ""} ${hasActiveChild ? "active" : ""}`}>
                        <a href="#" onClick={(e) => toggleDropdown(item.id, e)} className="dropdown-toggle" style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.5rem',
                            borderRadius: '12px', backgroundColor: hasActiveChild ? dropdownColorObj.light : 'transparent',
                            textDecoration: 'none'
                        }}>
                            <Icon icon={item.icon} style={{ fontSize: '24px', color: dropdownColorObj.dark }} />
                            <span style={{ flex: 1, fontWeight: hasActiveChild ? '600' : '500', color: '#000' }}>{item.label}</span>
                            <Icon icon="iconamoon:arrow-down-2-bold" className={`dropdown-arrow ${dropdowns[item.id] ? "rotate" : ""}`} />
                        </a>
                        <ul className="sidebar-submenu" ref={(el) => (submenuRefs.current[item.id] = el)} style={{
                            display: dropdowns[item.id] ? "block" : "none", overflow: "hidden", transition: "height 0.3s ease"
                        }}>
                            {item.items?.map((subItem, index) => {
                                const isSubitemActive = isRouteActive(subItem.href);
                                return (
                                    <li key={index}>
                                        <Link to={subItem.href} style={{
                                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.5rem',
                                            borderRadius: '12px', backgroundColor: isSubitemActive ? dropdownColorObj.light : 'transparent',
                                            textDecoration: 'none'
                                        }}>
                                            <Icon icon={subItem.icon || "solar:record-circle-bold"} style={{ color: dropdownColorObj.bg, fontSize: '24px' }} />
                                            <span style={{ color: '#000', fontWeight: isSubitemActive ? '600' : '500' }}>{subItem.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                );
            default: return null;
        }
    };

    return (
        <aside ref={sidebarRef} className={`sidebar ${isSidebarMinimized ? "active" : ""}`}>
            <button type="button" className="sidebar-close-btn" onClick={closeSidebar}>
                <Icon icon="radix-icons:cross-2" />
            </button>
            <div>
                <Link to="/student/dashboard" className="sidebar-logo">
                    <img src="/assets/images/6.png" alt="logo" className="light-logo" />
                    <img src="/assets/images/7.png" alt="logo" className="logo-icon" />
                </Link>
            </div>
            <div className="sidebar-menu-area">
                <ul className="sidebar-menu">
                    {sidebarConfig.map(renderMenuItem)}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
