import { NavLink, Outlet } from "react-router-dom";

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  color: isActive ? "#f8fafc" : "#cbd5e1",
  textDecoration: "none",
  fontWeight: isActive ? 600 : 400,
});

export function AppShell() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#e2e8f0",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1rem 1.5rem",
          borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
        }}
      >
        <div>
          <strong>Win Together</strong>
          <div style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Mission control</div>
        </div>

        <nav style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <NavLink to="/" style={navLinkStyle} end>
            Home
          </NavLink>
          <NavLink to="/team/demo" style={navLinkStyle}>
            Team Room
          </NavLink>
          <NavLink to="/history" style={navLinkStyle}>
            History
          </NavLink>
          <NavLink to="/memory" style={navLinkStyle}>
            Memory
          </NavLink>
        </nav>
      </header>

      <main style={{ padding: "1.5rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
