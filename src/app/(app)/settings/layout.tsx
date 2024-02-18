import { NavigationListLink } from "@/components/layout/NavigationList/NavigationList";
import { PageUrls } from "@/const";
import { WithAsideNavLayout } from "@/layout/WithAsideNav/WithAsideNavLayout";

const links: NavigationListLink[] = [
  { href: PageUrls.settings.index, label: "General", icon: "Settings" },
  { href: PageUrls.settings.security, label: "Security", icon: "Lock" },
];

const layout = () => <WithAsideNavLayout links={links} />;

export default layout;
