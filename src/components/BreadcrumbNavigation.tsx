import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path: string;
}

const BreadcrumbNavigation: React.FC = () => {
  const location = useLocation();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const segments = path.split("/").filter((seg) => seg && seg !== "v");

    if (segments.length === 0) {
      return [{ label: "Dashboard", path: "/v" }];
    }

    const breadcrumbs: BreadcrumbItem[] = [{ label: "Dashboard", path: "/v" }];

    // Map route segments to human-readable labels
    const labelMap: { [key: string]: string } = {
      blog: "Blog",
      post: "Post",
      resources: "Resources",
      account: "Settings",
      admin: "Admin",
      dashboard: "Dashboard",
      billing: "Billing",
      simulations: "Simulations",
      create: "Create Post",
      edit: "Edit Post",
    };

    segments.forEach((segment, idx) => {
      const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      const pathSegments = segments.slice(0, idx + 1);
      const constructedPath = "/v/" + pathSegments.join("/");

      // Don't add duplicate if it's just an ID
      if (!/^[0-9a-f]{24}$/i.test(segment)) {
        breadcrumbs.push({ label, path: constructedPath });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs for dashboard
  }

  return (
    <div className="mb-6 flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 overflow-x-auto pb-2">
      {breadcrumbs.map((crumb, idx) => (
        <React.Fragment key={crumb.path}>
          {idx === 0 ? (
            <Link
              to={crumb.path}
              className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-gray-200 transition-colors flex-shrink-0"
            >
              <Home size={16} />
              <span>{crumb.label}</span>
            </Link>
          ) : (
            <>
              <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-gray-900 dark:text-gray-100 font-medium flex-shrink-0">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors flex-shrink-0"
                >
                  {crumb.label}
                </Link>
              )}
            </>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default BreadcrumbNavigation;
