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
    collectors_num?: number;
    is_collected?: boolean;
    // detail info
    description?: string;
    address?: string;
    detail_addr?: string;
    phone?: string;
    avg_grade?: number;
    avg_price?: number;
    created_at?: string;
    updated_at?: string;
}

export interface PostInfo {
    id?: number;
    title?: string;
    content?: string;
    grade?: number;
    avg_price?: number;
    creator?: number;
    image?: string;
    agrees?: number;
    is_agreed?: boolean;
    // detail info
    restaurant?: number;
    date?: string;
    recommend_dish?: string[];
}

