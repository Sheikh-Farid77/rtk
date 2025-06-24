import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import useDebounce from "./useDebounce";

const retrieveProducts = async ({queryKey}) => {
  
  const response = await axios.get(`http://localhost:8000/products?_page=${queryKey[1].page}&_per_page=6`);

  return response.data;
};

export default function ProductList({onGetId}) {
  const [searchQuery, setSearchQuery] = useState('')
 
  const queryClient = useQueryClient();
  
  const [page, setPage] = useState(1)
  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products", {page}],
    queryFn: retrieveProducts,
    retry: false,
 
  });

    const mutation = useMutation({
    mutationFn: (id) =>
      axios.delete(`http://localhost:8000/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
    
  });

  const debounceValue = useDebounce(searchQuery, 500)

   const filterBySearch = (product) => {
    if (searchQuery !== "") {
      return product?.title
        .toLowerCase()
        .includes(debounceValue.trim().toLowerCase());
    }
    return true;
  };



  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  

  }

 
  if (isLoading) return <div>Fetching products.....</div>;
  if (error) return <p>{error.message}</p>;
  if(products.length < 1) return <p>Products Not Available</p>

  return (
    <div className="flex flex-col justify-center items-center w-3/5">
      <h2 className="text-3xl my-2">Product List</h2>
      <div>
        <input className="border px-4 py-1" onChange={handleChange} type="text" name="" id="" />
      </div>
      <ul className="flex flex-wrap justify-center items-center">
        {products.data &&
          products.data.
          filter(filterBySearch)
          .map((product) => (
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
              <button onClick={() => mutation.mutate(product.id)} className="border rounded-xl bg-red-400 text-white px-4 py-1 cursor-pointer" >Delete</button>
            </li>
          ))}
      </ul>
      <div>
        {
          products.prev && (
            <button onClick={() => setPage(products.prev)} className="border bg-gray-500 text-white px-4 py-1 cursor-pointer">prev</button>
          )
        }
        {
           products.next && (
            <button onClick={() => setPage(products.next)} className="border bg-gray-500 text-white px-4 py-1 cursor-pointer">next</button>
          )
        }
      </div>
    </div>
  );
}
