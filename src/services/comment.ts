import axios from "./config";
import {startLoading} from "./config";

export const doCreateComment = (post_id: number, reply_id: number | null, content: string) => {
    startLoading();
    return axios.post('restaurant/create-comment', {
        post_id: post_id,
        reply_id: reply_id,
        content: content,
    });
    // -> data: { message: string, id: number }
}

export const doGetCommentNum = (post_id: number) => {
    return axios.get(`restaurant/get-comment-num/${post_id}?timestamp=${Date.now()}`);
    // -> data: { comment_num: number }
}

export const doGetCommentList = (post_id: number, from: number, to: number) => {
    return axios.get(`restaurant/get-comment-list/${post_id}?from=${from}&to=${to}&timestamp=${Date.now()}`);
    // -> data: List<CommentInfo>
}

export const doUpVote = (id: number) => {
    return axios.post(`restaurant/agree-comment/${id}`);
    // -> data: { message: string }
}

export const doDownVote = (id: number) => {
    return axios.post(`restaurant/disagree-comment/${id}`);
    // -> data: { message: string }
}

export const doDeleteComment = (id: number) => {
    return axios.delete(`restaurant/delete-comment/${id}`);
    // -> data: { message: string }
}

export const doUpdateComment = (id: number, content?: string) => {
    startLoading();
    return axios.put(`restaurant/update-comment/${id}`, {
        content: content,
    });
    // -> data: { message: string }
}
