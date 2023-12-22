import {ref, computed, nextTick} from "vue";
import {StyleProvider, Themes} from '@varlet/ui';

const isSysDarkTheme = ref(false);
const isSysLightTheme = computed(() => !isSysDarkTheme.value);

export enum Theme {
    Light = "light",
    Dark = "dark",
    System = "system",
}

let currentTheme = ref(Theme.System);
export const isLight = computed(() =>
    currentTheme.value === Theme.Light || (currentTheme.value === Theme.System && isSysLightTheme.value));
export const isDark = computed(() =>
    currentTheme.value === Theme.Dark || (currentTheme.value === Theme.System && isSysDarkTheme.value));
export const getCurrentTheme = computed(() => currentTheme.value);
export const getSystemTheme = computed(() => isSysDarkTheme.value ? Theme.Dark : Theme.Light);

async function refreshTheme() {
    await nextTick();
    isSysDarkTheme.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
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

window.matchMedia("(prefers-color-scheme: dark)")
    .addEventListener('change', () => {
        refreshTheme().then();
    })
