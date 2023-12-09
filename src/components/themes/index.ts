import {ref, computed, nextTick} from "vue";
import {StyleProvider, Themes} from '@varlet/ui';

const isSysDarkTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
const isSysLightTheme = () => !isSysDarkTheme();

export enum Theme {
    Light = "light",
    Dark = "dark",
    System = "system",
}

let currentTheme = ref(Theme.System);
export const isLight = computed(() =>
    currentTheme.value === Theme.Light || (currentTheme.value === Theme.System && isSysLightTheme()));
export const isDark = computed(() =>
    currentTheme.value === Theme.Dark || (currentTheme.value === Theme.System && isSysDarkTheme()));

async function refreshTheme() {
    await nextTick();
    document.body.setAttribute("theme", isLight.value ? "light" : "dark");
    StyleProvider(isLight.value ? null : Themes.dark);
}

export function setTheme(theme: Theme) {
    currentTheme.value = theme;
    localStorage.setItem("kThemeMode", theme);
    refreshTheme().then();
}

export function toggleTheme() {
    setTheme(isLight.value ? Theme.Dark : Theme.Light);
}

export function setAppStyle(page: string) {
    document.getElementById('app')?.setAttribute('page', page);
}
