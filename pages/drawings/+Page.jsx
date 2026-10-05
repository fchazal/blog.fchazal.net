import { useData } from "vike-react/useData";

import { DoodleGallery } from "../../components/DoodleGallery.jsx";

export default function Page() {
  const { drawings } = useData();
  return <DoodleGallery doodles={drawings} variant="page" />;
}
