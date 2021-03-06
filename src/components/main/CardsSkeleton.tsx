import { Skeleton } from "@mui/material";

const edgeSize = (min = 180, max = 250) => {
  return min + Math.round(Math.random() * (min - max));
};

const CardsSkeleton = () => {
  return (
    <main>
      <div className="container">
        {/* length is the number card skeletons to display */}
        {Array.from({length: 15}, () => 0).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={edgeSize()}
            height={edgeSize()}
            animation="wave"
          />
        ))}
      </div>
    </main>
  );
};
export default CardsSkeleton;
