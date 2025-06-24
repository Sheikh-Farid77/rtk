import { useState } from "react";
import ProductDetails from "./components/ProductDetails";
import ProductList from "./components/ProductList";
import AddProduct from "./components/AddProduct";

function App() {

  const [id, setId] = useState(null);

  const handleGetDetailsId = (id)=>{
    setId(id);
  }
  return (
    <div className="flex m-2">
      <AddProduct />
      <ProductList onGetId={handleGetDetailsId} />
      {
        id && <ProductDetails id={id} />
      }
    </div>
  );
}

export default App;
