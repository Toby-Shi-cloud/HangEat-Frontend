const os = function () {
    let ua = navigator.userAgent,
        isWindowsPhone = /Windows Phone/.test(ua),
        isSymbian = /SymbianOS/.test(ua) || isWindowsPhone,
        isAndroid = /Android/.test(ua),
        isFireFox = /Firefox/.test(ua),
        isChrome = /Chrome|CriOS/.test(ua),
        isTablet = /iPad|PlayBook/.test(ua) || (isAndroid && !/Mobile/.test(ua)) || (isFireFox && /Tablet/.test(ua)),
        isPhone = /iPhone/.test(ua) && !isTablet,
        isPc = !isPhone && !isAndroid && !isSymbian;
    return {
        isWindowsPhone: isWindowsPhone,
        isSymbian: isSymbian,
        isAndroid: isAndroid,
        isFireFox: isFireFox,
        isChrome: isChrome,
        isTablet: isTablet,
        isPhone: isPhone,
        isPc: isPc
    };
}();

export default os;