import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export default function AddProduct() {
  const queryClient = useQueryClient();
  const [state, setState] = useState({
    title: "",
    description: "",
    price: 0,
    rating: 5,
    thumbnail: "",
  });
  const handleChange = (e) => {
    const name = e.target.name;
    const value =
      e.target.value === "number" ? Number(e.target.value) : e.target.value;
    setState({
      ...state,
      [name]: value,
    });
  };
  const mutation = useMutation({
    mutationFn: (newProduct) =>
      axios.post("http://localhost:8000/products", newProduct),
    onSuccess: (data, variables, context) => {
      console.log(context); // greeting
      queryClient.invalidateQueries(["products"]);
    },
    onMutate: (variables) => {
      return { greeting: "say hello" };
    },
  });
  const submitData = (e) => {
    e.preventDefault();

    const newProduct = { ...state, id: crypto.randomUUID().toString() };
    mutation.mutate(newProduct);
  };
  if (mutation.isPending) return <span>submitting.....</span>;
  if (mutation.error) return <span>{mutation.error.message}</span>;
  return (
    <div className="m-2 p-2 bg-gray-100 w-1/5 h-1/2">
      <h2 className="text-2xl my-2">Add a Product</h2>
      {mutation.isSuccess && <p>Product Added!</p>}
      <form className="flex flex-col" onSubmit={submitData}>
        <input
          type="text"
          name="title"
          value={state.title}
          onChange={handleChange}
          className="my-2 border p-2 rounded"
          placeholder="Enter a product title"
        />
        <textarea
          name="description"
          value={state.description}
          onChange={handleChange}
          className="my-2 border p-2 rounded"
          placeholder="Enter a product description"
        />

        <input
          type="number"
          name="price"
          value={state.price}
          onChange={handleChange}
          className="my-2 border p-2 rounded"
          placeholder="Enter a product price"
        />
        <input
          type="text"
          name="thumbnail"
          value={state.thumbnail}
          onChange={handleChange}
          className="my-2 border p-2 rounded"
          placeholder="Enter a product thumbnail URL"
        />

        <button
          type="submit"
          className="bg-black m-auto text-white text-xl px-4 py-1 rounded-md cursor-pointer"
        >
          Add
        </button>
      </form>
    </div>
  );
}
