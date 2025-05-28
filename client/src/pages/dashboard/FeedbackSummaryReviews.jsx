import useToggleTheme from "@/context/useToggleTheme";
import PropTypes from "prop-types";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const FeedbackSummaryReviews = ({ data }) => {
  const { averageRating = 0, totalFeedbacks = 0 } = data;
  const { isDarkMode } = useToggleTheme((state) => state);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (averageRating >= i) {
        stars.push(<FaStar key={i} className="text-2xl text-base-200" />);
      } else if (averageRating >= i - 0.5) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-2xl text-base-200" />,
        );
      } else {
        stars.push(<FaRegStar key={i} className="text-2xl text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="w-full">
      <div
        className={`grid place-items-center space-y-2 ${isDarkMode ? "text-dark-text-base-300" : ""}`}
      >
        <p className="text-6xl font-semibold">{averageRating.toFixed(1)}</p>

        {/* Dynamically Render Stars */}
        <div className="flex items-center gap-1">{renderStars()}</div>

        <p className="text-[0.9rem]">{totalFeedbacks} Reviews</p>
      </div>
    </div>
  );
};

FeedbackSummaryReviews.propTypes = {
  data: PropTypes.shape({
    averageRating: PropTypes.number.isRequired,
    totalFeedbacks: PropTypes.number.isRequired,
  }).isRequired,
};

export default FeedbackSummaryReviews;
