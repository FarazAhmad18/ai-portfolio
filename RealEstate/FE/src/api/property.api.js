import api from "../api/axios";

export const getAllProperties=()=>api.get('/properties')
export const getPropertyById=(id)=>api.get(`/properties/${id}`)
export const createProperty=(data)=>api.get(`/properties`,data)
export const updateProperty=(id,data)=>api.put(`/properties/${id}`,data)
export const deleteProperty=(id)=>api.delete(`/properties/${id}`)
export const searchProperties=(params)=>api.get('/search',{params})



