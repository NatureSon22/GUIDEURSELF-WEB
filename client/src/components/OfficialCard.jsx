const OfficialCard = ({ official }) => {
  return (
    <div className="box-shadow-200 flex h-[360px] w-[250px] flex-col items-center rounded-md border border-secondary-200/30 bg-white py-4">
      <img
        src={official.key_official_photo_url}
        alt={official.name}
        className="h-[200px] w-[210px] rounded-md object-cover"
        loading="lazy"
      />
      <h3 className="text-md font-cizel-decor mt-5 text-[1.05rem] px-4 text-center font-bold text-gray-800">
        {official.name}
      </h3>
      <p className="mt-2 font-cizel text-center text-gray-600">
        {official.position_name}
      </p>
    </div>
  );
};

export default OfficialCard;
