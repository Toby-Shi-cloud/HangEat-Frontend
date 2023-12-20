export interface List<T> {
    all_num: number;
    query_cnt: number;
    list: T[];
}

export interface UserInfo {
    id?: number;
    username?: string;
    email?: string;
    avatar?: string;
    motto?: string;
    subscribers_num?: number;
    subscriptions_num?: number;
    is_mutual?: boolean; // 是否互相关注
}

export interface RestaurantInfo {
    id?: number;
    name?: string;
    img?: string;
    creator?: number;
    tags?: string[];
    // detail info
    description?: string;
    address?: string;
    detail_addr?: string;
    phone?: string;
}
