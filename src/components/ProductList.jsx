import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const retrieveProducts = async ({queryKey}) => {
  
  const response = await axios.get(`http://localhost:8000/${queryKey[0]}`);

  return response.data;
};

export default function ProductList({onGetId}) {
  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: retrieveProducts,
    retry: false,
 
  });
  if (isLoading) return <div>Fetching products.....</div>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="flex flex-col justify-center items-center w-3/5">
      <h2 className="text-3xl my-2">Product List</h2>
      <ul className="flex flex-wrap justify-center items-center">
        {products &&
          products.map((product) => (
            <li
              key={product.id}
              className="flex flex-col items-center m-2 border rounded-sm"
            >
              <img
                className="object-cover h-64 w-96 rounded-sm"
                src={product.thumbnail}
                alt={product.title}
              />
              <p className="text-xl my-3">{product.title}</p>
              <button className="border rounded-xl bg-amber-950 text-white px-4 py-1 cursor-pointer" onClick={()=> onGetId(product.id)}>Details</button>
            </li>
          ))}
      </ul>
    </div>
  );
}
