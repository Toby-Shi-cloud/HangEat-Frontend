import axios from "./config";
import {startLoading} from "./config";

export const doCreateRestaurant = (name: string, address: string, phone?: string) => {
    startLoading();
    return axios.post('restaurant/create-restaurant', {
        name: name,
        address: address,
        phone: phone,
    });
    // -> data: { message: string }
}

export const doUpdateRestaurant = (id: number, name?: string, description?: string, address?: string, phone?: string) => {
    startLoading();
    return axios.put('restaurant/update-restaurant/' + id, {
        name: name,
        description: description,
        address: address,
        phone: phone,
    });
    // -> data: { message: string }
}

export const doUploadImage = (id: number, image: File) => {
    startLoading();
    let formData = new FormData();
    formData.append('image', image);
    return axios.post('restaurant/update-image/' + id, formData);
    // -> data: { message: string }
}

export const doGetRestaurantDetail = (id: number) => {
    return axios.get('restaurant/get-restaurant-detail/' + id + '?timestamp=' + Date.now());
    // -> data: RestaurantInfo
}

export const doGetRestaurantNum = () => {
    return axios.get('restaurant/get-restaurant-num?timestamp=' + Date.now());
    // -> data: { restaurant_num: number }
}

export const doGetRestaurantList = (from: number, to: number) => {
    return axios.get('restaurant/get-restaurant-list?from=' + from + '&to=' + to + '&timestamp=' + Date.now());
    // -> data: List<RestaurantInfo>
}

export const doDeleteRestaurant = (id: number) => {
    return axios.delete('restaurant/delete-restaurant/' + id);
    // -> data: { message: string }
}

export const doGetCollectorsNum = (id: number) => {
    return axios.get('restaurant/get-collectors-num/' + id + "?timestamp=" + Date.now());
    // -> data: { collectors_num: number }
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
    return axios.get('restaurant/get-tag-num?timestamp=' + Date.now());
    // -> data: { tag_num: number }
}

export const doGetTagList = (from: number, to: number) => {
    return axios.get('restaurant/get-tag-list?from=' + from + '&to=' + to + '&timestamp=' + Date.now());
    // -> data: List<{name:string}>
}

export const doRestaurantNumByTags = (tags: string[]) => {
    return axios.get('restaurant/get-tag-restaurant-num?tags=' + tags + '&timestamp=' + Date.now());
    // -> data: { restaurant_num: number }
}

export const doGetRestaurantListByTags = (tags: string[], from: number, to: number) => {
    return axios.get('restaurant/get-restaurant-list?tags=' + tags + '&from=' + from + '&to=' + to + '&timestamp=' + Date.now());
    // -> data: List<RestaurantInfo>
}
