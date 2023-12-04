import {ref, computed} from "vue";
import {StyleProvider, Themes} from '@varlet/ui';

let currentTheme = ref("light");

function refreshTheme() {
    document.body.setAttribute("theme", currentTheme.value);
    StyleProvider(currentTheme.value === "light" ? null : Themes.dark);
}

export const isLight = computed(() => currentTheme.value === "light");
export const isDark = computed(() => currentTheme.value === "dark");

export function setTheme(theme: string) {
    currentTheme.value = theme;
    refreshTheme();
}

export function toggleTheme() {
    setTheme(currentTheme.value === "light" ? "dark" : "light");
}
