import { useData } from "vike-react/useData";

import { DoodleGallery } from "../../components/DoodleGallery.jsx";

export default function Page() {
  const { doodles } = useData();
  return <DoodleGallery doodles={doodles} variant="page" />;
}
