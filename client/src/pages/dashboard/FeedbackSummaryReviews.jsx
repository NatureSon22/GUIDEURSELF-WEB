import { FaStar } from "react-icons/fa";

const FeedbackSummaryReviews = () => {
  return (
    <div className="w-full">
      <div className="grid place-items-center space-y-2">
        <p className="text-6xl font-semibold">4.8</p>

        <div className="flex items-center gap-2">
          <FaStar className="text-2xl text-base-200" />
          <FaStar className="text-2xl text-base-200" />
          <FaStar className="text-2xl text-base-200" />
          <FaStar className="text-2xl text-base-200" />
          <FaStar className="text-2xl text-base-200" />
        </div>

        <p className="text-[0.9rem]">3,698 Reviews</p>
      </div>
    </div>
  );
};

export default FeedbackSummaryReviews;
