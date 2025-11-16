import { getLowestPrice } from "@/app/_utils/getLowetPrice";

export default function Price({
  ticket_types
}: { ticket_types: { price: number }[] }) {
  const lowest = getLowestPrice(ticket_types);
  const formattedPrice = lowest !== '0' ? `From £${lowest}` : 'Free' 
  return (
    <div className="my-3 bg-radial-[at_25%_25%] from-gray-800 to-zinc-900 to-75% p-3 rounded-2xl ">
      {/* <p className="text-2xl my-2 truncate font-bold">Price</p> */}
      <p className="text-2xl font-semibold">
        {lowest ? formattedPrice: "Unavailable"}
      </p>
    </div>
  );
}
