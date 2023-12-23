type Rule = (v: string) => true | string;

export const emailRules = [
    v => !!v || '邮箱不能为空',
    v => v.endsWith('@buaa.edu.cn') || '请输入北航邮箱',
    v => v !== '@buaa.edu.cn' || '非法邮箱',
] as Rule[];

export const captchaRules: Rule[] = [
    v => !!v || '验证码不能为空',
    v => v.length == 6 || '验证码长度必须为6位',
] as Rule[];

export const usernameRules: Rule[] = [
    v => !!v || '用户名不能为空',
    v => !v.includes('@') || '用户名不能包含@',
    v => !v.includes('$') || '用户名不能包含$',
] as Rule[];

export const passwordRules: Rule[] = [
    v => !!v || '密码不能为空',
    v => v.length >= 6 || '密码长度不能小于6位',
] as Rule[];

export const usernameOrEmailRules: Rule[] = [
    v => !!v || '用户名或邮箱不能为空',
    v => !v.includes('@') || v.endsWith('@buaa.edu.cn') || '请使用北航邮箱',
    v => !v.includes('$') || '用户名不能含有$',
] as Rule[];

export const tagRules = (tags: string[]) => [
    v => tags.indexOf(v) == -1 || '标签已添加',
    v => /\S*/.test(v) || '不能包含空白符号',
] as Rule[];
