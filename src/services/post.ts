import axios from "./config";
import {startLoading} from "./config";

export const doUploadImage = (image: File) => {
    let formData = new FormData();
    formData.append('image', image);
    return axios.post('restaurant/upload-image', formData);
    // -> data: { message: string, url: string }
}

export const doCreatePost = (restaurant_id: number, title: string, content: string, grade: number, price: number) => {
    startLoading();
    return axios.post('restaurant/create-post', {
        restaurant_id: restaurant_id,
        title: title,
        content: content,
        grade: grade,
        price: price,
    });
    // -> data: { message: string, id: number }
}

export const doUpdatePostImage = (id: number, image: File) => {
    let formData = new FormData();
    formData.append('image', image);
    return axios.post(`restaurant/update-post-image/${id}`, formData);
    // -> data: { message: string }
}

export const doGetPostNum = (restaurant_id: number) => {
    return axios.get(`restaurant/get-post-num/${restaurant_id}?timestamp=${Date.now()}`);
    // -> data: { post_num: number }
}

export const doGetPostList = (restaurant_id: number, from: number, to: number) => {
    return axios.get(`restaurant/get-post-list/${restaurant_id}?from=${from}&to=${to}&timestamp=${Date.now()}`);
    // -> data: List<PostInfo>
}

export const doGetPostNumByUser = (user_id: number) => {
    return axios.get(`restaurant/get-post-num-by-user/${user_id}?timestamp=${Date.now()}`);
    // -> data: { post_num: number }
}

export const doGetPostListByUser = (user_id: number, from: number, to: number) => {
    return axios.get(`restaurant/get-post-list-by-user/${user_id}?from=${from}&to=${to}&timestamp=${Date.now()}`);
    // -> data: List<PostInfo>
}

export const doGetPostDetail = (id: number) => {
    return axios.get(`restaurant/get-post-detail/${id}?timestamp=${Date.now()}`);
    // -> data: PostInfo
}

export const doUpVote = (id: number) => {
    return axios.post(`restaurant/agree-post/${id}`);
    // -> data: { message: string }
}

export const doDownVote = (id: number) => {
    return axios.post(`restaurant/disagree-post/${id}`);
    // -> data: { message: string }
}

export const doDeletePost = (id: number) => {
    return axios.delete(`restaurant/delete-post/${id}`);
    // -> data: { message: string }
}

export const doUpdatePost = (id: number, title?: string, content?: string, grade?: number, price?: number) => {
    startLoading();
    return axios.put(`restaurant/update-post/${id}`, {
        title: title,
        content: content,
        grade: grade,
        price: price,
    });
    // -> data: { message: string }
}
