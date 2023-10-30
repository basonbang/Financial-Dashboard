// Special file to create UI that is shared between multiple pages. This is the layout for the dashboard that all shared pages will use.

import SideNav from '@/app/ui/dashboard/sidenav'; // Any components you import will be part of your layout
 
/* All dashboard pages will have the layout with the SideNav component. 
   🎯 Only the page components will re-render, known as partial rendering. This is the children prop.
*/
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav /> 
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}