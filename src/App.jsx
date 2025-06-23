import { useState } from "react";
import ProductDetails from "./components/ProductDetails";
import ProductList from "./components/ProductList";

function App() {

  const [id, setId] = useState(null);

  const handleGetDetailsId = (id)=>{
    setId(id);
  }
  return (
    <div className="flex m-2">
      <ProductList onGetId={handleGetDetailsId} />
      {
        id && <ProductDetails id={id} />
      }
    </div>
  );
}

export default App;
