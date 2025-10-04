function StarRating({ rating, editable = false, onChange }) {
  const handleClick = (value) => {
    if (editable && onChange) onChange(value);
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          className={`text-yellow-500 text-xl ${editable ? "cursor-pointer" : "cursor-default"}`}
        >
          {star <= rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

export default StarRating;
