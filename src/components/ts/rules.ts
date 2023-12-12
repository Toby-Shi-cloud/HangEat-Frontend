type Rule = (v: string) => true | string;

export const emailRules: Rule[] = [
    (v: string) => !!v || '邮箱不能为空',
    (v: string) => v.endsWith('@buaa.edu.cn') || '请输入北航邮箱',
    (v: string) => v !== '@buaa.edu.cn' || '非法邮箱',
];

export const captchaRules: Rule[] = [
    (v: string) => !!v || '验证码不能为空',
    (v: string) => v.length == 6 || '验证码长度必须为6位',
];

export const usernameRules: Rule[] = [
    (v: string) => !!v || '用户名不能为空',
    (v: string) => !v.includes('@') || '用户名不能包含@',
    (v: string) => !v.includes('$') || '用户名不能包含$',
];

export const passwordRules: Rule[] = [
    (v: string) => !!v || '密码不能为空',
    (v: string) => v.length >= 6 || '密码长度不能小于6位',
];

export const usernameOrEmailRules: Rule[] = [
    (v: string) => !!v || '用户名或邮箱不能为空',
    (v: string) => !v.includes('@') || v.endsWith('@buaa.edu.cn') || '请使用北航邮箱',
    (v: string) => !v.includes('$') || '用户名不能含有$',
];
