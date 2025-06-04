import { Outlet } from "react-router-dom";

export default function AdministratorLayout() {
  return (
    <section className="p-3 sm:p-3 md:p-5">
      <Outlet />
    </section>
  );
}
