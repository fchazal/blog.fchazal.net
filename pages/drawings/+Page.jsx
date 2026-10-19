import { useData } from "vike-react/useData";

import { DrawingFocus } from "../../components/DrawingFocus.jsx";

export default function Page() {
  const { drawing, drawings, prev, next, likeCount } = useData();
  return (
    <DrawingFocus
      drawing={drawing}
      drawings={drawings}
      prev={prev}
      next={next}
      likeCount={likeCount}
    />
  );
}
