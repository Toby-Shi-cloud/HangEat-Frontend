import axios from "./config";
import {startLoading} from "./config";

export interface RestaurantInfo {
    id?: number,
    name?: string,
    address?: string,
    phone?: string,
    img?: string,
    creator?: number,
    tags?: string[],
}

export const doCreateRestaurant = (name: string, address: string, phone?: string, avatar?: File) => {
    startLoading();
    return axios.post('/restaurant/create-resturant', {
        name: name,
        address: address,
        phone: phone,
        avatar: avatar,
    });
    // -> data: { message: string }
};

export const doGetRestaurantDetail = (id: number) => {
    return axios.get('/restaurant/get-restaurant-detail/' + id + '?timestamp=' + Date.now());
    // -> data: { <name>: RestaurantInfo }
}

export const doGetRestaurantNum = () => {
    return axios.get('/restaurant/get-restaurant-num?timestamp=' + Date.now());
    // -> data: { restaurant_num: number }
}

export const doGetRestaurantList = (from: number, to: number) => {
    return axios.get('/restaurant/get-restaurant-list?from=' + from + '&to=' + to + '&timestamp=' + Date.now());
    // -> data: { all_num: number, query_cnt: number, list: RestaurantInfo[] }
}
