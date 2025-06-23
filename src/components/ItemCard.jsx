import Link from "next/link";

const DEFAULT_IMAGE_PLACEHOLDER_BG = "#E5E7EB";

export default function ItemCard({ item }) {
  if (!item || typeof item !== "object" || !item.id) {
    console.warn("ItemCard received invalid item prop:", item);
    return null;
  }

  const imageUrl = item?.images?.[0];
  const itemName = item?.name || "상품명 없음";
  const itemPrice =
    item?.price !== undefined && item?.price !== null
      ? `${item.price.toLocaleString()}원`
      : "가격 미정";

  const handleImageError = (e) => {
    e.currentTarget.style.display = "none";
    if (e.currentTarget.parentElement) {
      e.currentTarget.parentElement.style.backgroundColor =
        DEFAULT_IMAGE_PLACEHOLDER_BG;
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow flex flex-col">
      <div className="w-full h-32 bg-gray-200 rounded mb-2 overflow-hidden relative flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={itemName}
            className="w-full h-full object-cover"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            이미지 없음
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow">
        <h2 className="text-lg font-semibold mb-1 truncate" title={itemName}>
          {itemName}
        </h2>
        <p className="text-gray-700 mb-3 flex-grow">{itemPrice}</p>

        <Link
          href={`/items/${item.id}`}
          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm mt-auto self-start"
        >
          상세보기 &rarr;
        </Link>
      </div>
    </div>
  );
}
