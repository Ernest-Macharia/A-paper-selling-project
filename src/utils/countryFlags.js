export function getCountryFlag(countryCode) {
    return `<img src="https://flagcdn.com/16x12/${countryCode.toLowerCase()}.png" 
                srcset="https://flagcdn.com/32x24/${countryCode.toLowerCase()}.png 2x,
                        https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png 3x"
                width="16"
                height="12"
                alt="${countryCode}">`;
}
