import axios from "./config";
import {startLoading} from "./config";

export const doCreateRestaurant = (name: string, address: string, phone?: string) => {
    startLoading();
    return axios.post('restaurant/create-restaurant', {
        name: name,
        address: address,
        phone: phone,
    });
    // -> data: { message: string, id: number }
}

export const doUpdateRestaurant = (id: number, name?: string, description?: string, address?: string, phone?: string) => {
    startLoading();
    return axios.put(`restaurant/update-restaurant/${id}`, {
        name: name,
        description: description,
        address: address,
        phone: phone,
    });
    // -> data: { message: string }
}

export const doUpdateImage = (id: number, image: File) => {
    startLoading();
    let formData = new FormData();
    formData.append('image', image);
    return axios.post(`restaurant/update-image/${id}`, formData);
    // -> data: { message: string }
}

export const doGetRestaurantDetail = (id: number) => {
    return axios.get(`restaurant/get-restaurant-detail/${id}?timestamp=${Date.now()}`);
    // -> data: RestaurantInfo
}

export const doGetRestaurantNum = (tags?: string[], creator_id?: number) => {
    let query = '';
    if (tags) query += `&tags=${tags.join(',')}`;
    if (creator_id) query += `&creator_id=${creator_id}`;
    return axios.get(`restaurant/get-restaurant-num?timestamp=${Date.now()}${query}`);
    // -> data: { restaurant_num: number }
}

export enum OrderType {
    CollectorsNum = 0,
    AverageGrade = 1,
    AveragePrice = 2,
    CreateTime = 3,
}

export const doGetRestaurantList = (type: OrderType, from: number, to: number, reverse = false, tags?: string[], creator_id?: number) => {
    let query = '';
    if (tags) query += `&tags=${tags.join(',')}`;
    if (creator_id) query += `&creator_id=${creator_id}`;
    query += `&reverse=${reverse ? 1 : 0}`;
    return axios.get(`restaurant/get-restaurant-list/${type}?from=${from}&to=${to}&timestamp=${Date.now()}${query}`);
    // -> data: List<RestaurantInfo>
}

export const doDeleteRestaurant = (id: number) => {
    return axios.delete(`restaurant/delete-restaurant/${id}`);
    // -> data: { message: string }
}

export const doReferTag = (target_id: number, tags: string[]) => {
    return axios.post('restaurant/refer-tag', {
        target_id: target_id,
        tags: tags,
    });
    // -> data: { message: string }
}

export const doDeleteTag = (target_id: number, tag_name: string) => {
    return axios.delete('restaurant/delete-tag', {
        data: {
            target_id: target_id,
            tag_name: tag_name,
        }
    });
    // -> data: { message: string }
}

export const doGetTagNum = () => {
    return axios.get(`restaurant/get-tag-num?timestamp=${Date.now()}`);
    // -> data: { tag_num: number }
}

export const doGetTagList = (from: number, to: number) => {
    return axios.get(`restaurant/get-tag-list?from=${from}&to=${to}&timestamp=${Date.now()}`);
    // -> data: List<{name:string}>
}
