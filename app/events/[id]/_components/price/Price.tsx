import { getLowestPrice } from "@/app/_utils/getLowetPrice";
import { getPricePlusPlatformFee } from "@/app/_utils/getPricePlusPlatformFee";

export default function Price({
  ticket_types,
  organizers
}: { ticket_types: { price: number }[]; organizers: { platform_fee_discount_pct: number } }) {
  const lowest = getLowestPrice(ticket_types);
  const lowestPricePlusPlatformFee = getPricePlusPlatformFee(
    lowest,
    organizers.platform_fee_discount_pct
  );

  const formattedPrice = lowest !== '0' ? `From £${Number(lowestPricePlusPlatformFee).toFixed(2)}` : 'Free';
  return (
    <div className="my-3 bg-radial-[at_25%_25%] from-gray-800 to-zinc-900 to-75% p-3 rounded-2xl ">
      {/* <p className="text-2xl my-2 truncate font-bold">Price</p> */}
      <p className="text-2xl font-semibold">
        {lowest ? formattedPrice: "Unavailable"}
      </p>
    </div>
  );
}
