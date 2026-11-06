// The line icons the live portal uses (Lucide), as small inline SVGs, so no icon package is needed.
import type { SVGProps } from "react";

type Node = [string, Record<string, string>];
function Icon({ nodes, size = 16, strokeWidth = 1.8, ...rest }: { nodes: Node[]; size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {nodes.map(([tag, attrs], i) => {
        const A = tag as "path";
        return <A key={i} {...(attrs as SVGProps<SVGPathElement>)} />;
      })}
    </svg>
  );
}

const IconOverviewNodes: Node[] = [["rect",{"width":"7","height":"9","x":"3","y":"3","rx":"1"}],["rect",{"width":"7","height":"5","x":"14","y":"3","rx":"1"}],["rect",{"width":"7","height":"9","x":"14","y":"12","rx":"1"}],["rect",{"width":"7","height":"5","x":"3","y":"16","rx":"1"}]];
export const IconOverview = (p: { size?: number; strokeWidth?: number }) => <Icon nodes={IconOverviewNodes} {...p} />;

const IconEventsNodes: Node[] = [["path",{"d":"M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2"}],["path",{"d":"M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2"}],["path",{"d":"M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3"}],["path",{"d":"M4 22h16"}],["path",{"d":"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"}],["path",{"d":"M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3"}]];
export const IconEvents = (p: { size?: number; strokeWidth?: number }) => <Icon nodes={IconEventsNodes} {...p} />;

const IconMyEventsNodes: Node[] = [["circle",{"cx":"12","cy":"12","r":"10"}],["path",{"d":"M12 6v6h4"}]];
export const IconMyEvents = (p: { size?: number; strokeWidth?: number }) => <Icon nodes={IconMyEventsNodes} {...p} />;

const IconSparklesNodes: Node[] = [["path",{"d":"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}],["path",{"d":"M20 2v4"}],["path",{"d":"M22 4h-4"}],["circle",{"cx":"4","cy":"20","r":"2"}]];
export const IconSparkles = (p: { size?: number; strokeWidth?: number }) => <Icon nodes={IconSparklesNodes} {...p} />;

const IconCertificatesNodes: Node[] = [["path",{"d":"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"}],["circle",{"cx":"12","cy":"8","r":"6"}]];
export const IconCertificates = (p: { size?: number; strokeWidth?: number }) => <Icon nodes={IconCertificatesNodes} {...p} />;

const IconIdCardNodes: Node[] = [["path",{"d":"M16 10h2"}],["path",{"d":"M16 14h2"}],["path",{"d":"M6.17 15a3 3 0 0 1 5.66 0"}],["circle",{"cx":"9","cy":"11","r":"2"}],["rect",{"x":"2","y":"5","width":"20","height":"14","rx":"2"}]];
export const IconIdCard = (p: { size?: number; strokeWidth?: number }) => <Icon nodes={IconIdCardNodes} {...p} />;

const IconBotNodes: Node[] = [["path",{"d":"M12 8V4H8"}],["rect",{"width":"16","height":"12","x":"4","y":"8","rx":"2"}],["path",{"d":"M2 14h2"}],["path",{"d":"M20 14h2"}],["path",{"d":"M15 13v2"}],["path",{"d":"M9 13v2"}]];
export const IconBot = (p: { size?: number; strokeWidth?: number }) => <Icon nodes={IconBotNodes} {...p} />;

const IconBellNodes: Node[] = [["path",{"d":"M10.268 21a2 2 0 0 0 3.464 0"}],["path",{"d":"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"}]];
export const IconBell = (p: { size?: number; strokeWidth?: number }) => <Icon nodes={IconBellNodes} {...p} />;

const IconProfileNodes: Node[] = [["circle",{"cx":"12","cy":"12","r":"10"}],["circle",{"cx":"12","cy":"10","r":"3"}],["path",{"d":"M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"}]];
export const IconProfile = (p: { size?: number; strokeWidth?: number }) => <Icon nodes={IconProfileNodes} {...p} />;

const IconRefreshNodes: Node[] = [["path",{"d":"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"}],["path",{"d":"M21 3v5h-5"}],["path",{"d":"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"}],["path",{"d":"M8 16H3v5"}]];
export const IconRefresh = (p: { size?: number; strokeWidth?: number }) => <Icon nodes={IconRefreshNodes} {...p} />;

const IconZapNodes: Node[] = [["path",{"d":"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"}]];
export const IconZap = (p: { size?: number; strokeWidth?: number }) => <Icon nodes={IconZapNodes} {...p} />;

const IconCircleCheckNodes: Node[] = [["circle",{"cx":"12","cy":"12","r":"10"}],["path",{"d":"m16 9-5.5 5.5L8 12"}]];
export const IconCircleCheck = (p: { size?: number; strokeWidth?: number }) => <Icon nodes={IconCircleCheckNodes} {...p} />;

const IconUsersNodes: Node[] = [["path",{"d":"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}],["path",{"d":"M16 3.128a4 4 0 0 1 0 7.744"}],["path",{"d":"M22 21v-2a4 4 0 0 0-3-3.87"}],["circle",{"cx":"9","cy":"7","r":"4"}]];
export const IconUsers = (p: { size?: number; strokeWidth?: number }) => <Icon nodes={IconUsersNodes} {...p} />;
