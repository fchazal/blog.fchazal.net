import { useData } from "vike-react/useData";

import { WorkGallery } from "../../components/WorkGallery.jsx";

export default function Page() {
  const { works } = useData();
  return <WorkGallery works={works} />;
}
