import React, { FC } from "react";
import { Route, Routes } from "react-router-dom";
// import LoadingPage from "@/pages/common/loading";
// import DashboardLayout from "@/layouts/DashboardLayout";

type DashboardLayout = any;

interface RouteType {
  path: string;
  layout?: FC<DashboardLayout>;
  element: React.LazyExoticComponent<FC>;
}

const routes: RouteType[] = [
  {
    path: "/",
    element: React.lazy(() => import("../pages/index")),
  },
];

const RenderRoutes = () => {
  return (
    // <React.Suspense fallback={<LoadingPage />}>
    <React.Suspense>
      <Routes>
        {routes.map((route, i) => {
          const RouteElement = route.element;
          const RouteLayout = route.layout || React.Fragment;

          return (
            <Route
              key={i}
              path={route.path}
              element={
                <RouteLayout>
                  <RouteElement />
                </RouteLayout>
              }
            />
          );
        })}
      </Routes>
    </React.Suspense>
  );
};

export default RenderRoutes;
