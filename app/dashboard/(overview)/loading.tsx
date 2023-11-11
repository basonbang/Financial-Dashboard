/* 
    Page level file used to implement streaming - breaking down route into smaller chunks and progressively stream them on browser 
    as they become ready
*/

import DashboardSkeleton from "@/app/ui/skeletons"; // Simplified UI used as placeholder when loading

export default function Loading(){
    return <DashboardSkeleton />;
}