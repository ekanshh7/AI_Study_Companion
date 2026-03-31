import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdMenuBook,
  MdTaskAlt,
  MdHistory,
  MdSmartToy,
} from "react-icons/md";
import "./SidebarNav.css";

const links = [
  { to: "/dashboard", label: "Dashboard", Icon: MdDashboard },
  { to: "/subjects", label: "Subjects", Icon: MdMenuBook },
  { to: "/tasks", label: "Tasks", Icon: MdTaskAlt },
  { to: "/revision", label: "Revision", Icon: MdHistory },
  { to: "/ai-tools", label: "AI Tools", Icon: MdSmartToy },
];

export default function SidebarNav() {
  return (
    <nav className="sidebar-nav" aria-label="Main">
      <div className="sidebar-nav__brand">Study Companion</div>
      <ul className="sidebar-nav__list">
        {links.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end
              className={({ isActive }) =>
                `sidebar-nav__link${isActive ? " sidebar-nav__link--active" : ""}`
              }
            >
              <Icon className="sidebar-nav__icon" aria-hidden />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
