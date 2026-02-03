// import { useEffect, useState } from 'react'
// import {getallproperties} from '../api/property.api'
// const Properties=async()=>{
// const [properties,setProperties]=useState('')
// const loadProperty=async()=>{
//     res=await getallproperties()
//     setProperties(res.data)
// }
// useEffect(()=>{
//     loadProperty()
// },[])
// return(
// <div>
//     <h2>Properties</h2>

// <ul>
//         {properties.map((p)=>{
// <li key={p.id}>  #{p.id} | {p.location} | {p.price} | beds: {p.bedrooms} </li>
//         })}
// </ul>
// </div>
// )
// }
import { useEffect, useState } from "react";
import { getAllProperties, searchProperties } from "../api/property.api";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const loadAll = async () => {
    const res = await getAllProperties();
    setProperties(res.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const onSearch = async (e) => {
    e.preventDefault();
    const res = await searchProperties({
      location: location || undefined,
      maxPrice: maxPrice || undefined,
    });
    setProperties(res.data.properties);
  };

  return (
    <div>
      <h2>Properties</h2>

      <form onSubmit={onSearch}>
        <input placeholder="location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input placeholder="maxPrice" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <button type="submit">Search</button>
        <button type="button" onClick={loadAll}>Reset</button>
      </form>

      <ul>
        {properties.map((p) => (
          <li key={p.id}>
            #{p.id} | {p.location} | {p.price} | beds: {p.bedrooms}
          </li>
        ))}
      </ul>
    </div>
  );
}
